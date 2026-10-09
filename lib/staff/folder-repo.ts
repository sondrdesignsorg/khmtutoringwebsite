import { sql } from '@vercel/postgres';
import { ensureStaffSchema } from './db';
import { DEFAULT_TEST_FOLDERS } from './resources';
import type { LibraryFolder, LibraryFolderDraft } from './types';

/**
 * Editable folders used to group library resources (primarily tests) by course.
 * Seeded once from DEFAULT_TEST_FOLDERS behind a seed flag so that deleting a
 * folder never resurrects it.
 */

let seeded: Promise<void> | null = null;

function seedDefaultFolders(): Promise<void> {
  seeded ??= (async () => {
    await ensureStaffSchema();
    const { rows } = await sql<{ key: string }>`
      INSERT INTO seed_flags (key) VALUES ('library_folders_v1') ON CONFLICT (key) DO NOTHING RETURNING key
    `;
    if (!rows[0]) return;

    for (const [index, name] of DEFAULT_TEST_FOLDERS.entries()) {
      await sql`
        INSERT INTO library_folders (id, name, sort_order)
        VALUES (${crypto.randomUUID()}, ${name}, ${index})
        ON CONFLICT (name) DO NOTHING
      `;
    }
  })();
  return seeded;
}

let backfilled: Promise<void> | null = null;

/**
 * One-time backfill that files the unambiguous tests into their folder
 * (APCH, Geometry, Pre-Calc). Algebra 2 tests are left unfiled because the
 * year/section can't be inferred from the filename.
 */
function backfillUnambiguousFolders(): Promise<void> {
  backfilled ??= (async () => {
    const { rows: flag } = await sql<{ key: string }>`
      INSERT INTO seed_flags (key) VALUES ('test_folder_backfill_v1')
      ON CONFLICT (key) DO NOTHING RETURNING key
    `;
    if (!flag[0]) return;

    const { rows: folders } = await sql<{ id: string; name: string }>`
      SELECT id, name FROM library_folders
    `;
    const idByName = new Map(folders.map((f) => [f.name, f.id]));

    const { rows: tests } = await sql<{
      id: string;
      title: string;
      subject: string;
      original_filename: string | null;
    }>`
      SELECT id, title, subject, original_filename
      FROM resources WHERE type = 'test' AND folder_id IS NULL
    `;

    for (const test of tests) {
      const haystack = `${test.title} ${test.original_filename ?? ''}`.toLowerCase();
      let folderName: string | null = null;
      if (/apch|ap chem/.test(haystack)) folderName = 'APCH';
      else if (test.subject === 'Geometry' || /geometry/.test(haystack)) folderName = 'Geometry';
      else if (test.subject === 'Pre-Calculus' || /pre-?calc/.test(haystack)) folderName = 'Pre-Calc 2024';

      const folderId = folderName ? idByName.get(folderName) : undefined;
      if (folderId) {
        await sql`UPDATE resources SET folder_id = ${folderId} WHERE id = ${test.id}`;
      }
    }
  })();
  return backfilled;
}

export async function listFolders(): Promise<LibraryFolder[]> {
  await ensureStaffSchema();
  await seedDefaultFolders();
  await backfillUnambiguousFolders();
  const { rows } = await sql<{ id: string; name: string; sort_order: number }>`
    SELECT id, name, sort_order FROM library_folders ORDER BY sort_order ASC, name ASC
  `;
  return rows.map((r) => ({ id: r.id, name: r.name, sortOrder: r.sort_order }));
}

async function nextSortOrder(): Promise<number> {
  const { rows } = await sql<{ next: number | null }>`
    SELECT (COALESCE(MAX(sort_order), -1) + 1) AS next FROM library_folders
  `;
  return rows[0]?.next ?? 0;
}

export async function createFolder(draft: LibraryFolderDraft): Promise<LibraryFolder> {
  await ensureStaffSchema();
  const name = draft.name.trim();
  const sortOrder = draft.sortOrder ?? (await nextSortOrder());
  const { rows } = await sql<{ id: string; name: string; sort_order: number }>`
    INSERT INTO library_folders (id, name, sort_order)
    VALUES (${crypto.randomUUID()}, ${name}, ${sortOrder})
    RETURNING id, name, sort_order
  `;
  return { id: rows[0].id, name: rows[0].name, sortOrder: rows[0].sort_order };
}

export async function updateFolder(id: string, patch: Partial<LibraryFolderDraft>): Promise<LibraryFolder | null> {
  await ensureStaffSchema();
  const { rows: currentRows } = await sql<{ id: string; name: string; sort_order: number }>`
    SELECT id, name, sort_order FROM library_folders WHERE id = ${id} LIMIT 1
  `;
  if (!currentRows[0]) return null;

  const name = patch.name?.trim() ?? currentRows[0].name;
  const sortOrder = patch.sortOrder ?? currentRows[0].sort_order;
  const { rows } = await sql<{ id: string; name: string; sort_order: number }>`
    UPDATE library_folders SET name = ${name}, sort_order = ${sortOrder}
    WHERE id = ${id}
    RETURNING id, name, sort_order
  `;
  return { id: rows[0].id, name: rows[0].name, sortOrder: rows[0].sort_order };
}

export async function deleteFolder(id: string): Promise<boolean> {
  await ensureStaffSchema();
  // Detach any resources so they are not orphaned by the folder removal.
  await sql`UPDATE resources SET folder_id = NULL WHERE folder_id = ${id}`;
  const { rowCount } = await sql`DELETE FROM library_folders WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}
