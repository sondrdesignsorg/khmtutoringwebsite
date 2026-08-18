#!/usr/bin/env node
/*
 * Audits KHM staff library resources for inaccessible files and likely non-tutoring PDFs.
 * Default mode is dry-run. Use --delete --yes to remove flagged DB rows and Vercel Blob files.
 */
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const DELETE = process.argv.includes('--delete');
const YES = process.argv.includes('--yes');
const JSON_OUT = process.argv.includes('--json');
const LIMIT = numberArg('--limit=') || Infinity;
const KEEP_IDS = new Set(valuesArg('--keep='));
const ONLY_IDS = new Set(valuesArg('--only='));
const BUSINESS_RE = /\b(invoice|receipt|quote|proposal|contract|agreement|w-?9|1099|tax|irs|bank|statement|payroll|paystub|insurance|lease|rent|utility|bill|payment|venmo|zelle|cashapp|quickbooks|bookkeeping|accounting|profit|loss|p&l|balance sheet|resume|cv|cover letter|employee|onboarding|business plan|brand|branding|logo|website|web design|client|sondr|estimate)\b/i;
const NON_LIBRARY_RE = /\b(admin|business|finance|financial|legal|personal|hr|operations|marketing|brand|branding|website|taxes?|receipts?|invoices?|contracts?|leases?|banking)\b/i;
const PDF_RE = /\.pdf($|[?#])/i;

loadEnv('.env.local');
loadEnv('.env');

const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
if (DELETE) required.push('BLOB_READ_WRITE_TOKEN');
for (const key of required) {
  if (!process.env[key]) fatal(`${key} is required. Add it to .env.local or the process environment.`);
}
if (DELETE && !YES) fatal('Refusing to delete without --yes. Run dry-run first, then use --delete --yes.');

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { get, del } = await import('@vercel/blob');

  const { data, error } = await db
    .from('resources')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;

  const rows = (data || []).filter((row) => !ONLY_IDS.size || ONLY_IDS.has(row.id)).slice(0, LIMIT);
  const report = [];
  for (const row of rows) {
    const audit = await auditRow(row, get);
    report.push(audit);
  }

  const flagged = report.filter((r) => r.action === 'delete' && !KEEP_IDS.has(r.id));
  if (JSON_OUT) {
    console.log(JSON.stringify({ total: report.length, flagged: flagged.length, report }, null, 2));
  } else {
    printReport(report, flagged);
  }

  if (DELETE) {
    let deleted = 0;
    let errors = 0;
    for (const item of flagged) {
      try {
        if (item.storageProvider === 'vercel_blob' && item.storageKey) {
          await del(item.storageKey, { token: process.env.BLOB_READ_WRITE_TOKEN });
        }
        const { error: deleteError } = await db.from('resources').delete().eq('id', item.id);
        if (deleteError) throw deleteError;
        deleted += 1;
        if (!JSON_OUT) console.log(`deleted ${item.id} ${item.title}`);
      } catch (err) {
        errors += 1;
        console.error(`ERROR deleting ${item.id}: ${err.message}`);
      }
    }
    console.log(`CLEANUP deleted=${deleted} errors=${errors}`);
    if (errors) process.exitCode = 1;
  }
}

async function auditRow(row, blobGet) {
  const reasons = [];
  const text = [
    row.title,
    row.topic,
    row.original_filename,
    row.source_path,
    row.source_id,
    row.file_url,
    row.storage_key,
  ].filter(Boolean).join(' ');

  if (BUSINESS_RE.test(text) || NON_LIBRARY_RE.test(text)) {
    reasons.push('likely business/admin document');
  }

  const fileName = row.original_filename || row.storage_key || row.file_url || '';
  if (row.mime_type && !/pdf/i.test(row.mime_type)) reasons.push(`non-PDF mime type: ${row.mime_type}`);
  if (fileName && !PDF_RE.test(fileName)) reasons.push('file is not named as a PDF');
  if (!row.storage_key && !row.file_url) reasons.push('no file is attached');

  if (row.storage_provider === 'vercel_blob' && row.storage_key) {
    try {
      const blob = await blobGet(row.storage_key, { access: 'private' });
      if (!blob || blob.statusCode !== 200 || !blob.stream) reasons.push('Vercel Blob object is inaccessible');
    } catch (err) {
      reasons.push(`Vercel Blob lookup failed: ${compactError(err)}`);
    }
  } else if (row.file_url) {
    try {
      const res = await fetch(row.file_url, { method: 'HEAD' });
      if (!res.ok) reasons.push(`external URL is inaccessible: HTTP ${res.status}`);
    } catch (err) {
      reasons.push(`external URL lookup failed: ${compactError(err)}`);
    }
  }

  return {
    id: row.id,
    action: reasons.length ? 'delete' : 'keep',
    reasons,
    title: row.title,
    subject: row.subject,
    grade: row.grade,
    type: row.type,
    originalFilename: row.original_filename,
    sourcePath: row.source_path,
    storageProvider: row.storage_provider,
    storageKey: row.storage_key,
    fileUrl: row.file_url,
  };
}

function printReport(report, flagged) {
  const kept = report.length - flagged.length;
  console.log(`Library audit: total=${report.length} keep=${kept} flagged=${flagged.length}`);
  if (!flagged.length) {
    console.log('No resources matched deletion criteria.');
    return;
  }
  console.log('\nFlagged for deletion:');
  for (const item of flagged) {
    console.log(`- ${item.id} | ${item.title} | ${item.originalFilename || item.storageKey || 'no filename'}`);
    for (const reason of item.reasons) console.log(`  reason: ${reason}`);
  }
  if (!DELETE) console.log('\nDry run only. Re-run with --delete --yes to remove flagged rows/files.');
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

function compactError(err) {
  return err && err.message ? err.message.split('\n')[0] : String(err);
}

function fatal(message) {
  console.error(`FATAL ${message}`);
  process.exit(1);
}

main().catch((err) => fatal(err.message));
