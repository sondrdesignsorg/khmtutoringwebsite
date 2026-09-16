import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyStaffPin, recordStaffSignIn } from '@/lib/staff/access';
import { SESSION_COOKIE, signSessionToken, verifySessionToken } from '@/lib/staff/session';

// POST /api/staff/auth/verify-pin  -> { pin }  : verifies the staff PIN and
// re-signs the session cookie with the granted role.
export async function POST(req: Request) {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const claims = token ? await verifySessionToken(token) : null;
  if (!claims) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { pin } = await req.json() as { pin?: string };
  if (!pin || !/^\d{6}$/.test(pin)) {
    return NextResponse.json({ error: 'Enter the 6-digit PIN you were given.' }, { status: 400 });
  }

  const result = await verifyStaffPin(claims.sub, pin);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.locked ? 429 : 401 });
  }

  await recordStaffSignIn(claims.sub, claims.name, 'google');

  const signed = await signSessionToken({
    sub: claims.sub,
    name: claims.name,
    role: result.role,
    pinVerified: true,
  });

  const res = NextResponse.json({ session: { role: result.role, name: claims.name, email: claims.sub } });
  res.cookies.set(SESSION_COOKIE, signed, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
