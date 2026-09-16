import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';
import { getAllowlistEntry, recordStaffSignIn } from '@/lib/staff/access';
import { ownerEmail } from '@/lib/staff/auth';
import { OAUTH_STATE_COOKIE, SESSION_COOKIE, signSessionToken } from '@/lib/staff/session';
import type { StaffRole } from '@/lib/staff/types';

// Google OAuth callback — exchanges the code for an id_token, verifies the
// email against the staff allowlist, and issues the staff session cookie.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const stateCookie = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  let from = '/staff/library';
  try {
    const parsed = JSON.parse(stateCookie ?? '{}') as { state?: string; from?: string };
    if (parsed.state && parsed.state === state && parsed.from) from = parsed.from;
  } catch {
    // ignore malformed state cookie
  }

  const clearState = (res: NextResponse) => {
    res.cookies.set(OAUTH_STATE_COOKIE, '', { path: '/', maxAge: 0 });
    return res;
  };

  if (error || !code || !state || !stateCookie?.includes(`"state":"${state}"`)) {
    return clearState(NextResponse.redirect(`${origin}/staff/login?error=invalid_link`));
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${origin}/auth/callback`,
    }),
  });

  if (!tokenRes.ok) {
    return clearState(NextResponse.redirect(`${origin}/staff/login?error=invalid_link`));
  }

  const tokens = await tokenRes.json() as { id_token?: string };
  const idToken = tokens.id_token;
  if (!idToken) {
    return clearState(NextResponse.redirect(`${origin}/staff/login?error=invalid_link`));
  }

  const payload = decodeJwt(idToken) as { email?: string; name?: string };
  const email = payload.email?.toLowerCase().trim();
  if (!email) {
    return clearState(NextResponse.redirect(`${origin}/staff/login?error=invalid_link`));
  }

  const isOwner = email === ownerEmail();
  const entry = isOwner ? null : await getAllowlistEntry(email);
  if (!isOwner && entry?.status === 'disabled') {
    return clearState(NextResponse.redirect(`${origin}/staff/login?error=not_staff`));
  }

  // Unknown accounts continue to the PIN gate: entering a valid unclaimed
  // staff PIN authorizes and binds their account there.
  const role: StaffRole | null = isOwner ? 'admin' : entry ? entry.role : null;
  const pinVerified = isOwner;
  const name = payload.name ?? email.split('@')[0];

  await recordStaffSignIn(email, payload.name ?? null, 'google');

  const token = await signSessionToken({ sub: email, name, role, pinVerified });
  const res = clearState(NextResponse.redirect(`${origin}${from}`));
  res.cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
