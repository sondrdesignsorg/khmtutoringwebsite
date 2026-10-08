import { describe, it, expect } from 'vitest';
import { isValidEmail } from '@/lib/staff/recipients';
import { DEFAULT_TEST_FOLDERS } from '@/lib/staff/resources';

describe('isValidEmail', () => {
  it('accepts a normal address', () => {
    expect(isValidEmail('student@example.com')).toBe(true);
    expect(isValidEmail('  a.b+tag@sub.example.org ')).toBe(true);
  });

  it('rejects malformed addresses', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('a @b.com')).toBe(false);
  });
});

describe('DEFAULT_TEST_FOLDERS', () => {
  it('seeds the course folders requested for tests', () => {
    expect(DEFAULT_TEST_FOLDERS).toContain('Alg2 2015');
    expect(DEFAULT_TEST_FOLDERS).toContain('Alg2 2024');
    expect(DEFAULT_TEST_FOLDERS).toContain('Alg 2 2025');
    expect(DEFAULT_TEST_FOLDERS).toContain('Alg 2');
    expect(DEFAULT_TEST_FOLDERS).toContain('Algebra 2024');
    expect(DEFAULT_TEST_FOLDERS).toContain('APCH');
    expect(DEFAULT_TEST_FOLDERS).toContain('Geometry');
    expect(DEFAULT_TEST_FOLDERS).toContain('Pre-Calc 2024');
  });

  it('has no duplicate folder names', () => {
    expect(new Set(DEFAULT_TEST_FOLDERS).size).toBe(DEFAULT_TEST_FOLDERS.length);
  });
});
