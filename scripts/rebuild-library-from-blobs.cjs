#!/usr/bin/env node
/*
 * Rebuilds the staff resource library from the Vercel Blob store after the
 * Supabase project was lost.
 *
 * 1. Lists every blob in the store.
 * 2. Classifies subject/grade/type/difficulty from the filename.
 * 3. Maps each PDF to the canonical key
 *    staff-library/{subject}/{grade}/{type}_{topic}_{date}_{checksum8}.pdf
 * 4. In apply mode: server-side copies to the canonical key, inserts the
 *    resources row, then deletes the original blob.
 *
 * Default mode is dry-run. Use --apply --yes to write.
 */
const fs = require('fs');
const crypto = require('crypto');

const APPLY = process.argv.includes('--apply');
const YES = process.argv.includes('--yes');
const JSON_OUT = process.argv.includes('--json');
const LIMIT = numberArg('--limit=') || Infinity;

loadEnv('.env.local');
loadEnv('.env');

const required = ['BLOB_READ_WRITE_TOKEN', 'POSTGRES_URL'];
for (const key of required) {
  if (!process.env[key]) fatal(`${key} is required. Add it to .env.local or the process environment.`);
}
if (APPLY && !YES) fatal('Refusing to apply without --yes. Run dry-run first, then use --apply --yes.');

const VALID_TYPES = new Set(['worksheet', 'quiz', 'test']);
const TYPE_LABEL = { worksheet: 'Worksheet', quiz: 'Quiz', test: 'Test' };
const DEFAULT_AUTHOR = 'Kody Kim';
const CANONICAL_RE = /^staff-library\/[^/]+\/[^/]+\/(worksheet|quiz|test)_[^/]+_\d{4}-\d{2}-\d{2}_[0-9a-f]{8}\.pdf$/i;
const AI_CACHE_FILE = process.env.CLASSIFY_CACHE || '/tmp/opencode/library-classification.json';

const GRADE_PATTERNS = [
  [/\b6(th)?\b|grade ?6|g6/i, '6th'],
  [/\b7(th)?\b|grade ?7|g7/i, '7th'],
  [/\b8(th)?\b|grade ?8|g8/i, '8th'],
  [/\b9(th)?\b|grade ?9|g9/i, '9th'],
  [/\b10(th)?\b|grade ?10|g10/i, '10th'],
  [/\b11(th)?\b|grade ?11|g11/i, '11th'],
  [/\b12(th)?\b|grade ?12|g12/i, '12th'],
  [/college/i, 'College'],
];

const SUBJECT_KEYWORDS = [
  ['Pre-Algebra', ['pre-alg', 'prealg', 'pre alg', 'integer']],
  ['Algebra 1', ['algebra1', 'algebra 1', 'alg1', 'alg 1', 'two-step', 'two step']],
  ['Algebra 2', ['algebra2', 'algebra 2', 'alg2', 'alg 2', 'logarithm', 'log ']],
  ['Geometry', ['geometry', 'geom', 'triangle', 'congruence', 'circle']],
  ['Pre-Calculus', ['precalc', 'pre-calc', 'pre calc', 'unit circle', 'radian', 'trig']],
  ['SAT Math', ['sat math', 'sat_math', 'nocalc', 'no-calc', 'no calc']],
  ['SAT Reading & Writing', ['sat reading', 'sat_reading', 'sat verbal', 'evidence']],
  ['SSAT', ['ssat', 'analog']],
  ['English', ['english', 'reading', 'inference', 'essay', 'comprehension']],
  ['Biology', ['biology', 'bio', 'cell', 'genetics']],
  ['Chemistry', ['chem', 'stoich', 'chemistry']],
  ['Physics', ['physics', 'mechanics', 'kinematics', 'forces']],
];

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function gradeSlug(grade) {
  const match = String(grade ?? '').toLowerCase().match(/^(\d{1,2})(?:st|nd|rd|th)$/);
  return match ? `grade-${match[1]}` : slugify(grade);
}

function checksum8(pathname) {
  return crypto.createHash('md5').update(pathname).digest('hex').slice(0, 8);
}

