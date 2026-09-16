#!/usr/bin/env node
/*
 * One-time library organizer: copies existing Vercel Blob objects to canonical
 * storage keys and updates the resources table.
 *
 * Canonical key: staff-library/{subject}/{grade}/{type}_{topic}_{date}_{checksum8}.pdf
 *
 * Default mode is dry-run. Use --apply --yes to copy blobs and update DB rows.
 */
const fs = require('fs');
const crypto = require('crypto');

const APPLY = process.argv.includes('--apply');
const YES = process.argv.includes('--yes');
const JSON_OUT = process.argv.includes('--json');
const LIMIT = numberArg('--limit=') || Infinity;
const ONLY_IDS = new Set(valuesArg('--only='));

loadEnv('.env.local');
loadEnv('.env');

const required = ['POSTGRES_URL'];
if (APPLY) required.push('BLOB_READ_WRITE_TOKEN');
for (const key of required) {
  if (!process.env[key]) fatal(`${key} is required. Add it to .env.local or the process environment.`);
}
if (APPLY && !YES) fatal('Refusing to apply without --yes. Run dry-run first, then use --apply --yes.');

const VALID_TYPES = new Set(['worksheet', 'quiz', 'test']);

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

function checksum8(row) {
  if (row.source_checksum && row.source_checksum.length >= 8) return row.source_checksum.slice(0, 8);
  return crypto.createHash('md5').update(row.storage_key || row.id).digest('hex').slice(0, 8);
}

const CANONICAL_RE = /^staff-library\/[^/]+\/[^/]+\/(worksheet|quiz|test)_[^_/]+(?:_[^_/]+)*_\d{4}-\d{2}-\d{2}_[0-9a-f]{8}\.pdf$/i;

function canonicalPath(row) {
  const type = String(row.type).toLowerCase();
  if (!VALID_TYPES.has(type)) return null;
  const subject = slugify(row.subject);
  const grade = gradeSlug(row.grade);
  const topic = slugify(row.topic || row.title);
  const added = String(row.added || '').slice(0, 10);
  if (!subject || !grade || !topic || !/^\d{4}-\d{2}-\d{2}$/.test(added)) return null;
  return `staff-library/${subject}/${grade}/${type}_${topic}_${added}_${checksum8(row)}.pdf`;
}

async function main() {
  const { sql } = await import('@vercel/postgres');
  const { copy, del, head } = await import('@vercel/blob');

  const { rows } = await sql`
    SELECT * FROM resources ORDER BY created_at ASC
  `;

  const selected = (rows || []).filter((row) => !ONLY_IDS.size || ONLY_IDS.has(row.id)).slice(0, LIMIT);
  const report = [];
  for (const row of selected) {
    const storageKey = row.storage_key;
    if (row.storage_provider !== 'vercel_blob' || !storageKey) {
      report.push({ id: row.id, title: row.title, action: 'skip', reason: 'not a vercel_blob row' });
      continue;
    }
    if (CANONICAL_RE.test(storageKey)) {
      report.push({ id: row.id, title: row.title, action: 'skip', reason: 'already canonical', storageKey });
      continue;
    }
    const target = canonicalPath(row);
    if (!target) {
      report.push({ id: row.id, title: row.title, action: 'skip', reason: 'incomplete metadata', storageKey });
      continue;
    }
    report.push({
      id: row.id,
      title: row.title,
      action: 'rename',
      from: storageKey,
      to: target,
      fileUrl: row.file_url,
    });
  }

  const renames = report.filter((r) => r.action === 'rename');
  if (JSON_OUT) {
    console.log(JSON.stringify({ total: report.length, renames: renames.length, report }, null, 2));
  } else {
    console.log(`Library organizer: total=${report.length} rename=${renames.length} skip=${report.length - renames.length}`);
    for (const item of renames) {
      console.log(`- ${item.id} | ${item.title}`);
      console.log(`    ${item.from}`);
      console.log(` -> ${item.to}`);
    }
    for (const item of report.filter((r) => r.action === 'skip')) {
      console.log(`skip ${item.id} | ${item.title} | ${item.reason}`);
    }
  }

  if (APPLY) {
    let copied = 0;
    let errors = 0;
    for (const item of renames) {
      try {
        if (!item.fileUrl) {
          console.log(`skip-copy ${item.id} no file_url on row`);
          continue;
        }
        const existing = await head(item.to, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(() => null);
        if (existing) {
          console.log(`skip-copy ${item.id} target already exists: ${item.to}`);
          continue;
        }
        const { url } = await copy({
          fromUrl: item.fileUrl,
          toPath: item.to,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        await sql`
          UPDATE resources SET storage_key = ${item.to}, file_url = ${url} WHERE id = ${item.id}
        `;
        await del(item.from, { token: process.env.BLOB_READ_WRITE_TOKEN });
        copied += 1;
        console.log(`renamed ${item.id} -> ${item.to}`);
      } catch (err) {
        errors += 1;
        console.error(`ERROR rename ${item.id}: ${err.message}`);
      }
    }
    console.log(`ORGANIZE copied=${copied} errors=${errors}`);
    if (errors) process.exitCode = 1;
  } else {
    console.log('\nDry run only. Re-run with --apply --yes to copy blobs and update DB rows.');
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

function valuesArg(prefix) {
  const arg = process.argv.find((v) => v.startsWith(prefix));
  if (!arg) return [];
  return arg.slice(prefix.length).split(',').map((v) => v.trim()).filter(Boolean);
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
