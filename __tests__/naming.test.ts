import { describe, it, expect } from 'vitest';
import {
  slugify,
  gradeSlug,
  canonicalResourcePath,
  titleFromMetadata,
  titleFromFilename,
  parseCanonicalPath,
} from '@/lib/staff/naming';
import { classifyFilename } from '@/lib/staff/classify';

describe('slugify', () => {
  it('lowercases and converts separators', () => {
    expect(slugify('Algebra 1')).toBe('algebra-1');
    expect(slugify('SAT Reading & Writing')).toBe('sat-reading-and-writing');
    expect(slugify('  Linear  Equations!!  ')).toBe('linear-equations');
  });
});

describe('gradeSlug', () => {
  it('maps ordinal grades to grade-N', () => {
    expect(gradeSlug('9th')).toBe('grade-9');
    expect(gradeSlug('1st')).toBe('grade-1');
    expect(gradeSlug('12th')).toBe('grade-12');
  });
  it('slugs non-ordinal grades', () => {
    expect(gradeSlug('College')).toBe('college');
  });
});

describe('canonicalResourcePath', () => {
  it('builds the canonical staff-library path', () => {
    expect(
      canonicalResourcePath({
        subject: 'Algebra 1',
        grade: '9th',
        type: 'worksheet',
        topic: 'Linear Equations',
        added: '2026-09-14',
        checksum: 'a1b2c3d4e5f6',
      }),
    ).toBe('staff-library/algebra-1/grade-9/worksheet_linear-equations_2026-09-14_a1b2c3d4.pdf');
  });

  it('works for quizzes and tests', () => {
    expect(
      canonicalResourcePath({
        subject: 'Geometry',
        grade: '10th',
        type: 'quiz',
        topic: 'Triangle Congruence',
        added: '2026-09-01',
        checksum: 'ffffffff',
      }),
    ).toBe('staff-library/geometry/grade-10/quiz_triangle-congruence_2026-09-01_ffffffff.pdf');
  });
});

describe('parseCanonicalPath', () => {
  it('round-trips canonical paths', () => {
    const parsed = parseCanonicalPath(
      'staff-library/algebra-1/grade-9/worksheet_linear-equations_2026-09-14_a1b2c3d4.pdf',
    );
    expect(parsed).toMatchObject({
      subject: 'algebra-1',
      grade: 'grade-9',
      type: 'worksheet',
      topic: 'linear equations',
      added: '2026-09-14',
    });
  });

  it('rejects non-canonical paths', () => {
    expect(parseCanonicalPath('staff-library/2026-09-14/random-file-123.pdf')).toBeNull();
    expect(parseCanonicalPath('staff-library/algebra-1/grade-9/notes_topic_2026-09-14_a1b2c3d4.pdf')).toBeNull();
    expect(parseCanonicalPath('staff-library/algebra-1/grade-9/worksheet_topic_2026-09-14_xyz.pdf')).toBeNull();
  });
});

describe('titleFromMetadata', () => {
  it('generates a title from type + topic', () => {
    expect(titleFromMetadata({ type: 'quiz', topic: 'slope intercept' })).toBe('Quiz: Slope intercept');
    expect(titleFromMetadata({ type: 'test', topic: 'factoring' })).toBe('Test: Factoring');
  });
  it('falls back to the type label when topic is empty', () => {
    expect(titleFromMetadata({ type: 'worksheet', topic: '  ' })).toBe('Worksheet');
  });
});

describe('titleFromFilename', () => {
  it('converts separators to spaces and strips the extension', () => {
    expect(titleFromFilename('linear_equations-ws.pdf')).toBe('linear equations ws');
    expect(titleFromFilename('Two Step Equations.PDF')).toBe('Two Step Equations');
  });
});

describe('classifyFilename quiz detection', () => {
  it('classifies quiz filenames as type quiz', () => {
    expect(classifyFilename('Algebra 1 slope quiz 9th grade.pdf').type).toBe('quiz');
    expect(classifyFilename('Pop Quiz - Geometry 10.pdf').type).toBe('quiz');
  });
  it('keeps test and worksheet detection', () => {
    expect(classifyFilename('Algebra 2 midterm exam 11.pdf').type).toBe('test');
    expect(classifyFilename('Factoring polynomials worksheet 10.pdf').type).toBe('worksheet');
  });
});
