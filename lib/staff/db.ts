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
        folder_id text,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    // Existing deployments predate the folder feature; add the column in place.
    await sql`ALTER TABLE resources ADD COLUMN IF NOT EXISTS folder_id text`;
    await sql`CREATE INDEX IF NOT EXISTS resources_type_idx ON resources (type)`;
    await sql`CREATE INDEX IF NOT EXISTS resources_subject_idx ON resources (subject)`;
    await sql`CREATE INDEX IF NOT EXISTS resources_grade_idx ON resources (grade)`;
    await sql`CREATE INDEX IF NOT EXISTS resources_difficulty_idx ON resources (difficulty)`;
    await sql`CREATE INDEX IF NOT EXISTS resources_added_created_idx ON resources (added DESC, created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS resources_storage_key_idx ON resources (storage_key) WHERE storage_key IS NOT NULL`;
    await sql`CREATE INDEX IF NOT EXISTS resources_source_idx ON resources (source_provider, source_project_ref, source_id) WHERE source_id IS NOT NULL`;
    await sql`CREATE INDEX IF NOT EXISTS resources_source_checksum_idx ON resources (source_checksum) WHERE source_checksum IS NOT NULL`;
    await sql`CREATE INDEX IF NOT EXISTS resources_folder_idx ON resources (folder_id) WHERE folder_id IS NOT NULL`;

    await sql`
      CREATE TABLE IF NOT EXISTS library_folders (
        id text PRIMARY KEY,
        name text NOT NULL UNIQUE,
        sort_order integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS library_folders_sort_idx ON library_folders (sort_order, name)`;

    // Keep folder references valid. Best-effort: a failure here must not poison
    // the memoized schema promise and take down the whole staff portal.
    try {
      await sql`
        UPDATE resources SET folder_id = NULL
        WHERE folder_id IS NOT NULL AND folder_id NOT IN (SELECT id FROM library_folders)
      `;
      await sql`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resources_folder_id_fkey') THEN
            ALTER TABLE resources
              ADD CONSTRAINT resources_folder_id_fkey
              FOREIGN KEY (folder_id) REFERENCES library_folders(id) ON DELETE SET NULL;
          END IF;
        END $$;
      `;
    } catch (err) {
      console.error('resources.folder_id foreign key migration skipped:', err);
    }

    await sql`
      CREATE TABLE IF NOT EXISTS students (
        id text PRIMARY KEY,
        name text NOT NULL,
        email text NOT NULL DEFAULT '',
        grade text NOT NULL DEFAULT '',
        parent_name text NOT NULL DEFAULT '',
        phone text NOT NULL DEFAULT '',
        notes text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS students_name_idx ON students (name)`;
    await sql`CREATE INDEX IF NOT EXISTS students_email_idx ON students (email)`;
    try {
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS students_email_unique_idx
        ON students (lower(email)) WHERE email <> ''
      `;
    } catch (err) {
      console.error('students email unique index migration skipped:', err);
    }

    await sql`
      CREATE TABLE IF NOT EXISTS email_sends (
        id text PRIMARY KEY,
        staff_email text NOT NULL,
        recipient text NOT NULL,
        student_id text,
        resource_ids text[] NOT NULL DEFAULT '{}',
        subject text NOT NULL DEFAULT '',
        status text NOT NULL CHECK (status IN ('sent', 'failed')),
        error text,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS email_sends_staff_idx ON email_sends (staff_email, created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS email_sends_created_idx ON email_sends (created_at DESC)`;

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
      CREATE TABLE IF NOT EXISTS staff_pin_activations (
        id text PRIMARY KEY,
        email text NOT NULL,
        role text NOT NULL,
        method text NOT NULL DEFAULT 'universal',
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS staff_pin_activations_email_idx ON staff_pin_activations (email, created_at DESC)`;

    await sql`
      CREATE TABLE IF NOT EXISTS staff_sessions (
        email text PRIMARY KEY,
        name text,
        provider text NOT NULL DEFAULT 'google',
        last_sign_in_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tutors (
        id text PRIMARY KEY,
        name text NOT NULL,
        subjects text[] NOT NULL DEFAULT '{}',
        tagline text NOT NULL DEFAULT '',
        image_url text NOT NULL DEFAULT '',
        image_key text,
        bio text NOT NULL DEFAULT '',
        achievements text[] NOT NULL DEFAULT '{}',
        experience text NOT NULL DEFAULT '',
        certifications text NOT NULL DEFAULT '',
        fun_fact text NOT NULL DEFAULT '',
        grades text NOT NULL DEFAULT '',
        category text NOT NULL DEFAULT '',
        sort_order integer NOT NULL DEFAULT 0,
        published boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS tutors_published_sort_idx ON tutors (published, sort_order, name)`;

    await sql`
      CREATE TABLE IF NOT EXISTS seed_flags (
        key text PRIMARY KEY,
        seeded_at timestamptz NOT NULL DEFAULT now()
      )
    `;
  })();
  return schemaReady;
}
