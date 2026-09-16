import { sql } from '@vercel/postgres';

/**
 * Staff portal schema on native Vercel Postgres — self-managed the same way
 * as the diagnostic leads and group SAT tables. Safe to call from any
 * request; `ensureStaffSchema` is memoized per process.
 */

let schemaReady: Promise<void> | null = null;

export function ensureStaffSchema(): Promise<void> {
  schemaReady ??= (async () => {
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
    await sql`CREATE INDEX IF NOT EXISTS resources_type_idx ON resources (type)`;
    await sql`CREATE INDEX IF NOT EXISTS resources_subject_idx ON resources (subject)`;
    await sql`CREATE INDEX IF NOT EXISTS resources_grade_idx ON resources (grade)`;
    await sql`CREATE INDEX IF NOT EXISTS resources_difficulty_idx ON resources (difficulty)`;
    await sql`CREATE INDEX IF NOT EXISTS resources_added_created_idx ON resources (added DESC, created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS resources_storage_key_idx ON resources (storage_key) WHERE storage_key IS NOT NULL`;
    await sql`CREATE INDEX IF NOT EXISTS resources_source_idx ON resources (source_provider, source_project_ref, source_id) WHERE source_id IS NOT NULL`;
    await sql`CREATE INDEX IF NOT EXISTS resources_source_checksum_idx ON resources (source_checksum) WHERE source_checksum IS NOT NULL`;

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
    await sql`CREATE INDEX IF NOT EXISTS staff_allowlist_email_idx ON staff_allowlist (email)`;
    await sql`CREATE INDEX IF NOT EXISTS staff_allowlist_status_idx ON staff_allowlist (status)`;

    await sql`
      CREATE TABLE IF NOT EXISTS staff_sessions (
        email text PRIMARY KEY,
        name text,
        provider text NOT NULL DEFAULT 'google',
        last_sign_in_at timestamptz NOT NULL DEFAULT now()
      )
    `;
  })();
  return schemaReady;
}
