#!/usr/bin/env node
/*
 * One-time AI classification pass for the blob-store library rebuild.
 *
 * For every PDF blob, sends the filename (plus the cheap heuristic guess) to
 * DeepSeek and stores { subject, grade, type, difficulty, topic, confidence }
 * in a resumable cache at CACHE_FILE. The rebuild script consumes the cache.
 *
 * Interruptible: results are written through after every response, so re-running
 * continues where it left off. Use --refresh to reclassify cached entries.
 */
const fs = require('fs');

const CACHE_FILE = process.env.CLASSIFY_CACHE || '/tmp/opencode/library-classification.json';
const REFRESH = process.argv.includes('--refresh');
const CONCURRENCY = numberArg('--concurrency=') || 12;

loadEnv('.env.local');
loadEnv('.env');

const API_KEY = process.env.DEEPSEEK_API_KEY;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!API_KEY) fatal('DEEPSEEK_API_KEY is required');
if (!BLOB_TOKEN) fatal('BLOB_READ_WRITE_TOKEN is required');

const SUBJECTS = ['Pre-Algebra', 'Algebra 1', 'Algebra 2', 'Geometry', 'Pre-Calculus', 'SAT Math', 'SAT Reading & Writing', 'SSAT', 'English', 'Biology', 'Chemistry', 'Physics'];
const GRADES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', 'College'];
const TYPES = ['worksheet', 'quiz', 'test'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const SYSTEM = [
  'You classify K-12 tutoring PDF files for a staff resource library.',
  'You are given a filename. Respond ONLY with a JSON object using this exact shape:',
  '{"subject": string, "grade": string, "type": string, "difficulty": string, "topic": string, "confidence": string}',
  `subject must be one of: ${SUBJECTS.join(', ')}.`,
  `grade must be one of: ${GRADES.join(', ')}.`,
  `type must be one of: ${TYPES.join(', ')}.`,
  `difficulty must be one of: ${DIFFICULTIES.join(', ')}.`,
  'confidence is high if the filename is decisive, medium if inferred, low if a guess.',
  'Rules:',
  '- "PC" or "precalc" means Pre-Calculus; "alg" means Algebra 1; "alg 2" means Algebra 2.',
  '- "grade N" / "Nth" / a leading bare number often means that grade; "17EF" or school-year codes are NOT grades.',
  '- fractions, decimals, percents, PEMDAS, order of operations, integer arithmetic: Pre-Algebra (or elementary grade).',
  '- SAT / PSAT / cycle files: SAT Math unless reading/writing is indicated; SSAT files: SSAT.',
  '- English: reading comprehension, grammar, vocabulary, writing, essays, ELA.',
  '- topic: a clean short topic for the file (max 40 chars), e.g. "multiply whole numbers", "linear equations word problems", "triangle congruence". Strip leading numbering, versions, and school-year codes.',
  '- If a filename is ambiguous, choose the most likely values and set confidence to medium or low.',
].join('\n');

const GRADE_PATTERNS = [
  [/\b1(st)?\b|grade ?1|g1/i, '1st'],
  [/\b2(nd)?\b|grade ?2|g2/i, '2nd'],
  [/\b3(rd)?\b|grade ?3|g3/i, '3rd'],
  [/\b4(th)?\b|grade ?4|g4/i, '4th'],
  [/\b5(th)?\b|grade ?5|g5/i, '5th'],
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
  ['Pre-Algebra', ['pre-alg', 'prealg', 'pre alg', 'integer', 'fraction', 'decimal', 'percent', 'pemdas', 'order of operations', 'place value', 'rounding', 'ratio', 'proportion']],
  ['Algebra 1', ['algebra1', 'algebra 1', 'alg1', 'alg 1', 'two-step', 'two step', 'linear', 'slope', 'quadratic', 'inequalit', 'systems of', 'exponent']],
  ['Algebra 2', ['algebra2', 'algebra 2', 'alg2', 'alg 2', 'logarithm', 'log ', 'factoring', 'polynomial', 'rational function', 'complex number']],
  ['Geometry', ['geometry', 'geom', 'triangle', 'congruence', 'circle', 'pythagorean', 'angle', 'proof', 'polygon', 'area', 'volume']],
  ['Pre-Calculus', ['precalc', 'pre-calc', 'pre calc', 'unit circle', 'radian', 'trig', 'vector', 'limit', 'sequence', 'series', '\\bpc\\b']],
  ['SAT Math', ['sat math', 'sat_math', 'nocalc', 'no-calc', 'no calc', '\\bsat\\b', 'psat']],
  ['SAT Reading & Writing', ['sat reading', 'sat_reading', 'sat verbal', 'evidence', 'sat writing']],
  ['SSAT', ['ssat', 'analog']],
  ['English', ['english', 'reading', 'inference', 'essay', 'comprehension', 'grammar', 'vocab', 'writing', 'ela']],
  ['Biology', ['biology', 'bio', 'cell', 'genetics', 'ecosystem']],
  ['Chemistry', ['chem', 'stoich', 'chemistry', 'periodic']],
  ['Physics', ['physics', 'mechanics', 'kinematics', 'forces', 'momentum']],
];

function heuristic(name) {
  const n = name.toLowerCase().replace(/\.pdf$/, '');
  let type = 'worksheet';
  if (/(quiz|pop ?quiz)/i.test(n)) type = 'quiz';
  else if (/(test|exam|midterm|final|assessment|diagnostic)/i.test(n)) type = 'test';

  let subject = null;
  for (const [subj, kws] of SUBJECT_KEYWORDS) {
    if (kws.some((k) => new RegExp(k, 'i').test(n))) { subject = subj; break; }
  }

  let grade = null;
  for (const [re, g] of GRADE_PATTERNS) {
    if (re.test(n)) { grade = g; break; }
  }

  let difficulty = 'Intermediate';
  if (grade && ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'].includes(grade)) difficulty = 'Beginner';
  else if (grade && ['11th', '12th', 'College'].includes(grade)) difficulty = 'Advanced';

  let confidence = 'low';
  if (subject && grade) confidence = 'high';
  else if (subject || grade) confidence = 'medium';

  return {
    subject: subject || 'Algebra 1',
    grade: grade || '9th',
    type,
    difficulty,
    confidence,
  };
}

function coerce(parsed, fallback) {
  const subject = SUBJECTS.includes(parsed.subject) ? parsed.subject : fallback.subject;
  const grade = GRADES.includes(parsed.grade) ? parsed.grade : fallback.grade;
  const type = TYPES.includes(parsed.type) ? parsed.type : fallback.type;
  const difficulty = DIFFICULTIES.includes(parsed.difficulty) ? parsed.difficulty : fallback.difficulty;
  const confidence = ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : fallback.confidence;
  const topic = String(parsed.topic || '').trim().slice(0, 60) || fallback.topic || 'untitled';
  return { subject, grade, type, difficulty, confidence, topic };
}

async function classifyOne(pathname) {
  const filename = pathname.split('/').pop() || pathname;
  const hint = heuristic(filename);

  const body = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM },
      {
        role: 'user',
        content: JSON.stringify({
          filename,
          heuristicGuess: hint,
          instructions: 'Classify this tutoring PDF. Respond with JSON only.',
        }),
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
    max_tokens: 300,
  };

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 160)}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content || '';
  let parsed = null;
  try {
    parsed = JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) { try { parsed = JSON.parse(match[0]); } catch { parsed = null; } }
  }
  if (!parsed) return { ...hint, topic: filename.replace(/\.pdf$/i, ''), confidence: 'low' };
  return coerce(parsed, { ...hint, topic: filename.replace(/\.pdf$/i, '') });
}

