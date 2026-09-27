import { sql } from '@vercel/postgres';
import { ensureStaffSchema } from './db';
import { toTutor, type DbTutorRow } from './tutor-db';
import { DEFAULT_EDUCATORS } from '@/lib/educators/seed';
import type { Tutor, TutorDraft } from './types';

/**
 * Public tutor profiles for /educators, managed by admins in the staff portal.
 * Seeded once from the original hardcoded roster (guarded by a seed flag so
 * deleting every tutor never resurrects them).
 */

let seeded: Promise<void> | null = null;

/** @vercel/postgres types require a scalar; JS arrays serialize as text[] at runtime. */
const pgArray = (values: string[]): string => values as unknown as string;

function seedDefaultTutors(): Promise<void> {
  seeded ??= (async () => {
    await ensureStaffSchema();
    const { rows } = await sql<{ key: string }>`
      INSERT INTO seed_flags (key) VALUES ('tutors_v1') ON CONFLICT (key) DO NOTHING RETURNING key
    `;
    if (!rows[0]) return;

    for (const tutor of DEFAULT_EDUCATORS) {
      await sql`
        INSERT INTO tutors (
          id, name, subjects, tagline, image_url, image_key, bio, achievements,
          experience, certifications, fun_fact, grades, category, sort_order, published
        ) VALUES (
          ${tutor.id}, ${tutor.name}, ${pgArray(tutor.subjects)}, ${tutor.tagline},
          ${tutor.imageUrl}, ${tutor.imageKey ?? null}, ${tutor.bio}, ${pgArray(tutor.achievements)},
          ${tutor.experience}, ${tutor.certifications}, ${tutor.funFact}, ${tutor.grades},
          ${tutor.category}, ${tutor.sortOrder}, ${tutor.published}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  })();
  return seeded;
}

export async function listPublishedTutors(): Promise<Tutor[]> {
  await ensureStaffSchema();
  await seedDefaultTutors();
  const { rows } = await sql<DbTutorRow>`
    SELECT * FROM tutors WHERE published = true ORDER BY sort_order ASC, name ASC
  `;
  return rows.map(toTutor);
}

/** Public read that never breaks the page if the database is unreachable. */
export async function listPublishedTutorsSafe(): Promise<Tutor[]> {
  try {
    return await listPublishedTutors();
  } catch (err) {
    console.error('listPublishedTutors failed; using seed fallback:', err);
    return DEFAULT_EDUCATORS;
  }
}

export async function listAllTutors(): Promise<Tutor[]> {
  await ensureStaffSchema();
  await seedDefaultTutors();
  const { rows } = await sql<DbTutorRow>`
    SELECT * FROM tutors ORDER BY sort_order ASC, name ASC
  `;
  return rows.map(toTutor);
}

export async function getTutor(id: string): Promise<Tutor | null> {
  await ensureStaffSchema();
  const { rows } = await sql<DbTutorRow>`
    SELECT * FROM tutors WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ? toTutor(rows[0]) : null;
}

async function nextSortOrder(): Promise<number> {
  const { rows } = await sql<{ next: number | null }>`
    SELECT (COALESCE(MAX(sort_order), -1) + 1) AS next FROM tutors
  `;
  return rows[0]?.next ?? 0;
}

export async function createTutor(draft: TutorDraft): Promise<Tutor> {
  await ensureStaffSchema();
  const id = crypto.randomUUID();
  const sortOrder = draft.sortOrder ?? (await nextSortOrder());
  const { rows } = await sql<DbTutorRow>`
    INSERT INTO tutors (
      id, name, subjects, tagline, image_url, image_key, bio, achievements,
      experience, certifications, fun_fact, grades, category, sort_order, published
    ) VALUES (
      ${id}, ${draft.name}, ${pgArray(draft.subjects ?? [])}, ${draft.tagline ?? ''},
      ${draft.imageUrl ?? ''}, ${draft.imageKey ?? null}, ${draft.bio ?? ''},
      ${pgArray(draft.achievements ?? [])}, ${draft.experience ?? ''}, ${draft.certifications ?? ''},
      ${draft.funFact ?? ''}, ${draft.grades ?? ''}, ${draft.category ?? ''},
      ${sortOrder}, ${draft.published ?? true}
    )
    RETURNING *
  `;
  return toTutor(rows[0]);
}

export async function updateTutor(id: string, patch: Partial<TutorDraft>): Promise<Tutor | null> {
  await ensureStaffSchema();
  const current = await getTutor(id);
  if (!current) return null;

  const merged: Tutor = {
    ...current,
    ...patch,
    subjects: patch.subjects ?? current.subjects,
    achievements: patch.achievements ?? current.achievements,
    // Clear the stored blob key when the image is removed or replaced by URL,
    // unless the caller explicitly supplied a new key.
    imageKey:
      patch.imageKey !== undefined
        ? patch.imageKey
        : patch.imageUrl !== undefined && patch.imageUrl !== current.imageUrl
          ? undefined
          : current.imageKey,
  };

  const { rows } = await sql<DbTutorRow>`
    UPDATE tutors SET
      name = ${merged.name}, subjects = ${pgArray(merged.subjects)}, tagline = ${merged.tagline},
      image_url = ${merged.imageUrl}, image_key = ${merged.imageKey ?? null}, bio = ${merged.bio},
      achievements = ${pgArray(merged.achievements)}, experience = ${merged.experience},
      certifications = ${merged.certifications}, fun_fact = ${merged.funFact},
      grades = ${merged.grades}, category = ${merged.category},
      sort_order = ${merged.sortOrder}, published = ${merged.published}, updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return toTutor(rows[0]);
}

export interface DeletedTutor {
  id: string;
  imageKey: string | null;
}

export async function deleteTutor(id: string): Promise<DeletedTutor | null> {
  await ensureStaffSchema();
  const { rows } = await sql<{ id: string; image_key: string | null }>`
    DELETE FROM tutors WHERE id = ${id} RETURNING id, image_key
  `;
  if (!rows[0]) return null;
  return { id: rows[0].id, imageKey: rows[0].image_key };
}
