import { describe, it, expect } from 'vitest';
import { generatePin, hashPin, verifyPinHash } from '@/lib/staff/access';

describe('generatePin', () => {
  it('always returns a 6-digit numeric string', () => {
    for (let i = 0; i < 50; i++) {
      expect(generatePin()).toMatch(/^\d{6}$/);
    }
  });
});

describe('hashPin / verifyPinHash', () => {
  it('verifies a correct PIN', () => {
    const stored = hashPin('123456');
    expect(stored).toMatch(/^[0-9a-f]{32}:[0-9a-f]{64}$/);
    expect(verifyPinHash('123456', stored)).toBe(true);
  });

  it('rejects an incorrect PIN', () => {
    const stored = hashPin('123456');
    expect(verifyPinHash('654321', stored)).toBe(false);
    expect(verifyPinHash('12345', stored)).toBe(false);
  });

  it('rejects missing or malformed hashes', () => {
    expect(verifyPinHash('123456', null)).toBe(false);
    expect(verifyPinHash('123456', undefined)).toBe(false);
    expect(verifyPinHash('123456', 'garbage')).toBe(false);
  });

  it('produces unique salts for the same PIN', () => {
    expect(hashPin('123456')).not.toBe(hashPin('123456'));
  });
});
