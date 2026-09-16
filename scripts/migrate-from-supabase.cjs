#!/usr/bin/env node
/*
 * One-time migration: Supabase (auth users + resources) -> native Vercel Postgres.
 *
 * 1. Copies every `resources` row into Vercel Postgres (ON CONFLICT DO NOTHING).
 * 2. Seeds `staff_allowlist` from Supabase auth users that have a staff role,
 *    issuing a fresh PIN for each (printed once here so you can share/reset them).
 * 3. Prints a summary. Safe to re-run; existing rows are skipped.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, POSTGRES_URL.
 * Run with --yes to confirm you are ready (affects the live Vercel DB).
 */
const fs = require('fs');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const YES = process.argv.includes('--yes');

loadEnv('.env.local');
loadEnv('.env');

const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'POSTGRES_URL'];
for (const key of required) {
  if (!process.env[key]) fatal(`${key} is required. Add it to .env.local or the process environment.`);
}
if (!YES) fatal('This writes to the live Vercel Postgres database. Re-run with --yes to proceed.');

function generatePin() {
  return crypto.randomInt(0, 1000000).toString().padStart(6, '0');
}

function hashPin(pin) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pin, salt, 32).toString('hex');
  return `${salt.toString('hex')}:${hash}`;
}

async function main() {
  const { sql } = await import('@vercel/postgres');
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

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
  await sql`
    CREATE TABLE IF NOT EXISTS staff_allowlist (
      id text PRIMARY KEY,
      email text NOT NULL UNIQUE,
      role text NOT NULL DEFAULT 'tutor' CHECK (role IN ('tutor', 'admin')),
      pin_hash text,
      pin_updated_at timestamptz,
      failed_attempts integer NOT NULL DEFAULT 0,
      locked_until timestamptz,
      status text NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'disabled')),
      invited_by text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  // 1. Resources
  const { data: resources, error } = await supabase.from('resources').select('*');
  if (error) fatal(`Supabase resources read failed: ${error.message}`);
  let inserted = 0;
  for (const row of resources ?? []) {
    const v = (col) => (row[col] === undefined ? null : row[col]);
    const { rowCount } = await sql`
      INSERT INTO resources (
        id, type, title, subject, grade, topic, pages, difficulty, added, author,
        file_url, storage_provider, storage_key, original_filename, mime_type,
        file_size, classification_confidence, source_provider, source_project_ref,
        source_table, source_id, source_bucket, source_path, source_checksum, migrated_at
      ) VALUES (
        ${v('id')}, ${v('type')}, ${v('title')}, ${v('subject')}, ${v('grade')},
        ${v('topic')}, ${v('pages')}, ${v('difficulty')}, ${v('added')}, ${v('author')},
        ${v('file_url')}, ${v('storage_provider')}, ${v('storage_key')}, ${v('original_filename')},
        ${v('mime_type')}, ${v('file_size')}, ${v('classification_confidence')},
        ${v('source_provider')}, ${v('source_project_ref')}, ${v('source_table')},
        ${v('source_id')}, ${v('source_bucket')}, ${v('source_path')}, ${v('source_checksum')},
        ${v('migrated_at')}
      )
      ON CONFLICT (id) DO NOTHING
    `;
    inserted += rowCount || 0;
  }
  console.log(`resources: ${(resources ?? []).length} in Supabase, ${inserted} newly inserted`);

  // 2. Staff users
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (usersError) fatal(`Supabase users read failed: ${usersError.message}`);
  const staffUsers = (usersData?.users ?? []).filter((u) => {
    const role = u.app_metadata?.role;
    return role === 'tutor' || role === 'admin';
  });

  const pins = [];
  for (const user of staffUsers) {
    const email = user.email.toLowerCase().trim();
    const pin = generatePin();
    const role = user.app_metadata.role;
    const { rowCount } = await sql`
      INSERT INTO staff_allowlist (id, email, role, pin_hash, pin_updated_at, status, invited_by)
      VALUES (${crypto.randomUUID()}, ${email}, ${role}, ${hashPin(pin)}, now(), 'invited', 'migration')
      ON CONFLICT (email) DO NOTHING
    `;
    if (rowCount) pins.push({ email, pin, role });
  }
  console.log(`staff: ${staffUsers.length} role-bearing users in Supabase, ${pins.length} newly added to allowlist`);
  for (const p of pins) {
    console.log(`  NEW PIN  ${p.email}  (${p.role})  ${p.pin}`);
  }
  console.log('\nShare these PINs with each staff member, or reset them from Staff Management.');
  console.log('Done. Supabase can be retired after you verify the library in the app.');
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

function fatal(message) {
  console.error(`FATAL ${message}`);
  process.exit(1);
}

main().catch((err) => fatal(err.message));