function classify(name) {
  const n = name.toLowerCase().replace(/\.pdf$/, '');
  const reasons = [];

  let type = 'worksheet';
  if (/(quiz|pop ?quiz)/i.test(n)) {
    type = 'quiz';
    reasons.push('type: quiz keyword');
  } else if (/(test|exam|midterm|final|assessment|diagnostic)/i.test(n)) {
    type = 'test';
    reasons.push('type: test keyword');
  }

  let subject = null;
  for (const [subj, kws] of SUBJECT_KEYWORDS) {
    if (kws.some((k) => n.includes(k))) {
      subject = subj;
      reasons.push(`subject: ${subj}`);
      break;
    }
  }

  let grade = null;
  for (const [re, g] of GRADE_PATTERNS) {
    if (re.test(n)) {
      grade = g;
      reasons.push(`grade: ${g}`);
      break;
    }
  }

  let difficulty = 'Intermediate';
  if (grade && ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'].includes(grade)) difficulty = 'Beginner';
  else if (grade && ['11th', '12th', 'College'].includes(grade)) difficulty = 'Advanced';

  let confidence = 'low';
  if (subject && grade) confidence = 'high';
  else if (subject || grade) confidence = 'medium';

  return {
    type,
    subject: subject || 'Algebra 1',
    grade: grade || '9th',
    difficulty,
    confidence,
    subjectKnown: !!subject,
    gradeKnown: !!grade,
    reasons,
  };
}

function topicFromFilename(name) {
  return name
    .replace(/\.pdf$/i, '')
    .replace(/^\d{1,2}[\s-]+/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/[-_](v\d+|final|copy|version ?\d+)\b/gi, '')
    .replace(/\b(17ef|pc|ws)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalPath(input) {
  return `staff-library/${slugify(input.subject)}/${gradeSlug(input.grade)}/${slugify(input.type)}_${slugify(input.topic)}_${input.added}_${input.checksum8}.pdf`;
}

async function listAllBlobs(listFn, token) {
  const all = [];
  let cursor = null;
  do {
    const page = await listFn({ token, limit: 1000, cursor: cursor ?? undefined });
    all.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : null;
  } while (cursor);
  return all;
}

async function main() {
  const { sql } = await import('@vercel/postgres');
  const { list, copy, del, head } = await import('@vercel/blob');
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  let aiCache = {};
  if (fs.existsSync(AI_CACHE_FILE)) {
    try { aiCache = JSON.parse(fs.readFileSync(AI_CACHE_FILE, 'utf8')); } catch { aiCache = {}; }
  }
  const aiUsed = Object.keys(aiCache).length;

  const blobs = await listAllBlobs(list, token).then((rows) => rows.slice(0, LIMIT));

  const report = [];
  const prefixCounts = {};
  for (const blob of blobs) {
    const top = blob.pathname.split('/').slice(0, 2).join('/');
    prefixCounts[top] = (prefixCounts[top] || 0) + 1;
  }

  for (const blob of blobs) {
    const pathname = blob.pathname;
    const filename = pathname.split('/').pop() || '';

    if (!/\.pdf$/i.test(filename)) {
      report.push({ pathname, action: 'skip', reason: 'not a pdf' });
      continue;
    }
    if (CANONICAL_RE.test(pathname)) {
      report.push({ pathname, action: 'skip', reason: 'already canonical' });
      continue;
    }

    const cls = classify(filename);
    const ai = aiCache[pathname];
    const meta = ai
      ? {
          type: VALID_TYPES.has(ai.type) ? ai.type : cls.type,
          subject: ai.subject || cls.subject,
          grade: ai.grade || cls.grade,
          difficulty: ai.difficulty || cls.difficulty,
          confidence: ai.confidence || cls.confidence,
        }
      : cls;
    const topic = (ai && ai.topic && ai.topic !== 'untitled' ? ai.topic : topicFromFilename(filename)) || 'untitled';
    const uploaded = blob.uploadedAt ? new Date(blob.uploadedAt).toISOString() : new Date().toISOString();
    const added = uploaded.slice(0, 10);
    const target = canonicalPath({
      subject: meta.subject,
      grade: meta.grade,
      type: meta.type,
      topic,
      added,
      checksum8: checksum8(pathname),
    });

    report.push({
      pathname,
      filename,
      action: 'rebuild',
      type: meta.type,
      subject: meta.subject,
      grade: meta.grade,
      topic,
      difficulty: meta.difficulty,
      confidence: meta.confidence,
      subjectKnown: cls.subjectKnown,
      gradeKnown: cls.gradeKnown,
      size: blob.size,
      added,
      target,
    });
  }

  const toRebuild = report.filter((r) => r.action === 'rebuild');
  const subjectCounts = {};
  const gradeCounts = {};
  const typeCounts = {};
  const confCounts = {};
  for (const r of toRebuild) {
    subjectCounts[r.subject] = (subjectCounts[r.subject] || 0) + 1;
    gradeCounts[r.grade] = (gradeCounts[r.grade] || 0) + 1;
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    confCounts[r.confidence] = (confCounts[r.confidence] || 0) + 1;
  }

  if (JSON_OUT) {
    console.log(JSON.stringify({
      totalBlobs: blobs.length,
      rebuildCount: toRebuild.length,
      skipCount: report.length - toRebuild.length,
      prefixCounts,
      subjectCounts,
      gradeCounts,
      typeCounts,
      confidenceCounts: confCounts,
      report,
    }, null, 2));
  } else {
    console.log(`Blob rebuild: total=${blobs.length} rebuild=${toRebuild.length} skip=${report.length - toRebuild.length}`);
    console.log(`\nPrefixes:`);
    for (const [k, v] of Object.entries(prefixCounts)) console.log(`  ${k}: ${v}`);
    console.log(`\nSubjects:`);
    for (const [k, v] of Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
    console.log(`\nGrades:`);
    for (const [k, v] of Object.entries(gradeCounts).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
    console.log(`\nTypes: worksheet=${typeCounts.worksheet || 0} quiz=${typeCounts.quiz || 0} test=${typeCounts.test || 0}`);
    console.log(`\nConfidence: ${JSON.stringify(confCounts)}`);
    console.log(`\nSample mappings:`);
    for (const r of toRebuild.slice(0, 10)) {
      console.log(`- ${r.filename}`);
      console.log(`    ${r.subject} / ${r.grade} / ${r.type} / ${r.confidence}`);
      console.log(` -> ${r.target}`);
    }
    for (const r of report.filter((x) => x.action === 'skip')) {
      console.log(`skip ${r.pathname} | ${r.reason}`);
    }
  }

  if (APPLY) {
    await sql`
      CREATE TABLE IF NOT EXISTS resources (
        id text PRIMARY KEY,
        type text NOT NULL CHECK (type IN ('worksheet', 'quiz', 'test')),
        title text NOT NULL,
        subject text NOT NULL,
        grade text NOT NULL,
        topic text NOT NULL,
        pages integer NOT NULL DEFAULT 1,
        difficulty text NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
        added date NOT NULL DEFAULT current_date,
        author text NOT NULL,
        file_url text,
        storage_provider text CHECK (storage_provider IN ('vercel_blob', 'supabase', 'external')),
        storage_key text,
        original_filename text,
        mime_type text,
        file_size bigint,
        classification_confidence text CHECK (classification_confidence IN ('high', 'medium', 'low')),
        source_provider text,
        source_project_ref text,
        source_table text,
        source_id text,
        source_bucket text,
        source_path text,
        source_checksum text,
        migrated_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    let rebuilt = 0;
    let skipped = 0;
    let errors = 0;
    for (const r of toRebuild) {
      try {
        const existingTarget = await head(r.target, { token }).catch(() => null);
        const { rows: existingRows } = await sql`
          SELECT id FROM resources WHERE source_id = ${r.pathname} LIMIT 1
        `;
        if (existingTarget || existingRows.length) {
          skipped += 1;
          if (!JSON_OUT) console.log(`skip ${r.pathname} (already rebuilt)`);
          continue;
        }

        const copied = await copy(r.pathname, r.target, { token, access: 'private', allowOverwrite: false });

        const id = crypto.randomUUID();
        const title = `${TYPE_LABEL[r.type]}: ${r.topic.charAt(0).toUpperCase()}${r.topic.slice(1)}`;
        await sql`
          INSERT INTO resources (
            id, type, title, subject, grade, topic, pages, difficulty, added, author,
            file_url, storage_provider, storage_key, original_filename, mime_type,
            file_size, classification_confidence, source_provider, source_project_ref,
            source_id, source_path, migrated_at
          ) VALUES (
            ${id}, ${r.type}, ${title}, ${r.subject}, ${r.grade}, ${r.topic}, 1,
            ${r.difficulty}, ${r.added}, ${DEFAULT_AUTHOR},
            ${copied.url}, 'vercel_blob', ${r.target}, ${r.filename}, 'application/pdf',
            ${r.size}, ${r.confidence}, 'vercel_blob', 'store_EqGAR2P2iGOkR6J5',
            ${r.pathname}, ${r.pathname}, now()
          )
        `;

        await del(r.pathname, { token });
        rebuilt += 1;
        if (!JSON_OUT) console.log(`rebuilt ${r.pathname} -> ${r.target}`);
      } catch (err) {
        errors += 1;
        console.error(`ERROR ${r.pathname}: ${err.message}`);
      }
    }
    console.log(`REBUILD rebuilt=${rebuilt} skipped=${skipped} errors=${errors}`);
    if (errors) process.exitCode = 1;
  } else {
    console.log('\nDry run only. Re-run with --apply --yes to copy blobs and insert rows.');
  }
}

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
}

function numberArg(prefix) {
  const arg = process.argv.find((v) => v.startsWith(prefix));
  if (!arg) return null;
  const n = Number(arg.slice(prefix.length));
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}

function fatal(message) {
  console.error(`FATAL ${message}`);
  process.exit(1);
}

main().catch((err) => fatal(err.message));
