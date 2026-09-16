import { sql } from '@vercel/postgres';
import { ensureStaffSchema } from './db';
import { toResource, toResourceInsert, toResourcePatch, type DbResourceRow } from './resource-db';
import type { Resource, ResourceDraft } from './types';

/**
 * Resource library data access on native Vercel Postgres.
 * All writes are admin-gated by the calling route handlers.
 */

export async function listResources(): Promise<Resource[]> {
  await ensureStaffSchema();
  const { rows } = await sql<DbResourceRow>`
    SELECT * FROM resources ORDER BY added DESC, created_at DESC
  `;
  return rows.map(toResource);
}

export async function getResource(id: string): Promise<Resource | null> {
  await ensureStaffSchema();
  const { rows } = await sql<DbResourceRow>`
    SELECT * FROM resources WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ? toResource(rows[0]) : null;
}

export async function getResourcesByIds(ids: string[]): Promise<Resource[]> {
  if (!ids.length) return [];
  await ensureStaffSchema();
  const { rows } = await sql<DbResourceRow>`
    SELECT * FROM resources WHERE id = ANY(${ids as unknown as string})
  `;
  return rows.map(toResource);
}

export async function createResource(draft: ResourceDraft): Promise<Resource> {
  await ensureStaffSchema();
  const added = draft.added ?? new Date().toISOString().slice(0, 10);
  const insert = toResourceInsert({ ...draft, added });
  const id = crypto.randomUUID();
  const { rows } = await sql<DbResourceRow>`
    INSERT INTO resources (
      id, type, title, subject, grade, topic, pages, difficulty, added, author,
      file_url, storage_provider, storage_key, original_filename, mime_type,
      file_size, classification_confidence, source_provider, source_project_ref,
      source_table, source_id, source_bucket, source_path, source_checksum, migrated_at
    ) VALUES (
      ${id}, ${insert.type ?? null}, ${insert.title ?? null}, ${insert.subject ?? null},
      ${insert.grade ?? null}, ${insert.topic ?? null}, ${insert.pages ?? null},
      ${insert.difficulty ?? null}, ${insert.added ?? null}, ${insert.author ?? null},
      ${insert.file_url ?? null}, ${insert.storage_provider ?? null}, ${insert.storage_key ?? null},
      ${insert.original_filename ?? null}, ${insert.mime_type ?? null}, ${insert.file_size ?? null},
      ${insert.classification_confidence ?? null}, ${insert.source_provider ?? null},
      ${insert.source_project_ref ?? null}, ${insert.source_table ?? null},
      ${insert.source_id ?? null}, ${insert.source_bucket ?? null}, ${insert.source_path ?? null},
      ${insert.source_checksum ?? null}, ${insert.migrated_at ?? null}
    )
    RETURNING *
  `;
  return toResource(rows[0]);
}

export async function bulkCreateResources(drafts: ResourceDraft[]): Promise<{ created: Resource[]; skipped: ResourceDraft[] }> {
  if (!drafts.length) return { created: [], skipped: [] };
  await ensureStaffSchema();

  const checksums = [...new Set(drafts.map((d) => d.sourceChecksum).filter(Boolean))] as string[];
  const existing = new Set<string>();
  if (checksums.length) {
    const { rows } = await sql<{ source_checksum: string | null }>`
      SELECT source_checksum FROM resources WHERE source_checksum = ANY(${checksums as unknown as string})
    `;
    for (const row of rows) if (row.source_checksum) existing.add(row.source_checksum);
  }

  const today = new Date().toISOString().slice(0, 10);
  const skipped = drafts.filter((d) => d.sourceChecksum && existing.has(d.sourceChecksum));
  const toCreate = drafts.filter((d) => !d.sourceChecksum || !existing.has(d.sourceChecksum));

  const created: Resource[] = [];
  for (const draft of toCreate) {
    created.push(await createResource({ ...draft, added: draft.added ?? today }));
  }

  return { created, skipped };
}

export async function updateResource(id: string, patch: Partial<Resource>): Promise<Resource | null> {
  await ensureStaffSchema();
  const { rows: currentRows } = await sql<DbResourceRow>`
    SELECT * FROM resources WHERE id = ${id} LIMIT 1
  `;
  if (!currentRows[0]) return null;

  const merged: DbResourceRow = { ...currentRows[0], ...toResourcePatch(patch) };
  const { rows } = await sql<DbResourceRow>`
    UPDATE resources SET
      type = ${merged.type}, title = ${merged.title}, subject = ${merged.subject},
      grade = ${merged.grade}, topic = ${merged.topic}, pages = ${merged.pages},
      difficulty = ${merged.difficulty}, added = ${merged.added}, author = ${merged.author},
      file_url = ${merged.file_url ?? null}, storage_provider = ${merged.storage_provider ?? null},
      storage_key = ${merged.storage_key ?? null}, original_filename = ${merged.original_filename ?? null},
      mime_type = ${merged.mime_type ?? null}, file_size = ${merged.file_size ?? null},
      classification_confidence = ${merged.classification_confidence ?? null},
      source_provider = ${merged.source_provider ?? null},
      source_project_ref = ${merged.source_project_ref ?? null},
      source_table = ${merged.source_table ?? null}, source_id = ${merged.source_id ?? null},
      source_bucket = ${merged.source_bucket ?? null}, source_path = ${merged.source_path ?? null},
      source_checksum = ${merged.source_checksum ?? null}, migrated_at = ${merged.migrated_at ?? null}
    WHERE id = ${id}
    RETURNING *
  `;
  return toResource(rows[0]);
}

export interface DeletedResourceFile {
  id: string;
  storageProvider: string | null;
  storageKey: string | null;
}

export async function deleteResource(id: string): Promise<DeletedResourceFile | null> {
  await ensureStaffSchema();
  const { rows } = await sql<DeletedResourceFile>`
    DELETE FROM resources WHERE id = ${id} RETURNING id, storage_provider, storage_key
  `;
  return rows[0] ?? null;
}

export async function deleteResourcesByIds(ids: string[]): Promise<DeletedResourceFile[]> {
  if (!ids.length) return [];
  await ensureStaffSchema();
  const { rows } = await sql<DeletedResourceFile>`
    DELETE FROM resources WHERE id = ANY(${ids as unknown as string}) RETURNING id, storage_provider, storage_key
  `;
  return rows;
}

export async function findDuplicateResources(files: {
  id: string;
  filename: string;
  fileSize?: number;
  checksum?: string;
}[]): Promise<Record<string, { resource: Resource; reason: string }>> {
  const duplicates: Record<string, { resource: Resource; reason: string }> = {};
  if (!files.length) return duplicates;
  await ensureStaffSchema();

  const checksums = [...new Set(files.map((f) => f.checksum).filter(Boolean))] as string[];
  if (checksums.length) {
    const { rows } = await sql<DbResourceRow>`
      SELECT * FROM resources WHERE source_checksum = ANY(${checksums as unknown as string})
    `;
    const byChecksum = new Map(rows.map((row) => [row.source_checksum, toResource(row)]));
    for (const file of files) {
      if (file.checksum && byChecksum.has(file.checksum)) {
        duplicates[file.id] = { resource: byChecksum.get(file.checksum)!, reason: 'same file hash' };
      }
    }
  }

  const remaining = files.filter((f) => !duplicates[f.id]);
  if (remaining.length) {
    const filenames = [...new Set(remaining.map((f) => f.filename).filter(Boolean))];
    if (filenames.length) {
      const { rows } = await sql<DbResourceRow>`
        SELECT * FROM resources WHERE original_filename = ANY(${filenames as unknown as string})
      `;
      const candidates = rows.map(toResource);
      for (const file of remaining) {
        const match = candidates.find((resource) =>
          resource.originalFilename === file.filename &&
          (typeof file.fileSize !== 'number' || typeof resource.fileSize !== 'number' || resource.fileSize === file.fileSize)
        );
        if (match) duplicates[file.id] = { resource: match, reason: 'same filename and size' };
      }
    }
  }

  return duplicates;
}
