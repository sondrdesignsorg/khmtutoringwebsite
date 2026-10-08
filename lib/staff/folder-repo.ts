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

export async function listFolders(): Promise<LibraryFolder[]> {
  await ensureStaffSchema();
  await seedDefaultFolders();
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
