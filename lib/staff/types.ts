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
  /** Folder this resource belongs to (used to group tests into course folders). */
  folderId?: string;
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

/** A public educator profile shown on /educators. Managed by admins. */
export interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  tagline: string;
  imageUrl: string;
  /** Blob key when the image was uploaded to our store (used for cleanup). */
  imageKey?: string;
  bio: string;
  achievements: string[];
  experience: string;
  certifications: string;
  funFact: string;
  grades: string;
  category: string;
  sortOrder: number;
  published: boolean;
}

/** Draft used by the add/edit form before an id is assigned. */
export type TutorDraft = Omit<Tutor, 'id' | 'sortOrder' | 'published'> &
  Partial<Pick<Tutor, 'sortOrder' | 'published'>>;

/** A student who can receive worksheets by email from the staff library. */
export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  parentName: string;
  phone: string;
  notes: string;
}

/** Draft used by the add/edit form before an id is assigned. */
export type StudentDraft = Omit<Student, 'id'>;

/** An editable folder used to group tests (and other resources) by course. */
export interface LibraryFolder {
  id: string;
  name: string;
  sortOrder: number;
}

export type LibraryFolderDraft = Omit<LibraryFolder, 'id' | 'sortOrder'> &
  Partial<Pick<LibraryFolder, 'sortOrder'>>;