async function main() {
  const { list } = await import('@vercel/blob');

  const all = [];
  let cursor = null;
  do {
    const page = await list({ token: BLOB_TOKEN, limit: 1000, cursor: cursor ?? undefined });
    all.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : null;
  } while (cursor);

  const pdfs = all.filter((b) => /\.pdf$/i.test(b.pathname.split('/').pop() || ''));

  let cache = {};
  if (!REFRESH && fs.existsSync(CACHE_FILE)) {
    try { cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); } catch { cache = {}; }
  }

  const pending = pdfs.filter((b) => !cache[b.pathname]);
  console.log(`total=${pdfs.length} cached=${pdfs.length - pending.length} pending=${pending.length}`);

  let done = 0;
  let failed = 0;
  const saveCache = () => fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));

  const queue = [...pending];
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length) {
      const blob = queue.shift();
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          const result = await classifyOne(blob.pathname);
          cache[blob.pathname] = { filename: blob.pathname.split('/').pop(), ...result };
          done += 1;
          saveCache();
          if (done % 50 === 0 || done === pending.length) {
            console.log(`progress ${done}/${pending.length}`);
          }
          break;
        } catch (err) {
          if (attempt === 4) {
            failed += 1;
            console.error(`FAILED ${blob.pathname}: ${err.message}`);
          } else {
            await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
          }
        }
      }
    }
  });
  await Promise.all(workers);

  saveCache();
  const counts = { subject: {}, grade: {}, type: {}, confidence: {} };
  for (const v of Object.values(cache)) {
    counts.subject[v.subject] = (counts.subject[v.subject] || 0) + 1;
    counts.grade[v.grade] = (counts.grade[v.grade] || 0) + 1;
    counts.type[v.type] = (counts.type[v.type] || 0) + 1;
    counts.confidence[v.confidence] = (counts.confidence[v.confidence] || 0) + 1;
  }
  console.log('\nsubjects:', JSON.stringify(counts.subject));
  console.log('grades:', JSON.stringify(counts.grade));
  console.log('types:', JSON.stringify(counts.type));
  console.log('confidence:', JSON.stringify(counts.confidence));
  console.log(`\nclassified=${done} failed=${failed} cache=${CACHE_FILE}`);
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
