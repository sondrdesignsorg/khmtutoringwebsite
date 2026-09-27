import { describe, it, expect } from 'vitest';
import { matchesAllTerms, tokenizeQuery } from '@/lib/search';

describe('tokenizeQuery', () => {
  it('splits on arbitrary whitespace and lowercases', () => {
    expect(tokenizeQuery('  Algebra   Linear Equations ')).toEqual(['algebra', 'linear', 'equations']);
    expect(tokenizeQuery('')).toEqual([]);
  });
});

describe('matchesAllTerms', () => {
  const fields = ['Linear Equations Worksheet', 'Algebra 1', 'Grade 9'];

  it('matches when a single keyword appears', () => {
    expect(matchesAllTerms(fields, 'algebra')).toBe(true);
  });

  it('matches an arbitrary number of keywords across fields', () => {
    expect(matchesAllTerms(fields, 'algebra linear')).toBe(true);
    expect(matchesAllTerms(fields, 'linear grade worksheet')).toBe(true);
  });

  it('requires every keyword to match somewhere', () => {
    expect(matchesAllTerms(fields, 'algebra geometry')).toBe(false);
    expect(matchesAllTerms(fields, 'algebra 1')).toBe(true);
  });

  it('treats an empty query as no filter', () => {
    expect(matchesAllTerms(fields, '   ')).toBe(true);
  });

  it('ignores null and undefined fields', () => {
    expect(matchesAllTerms(['Algebra', null, undefined], 'algebra')).toBe(true);
  });
});
