// Shared types for the KHM staff resource library.

export type ResourceType = 'worksheet' | 'quiz' | 'test';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Confidence = 'high' | 'medium' | 'low';
export type StorageProvider = 'vercel_blob' | 'supabase' | 'external';

export interface ResourceSource {
  sourceProvider?: 'client_supabase' | string;
  sourceProjectRef?: string;
  sourceTable?: string;
  sourceId?: string;
  sourceBucket?: string;
  sourcePath?: string;
  sourceChecksum?: string;
  migratedAt?: string;
}

export interface Resource extends ResourceSource {
  id: string;
  type: ResourceType;
  title: string;
  subject: string;
  grade: string;
  topic: string;
  pages: number;
  difficulty: Difficulty;
  added: string; // ISO date (YYYY-MM-DD)
  author: string;
  /** Original or provider URL for legacy rows; staff access should use protected API routes. */
  fileUrl?: string;
  storageProvider?: StorageProvider;
  storageKey?: string;
  originalFilename?: string;
  mimeType?: string;
  fileSize?: number;
  classificationConfidence?: Confidence;
}

/** A draft used by the add/edit forms before an id/date are assigned. */
export type ResourceDraft = Omit<Resource, 'id' | 'added' | 'author'> &
  Partial<Pick<Resource, 'author' | 'added'>>;

/** One row in the bulk-upload review queue. */
export interface ClassifiedFile extends ResourceSource {
  id: string;
  name: string;
  type: ResourceType;
  subject: string;
  grade: string;
  difficulty: Difficulty;
  pages: number;
  confidence: Confidence;
  subjectKnown: boolean;
  gradeKnown: boolean;
  reasons: string[];
  include: boolean;
  fileUrl?: string;
  storageProvider?: StorageProvider;
  storageKey?: string;
  originalFilename?: string;
  mimeType?: string;
  fileSize?: number;
  suggestedTitle?: string;
  suggestedTopic?: string;
  duplicateOf?: Pick<Resource, 'id' | 'title' | 'subject' | 'grade' | 'originalFilename'>;
  duplicateReason?: string;
  uploadError?: string;
}

export type StaffRole = 'tutor' | 'admin';
