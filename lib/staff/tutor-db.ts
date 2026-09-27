import type { Tutor } from './types';

export type DbTutorRow = {
  id: string;
  name: string;
  subjects: string[] | null;
  tagline: string | null;
  image_url: string | null;
  image_key: string | null;
  bio: string | null;
  achievements: string[] | null;
  experience: string | null;
  certifications: string | null;
  fun_fact: string | null;
  grades: string | null;
  category: string | null;
  sort_order: number | null;
  published: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export function toTutor(row: DbTutorRow): Tutor {
  return {
    id: row.id,
    name: row.name,
    subjects: row.subjects ?? [],
    tagline: row.tagline ?? '',
    imageUrl: row.image_url ?? '',
    ...(row.image_key ? { imageKey: row.image_key } : {}),
    bio: row.bio ?? '',
    achievements: row.achievements ?? [],
    experience: row.experience ?? '',
    certifications: row.certifications ?? '',
    funFact: row.fun_fact ?? '',
    grades: row.grades ?? '',
    category: row.category ?? '',
    sortOrder: row.sort_order ?? 0,
    published: row.published ?? true,
  };
}
