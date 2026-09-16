import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { signSessionToken, verifySessionToken } from '@/lib/staff/session';

describe('staff session tokens', () => {
  const originalSecret = process.env.AUTH_SECRET;

  beforeAll(() => {
    process.env.AUTH_SECRET = 'test-secret-that-is-long-enough';
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = originalSecret;
  });

  it('round-trips claims', async () => {
    const token = await signSessionToken({
      sub: 'tutor@gmail.com',
      name: 'Jane Tutor',
      role: 'tutor',
      pinVerified: true,
    });
    const claims = await verifySessionToken(token);
    expect(claims).toMatchObject({
      sub: 'tutor@gmail.com',
      name: 'Jane Tutor',
      role: 'tutor',
      pinVerified: true,
    });
  });

  it('supports unverified sessions with no role', async () => {
    const token = await signSessionToken({
      sub: 'new@gmail.com',
      name: 'New Tutor',
      role: null,
      pinVerified: false,
    });
    const claims = await verifySessionToken(token);
    expect(claims).toMatchObject({ role: null, pinVerified: false });
  });

  it('rejects tokens signed with a different secret', async () => {
    process.env.AUTH_SECRET = 'a-different-secret-value-123';
    const token = await signSessionToken({
      sub: 'tutor@gmail.com',
      name: 'Jane Tutor',
      role: 'tutor',
      pinVerified: true,
    });
    process.env.AUTH_SECRET = 'test-secret-that-is-long-enough';
    expect(await verifySessionToken(token)).toBeNull();
  });

  it('rejects garbage', async () => {
    expect(await verifySessionToken('not-a-jwt')).toBeNull();
    expect(await verifySessionToken('')).toBeNull();
  });

  it('requires AUTH_SECRET to sign', async () => {
    delete process.env.AUTH_SECRET;
    await expect(
      signSessionToken({ sub: 'x@y.com', name: 'X', role: null, pinVerified: false }),
    ).rejects.toThrow('AUTH_SECRET is not configured');
  });
});
