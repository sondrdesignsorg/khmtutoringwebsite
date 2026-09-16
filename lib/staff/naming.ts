import { TYPE_LABEL } from './resources';
import type { ResourceType } from './types';

/**
 * Canonical naming for the staff resource library.
 *
 * Blob storage keys follow:
 *   staff-library/{subject}/{grade}/{type}_{topic}_{date}_{checksum8}.pdf
 * e.g. staff-library/algebra-1/grade-9/worksheet_linear-equations_2026-09-14_a1b2c3d4.pdf
 *
 * Titles are generated from metadata (never from raw filenames) so the
 * library stays consistent regardless of what a tutor named the file.
 */

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** '9th' -> 'grade-9', 'College' -> 'college' */
export function gradeSlug(grade: string): string {
  const match = grade.toLowerCase().match(/^(\d{1,2})(?:st|nd|rd|th)$/);
  return match ? `grade-${match[1]}` : slugify(grade);
}

export interface CanonicalPathInput {
  subject: string;
  grade: string;
  type: ResourceType;
  topic: string;
  added: string; // YYYY-MM-DD
  checksum?: string; // short suffix to guarantee uniqueness
}

export function canonicalResourcePath(input: CanonicalPathInput): string {
  const base = `${slugify(input.type)}_${slugify(input.topic)}_${input.added.slice(0, 10)}`;
  const suffix = input.checksum ? `_${input.checksum.slice(0, 8)}` : '';
  return `staff-library/${slugify(input.subject)}/${gradeSlug(input.grade)}/${base}${suffix}.pdf`;
}

/** Display title derived from classified metadata, e.g. "Worksheet: Linear equations". */
export function titleFromMetadata(input: { type: ResourceType; topic: string }): string {
  const topic = input.topic.trim();
  if (!topic) return TYPE_LABEL[input.type];
  return `${TYPE_LABEL[input.type]}: ${topic.charAt(0).toUpperCase()}${topic.slice(1)}`;
}

/** Human title fallback from a raw filename (underscores/dashes -> spaces). */
export function titleFromFilename(name: string): string {
  return name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Parses the canonical path back out of a storage key (for the organizer/audit tools). */
export function parseCanonicalPath(pathname: string): CanonicalPathInput | null {
  const match = pathname.match(
    /^staff-library\/([^/]+)\/([^/]+)\/([^/]+)_([^_/]+(?:_[^_/]+)*)_(\d{4}-\d{2}-\d{2})_[0-9a-f]{8}\.pdf$/i,
  );
  if (!match) return null;
  const type = match[3].toLowerCase();
  if (type !== 'worksheet' && type !== 'quiz' && type !== 'test') return null;
  return {
    subject: match[1],
    grade: match[2],
    type,
    topic: match[4].replace(/-/g, ' '),
    added: match[5],
  };
}
