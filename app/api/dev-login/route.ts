import { NextResponse } from 'next/server';
import { ownerEmail } from '@/lib/staff/auth';
import { SESSION_COOKIE, signSessionToken } from '@/lib/staff/session';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  if (process.env.NODE_ENV !== 'development' || process.env.ALLOW_DEV_LOGIN !== '1') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }

  const email = ownerEmail();
  const token = await signSessionToken({
    sub: email,
    name: 'Kody Kim (dev)',
    role: 'admin',
    pinVerified: true,
  });

  const url = new URL('/staff/library', req.url);
  const res = NextResponse.redirect(url);
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
