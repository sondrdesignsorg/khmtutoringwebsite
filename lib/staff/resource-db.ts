import type { Confidence, Resource, ResourceDraft, StorageProvider } from './types';

export type DbResourceRow = {
  id: string;
  type: Resource['type'];
  title: string;
  subject: string;
  grade: string;
  topic: string;
  pages: number;
  difficulty: Resource['difficulty'];
  added: string;
  author: string;
  file_url?: string | null;
  storage_provider?: StorageProvider | null;
  storage_key?: string | null;
  original_filename?: string | null;
  mime_type?: string | null;
  file_size?: number | null;
  classification_confidence?: Confidence | null;
  source_provider?: string | null;
  source_project_ref?: string | null;
  source_table?: string | null;
  source_id?: string | null;
  source_bucket?: string | null;
  source_path?: string | null;
  source_checksum?: string | null;
  migrated_at?: string | null;
  created_at?: string;
};

export function toResource(row: DbResourceRow): Resource {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    subject: row.subject,
    grade: row.grade,
    topic: row.topic,
    pages: row.pages,
    difficulty: row.difficulty,
    added: String(row.added).slice(0, 10),
    author: row.author,
    ...(row.file_url ? { fileUrl: row.file_url } : {}),
    ...(row.storage_provider ? { storageProvider: row.storage_provider } : {}),
    ...(row.storage_key ? { storageKey: row.storage_key } : {}),
    ...(row.original_filename ? { originalFilename: row.original_filename } : {}),
    ...(row.mime_type ? { mimeType: row.mime_type } : {}),
    ...(typeof row.file_size === 'number' ? { fileSize: row.file_size } : {}),
    ...(row.classification_confidence ? { classificationConfidence: row.classification_confidence } : {}),
    ...(row.source_provider ? { sourceProvider: row.source_provider } : {}),
    ...(row.source_project_ref ? { sourceProjectRef: row.source_project_ref } : {}),
    ...(row.source_table ? { sourceTable: row.source_table } : {}),
    ...(row.source_id ? { sourceId: row.source_id } : {}),
    ...(row.source_bucket ? { sourceBucket: row.source_bucket } : {}),
    ...(row.source_path ? { sourcePath: row.source_path } : {}),
    ...(row.source_checksum ? { sourceChecksum: row.source_checksum } : {}),
    ...(row.migrated_at ? { migratedAt: row.migrated_at } : {}),
  };
}

export function toResourceInsert(draft: ResourceDraft & { added?: string }) {
  return stripUndefined({
    type: draft.type,
    title: draft.title,
    subject: draft.subject,
    grade: draft.grade,
    topic: draft.topic,
    pages: draft.pages,
    difficulty: draft.difficulty,
    added: draft.added,
    author: draft.author ?? 'Kody Kim',
    file_url: draft.fileUrl,
    storage_provider: draft.storageProvider,
    storage_key: draft.storageKey,
    original_filename: draft.originalFilename,
    mime_type: draft.mimeType,
    file_size: draft.fileSize,
    classification_confidence: draft.classificationConfidence,
    source_provider: draft.sourceProvider,
    source_project_ref: draft.sourceProjectRef,
    source_table: draft.sourceTable,
    source_id: draft.sourceId,
    source_bucket: draft.sourceBucket,
    source_path: draft.sourcePath,
    source_checksum: draft.sourceChecksum,
    migrated_at: draft.migratedAt,
  });
}

export function toResourcePatch(patch: Partial<Resource>) {
  return stripUndefined({
    type: patch.type,
    title: patch.title,
    subject: patch.subject,
    grade: patch.grade,
    topic: patch.topic,
    pages: patch.pages,
    difficulty: patch.difficulty,
    added: patch.added,
    author: patch.author,
    file_url: patch.fileUrl,
    storage_provider: patch.storageProvider,
    storage_key: patch.storageKey,
    original_filename: patch.originalFilename,
    mime_type: patch.mimeType,
    file_size: patch.fileSize,
    classification_confidence: patch.classificationConfidence,
    source_provider: patch.sourceProvider,
    source_project_ref: patch.sourceProjectRef,
    source_table: patch.sourceTable,
    source_id: patch.sourceId,
    source_bucket: patch.sourceBucket,
    source_path: patch.sourcePath,
    source_checksum: patch.sourceChecksum,
    migrated_at: patch.migratedAt,
  });
}

function stripUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as Partial<T>;
}
