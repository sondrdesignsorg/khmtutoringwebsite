import type { Resource, ResourceType } from './types';

export const GRADES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', 'College'];

export const SUBJECTS = [
  'Pre-Algebra', 'Algebra 1', 'Algebra 2', 'Geometry', 'Pre-Calculus',
  'SAT Math', 'SAT Reading & Writing', 'SSAT', 'English', 'Biology', 'Chemistry', 'Physics',
];

export const SUBJECT_FILTERS = ['All', 'Math', 'English', 'Test Prep', 'Science', 'College Counseling'];

/** Broad area for a subject â€” drives the accent color in the UI. */
export type SubjectArea = 'math' | 'testprep' | 'english' | 'science';

export function subjectArea(subject: string): SubjectArea {
  if (['Pre-Algebra', 'Algebra 1', 'Algebra 2', 'Geometry', 'Pre-Calculus'].includes(subject)) return 'math';
  if (['SAT Math', 'SAT Reading & Writing', 'SSAT'].includes(subject)) return 'testprep';
  if (subject === 'English') return 'english';
  return 'science';
}

export const AREA_LABEL: Record<SubjectArea, string> = {
  math: 'Math', testprep: 'Test Prep', english: 'English', science: 'Science',
};

/** Display label for a resource type â€” used across library/admin UI. */
export const TYPE_LABEL: Record<ResourceType, string> = {
  worksheet: 'Worksheet',
  quiz: 'Quiz',
  test: 'Test',
};

export function fmtDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Maps the broad subject filter chips to the concrete subjects they include. */
export function matchesSubjectFilter(filter: string, r: Resource): boolean {
  if (filter === 'All') return true;
  const map: Record<string, string[]> = {
    Math: ['Pre-Algebra', 'Algebra 1', 'Algebra 2', 'Geometry', 'Pre-Calculus'],
    English: ['English'],
    'Test Prep': ['SAT Math', 'SAT Reading & Writing', 'SSAT'],
    Science: ['Biology', 'Chemistry', 'Physics'],
    'College Counseling': ['SAT Math', 'SAT Reading & Writing'],
  };
  return (map[filter] || []).includes(r.subject);
}
