import { NextResponse } from 'next/server';
import { getStaffSession } from '@/lib/staff/auth';
import { SESSION_COOKIE, OAUTH_STATE_COOKIE } from '@/lib/staff/session';

// GET /api/staff/auth  -> current session (or null)
export async function GET() {
  const session = await getStaffSession();
  return NextResponse.json({ session });
}

// DELETE /api/staff/auth  -> sign out
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  res.cookies.set(OAUTH_STATE_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
