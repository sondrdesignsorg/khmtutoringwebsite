import { SignJWT, jwtVerify } from 'jose';
import type { StaffRole } from './types';

/**
 * Staff session tokens — signed JWTs stored in an httpOnly cookie.
 * No external auth provider: Google OAuth is exchanged server-side in
 * /auth/callback and the resulting session is signed with AUTH_SECRET.
 */

export const SESSION_COOKIE = 'khm_staff_session';
export const OAUTH_STATE_COOKIE = 'khm_oauth_state';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface StaffSessionClaims {
  /** staff email */
  sub: string;
  name: string;
  role: StaffRole | null;
  pinVerified: boolean;
}

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error('AUTH_SECRET is not configured');
  return new TextEncoder().encode(value);
}

export async function signSessionToken(claims: StaffSessionClaims): Promise<string> {
  return new SignJWT({ name: claims.name, role: claims.role, pinVerified: claims.pinVerified })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS)
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<StaffSessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] });
    const role = payload.role as StaffRole | null | undefined;
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      name: (payload.name as string | undefined) ?? payload.sub.split('@')[0],
      role: role === 'admin' || role === 'tutor' ? role : null,
      pinVerified: payload.pinVerified === true,
    };
  } catch {
    return null;
  }
}

export const sessionMaxAgeSeconds = SESSION_MAX_AGE_SECONDS;
