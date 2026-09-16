import type { ClassifiedFile, Difficulty, ResourceType } from './types';

/**
 * Filename auto-sort heuristic â€” the cheap, zero-API first pass.
 *
 * Strategy (keep AI costs near zero):
 *   1. Parse the filename against the subject / grade dictionaries below.
 *   2. Anything matched confidently is filed automatically.
 *   3. Low-confidence rows are flagged `medium` / `low` â€” that is the ONLY
 *      place a paid model should ever be called. See `aiClassifyFallback`.
 *
 * A production upgrade can also read the first page of PDF text and keyword
 * match it the same way before falling back to AI.
 */

const GRADE_PATTERNS: [RegExp, string][] = [
  [/\b6(th)?\b|grade ?6|g6/i, '6th'],
  [/\b7(th)?\b|grade ?7|g7/i, '7th'],
  [/\b8(th)?\b|grade ?8|g8/i, '8th'],
  [/\b9(th)?\b|grade ?9|g9/i, '9th'],
  [/\b10(th)?\b|grade ?10|g10/i, '10th'],
  [/\b11(th)?\b|grade ?11|g11/i, '11th'],
  [/\b12(th)?\b|grade ?12|g12/i, '12th'],
  [/college/i, 'College'],
];

const SUBJECT_KEYWORDS: [string, string[]][] = [
  ['Pre-Algebra', ['pre-alg', 'prealg', 'pre alg', 'integer']],
  ['Algebra 1', ['algebra1', 'algebra 1', 'alg1', 'alg 1', 'two-step', 'two step']],
  ['Algebra 2', ['algebra2', 'algebra 2', 'alg2', 'alg 2', 'logarithm', 'log ']],
  ['Geometry', ['geometry', 'geom', 'triangle', 'congruence', 'circle']],
  ['Pre-Calculus', ['precalc', 'pre-calc', 'pre calc', 'unit circle', 'radian', 'trig']],
  ['SAT Math', ['sat math', 'sat_math', 'nocalc', 'no-calc', 'no calc']],
  ['SAT Reading & Writing', ['sat reading', 'sat_reading', 'sat verbal', 'evidence']],
  ['SSAT', ['ssat', 'analog']],
  ['English', ['english', 'reading', 'inference', 'essay', 'comprehension']],
  ['Biology', ['biology', 'bio', 'cell', 'genetics']],
  ['Chemistry', ['chem', 'stoich', 'chemistry']],
  ['Physics', ['physics', 'mechanics', 'kinematics', 'forces']],
];

export function classifyFilename(name: string, id?: string): ClassifiedFile {
  const n = name.toLowerCase().replace(/\.pdf$/, '');
  const reasons: string[] = [];

  let type: ResourceType = 'worksheet';
  if (/(quiz|pop ?quiz)/i.test(n)) {
    type = 'quiz';
    reasons.push('type: "quiz" keyword');
  } else if (/(test|exam|midterm|final|assessment|diagnostic)/i.test(n)) {
    type = 'test';
    reasons.push('type: "test" keyword');
  } else if (/(worksheet|practice|set|review|ws)/i.test(n)) {
    reasons.push('type: practice keyword');
  }

  let subject: string | null = null;
  for (const [subj, kws] of SUBJECT_KEYWORDS) {
    if (kws.some((k) => n.includes(k))) {
      subject = subj;
      reasons.push(`subject: matched "${subj}"`);
      break;
    }
  }

  let grade: string | null = null;
  for (const [re, g] of GRADE_PATTERNS) {
    if (re.test(n)) {
      grade = g;
      reasons.push(`grade: ${g}`);
      break;
    }
  }

  let difficulty: Difficulty = 'Intermediate';
  if (grade && ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'].includes(grade)) difficulty = 'Beginner';
  else if (grade && ['11th', '12th', 'College'].includes(grade)) difficulty = 'Advanced';

  let confidence: ClassifiedFile['confidence'] = 'low';
  if (subject && grade) confidence = 'high';
  else if (subject || grade) confidence = 'medium';

  return {
    id: id || `u_${Math.random().toString(36).slice(2, 9)}`,
    name,
    type,
    subject: subject || 'Algebra 1',
    grade: grade || '9th',
    difficulty,
    pages: 2,
    confidence,
    subjectKnown: !!subject,
    gradeKnown: !!grade,
    reasons,
    include: true,
  };
}

/**
 * OPTIONAL paid fallback â€” only call this for rows where
 * `classifyFilename(...).confidence !== 'high'`. Classifying a filename plus a
 * short text snippet is a few hundred tokens, i.e. a fraction of a cent per
 * file, so even a large batch costs cents. NEVER send whole PDFs.
 *
 * Wire to your model of choice on the server. Left unimplemented on purpose.
 */
export async function aiClassifyFallback(
  _filename: string,
  _firstPageText?: string,
): Promise<Partial<ClassifiedFile> | null> {
  // e.g. POST { filename, firstPageText } to your /api/staff/classify route,
  // which calls the model and returns { subject, grade, type, difficulty }.
  return null;
}
