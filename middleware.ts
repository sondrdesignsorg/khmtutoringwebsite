import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/staff/session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLogin = pathname.startsWith('/staff/login');
  const isAuthApi = pathname.startsWith('/api/staff/auth');
  const isVerifyPin = pathname.startsWith('/staff/verify-pin');
  const isApi = pathname.startsWith('/api/');

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (isLogin || isAuthApi) {
    // Redirect fully-authorized users away from the login page
    if (session && isLogin && session.role && session.pinVerified) {
      const url = req.nextUrl.clone();
      url.pathname = '/staff/library';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!session) {
    if (isApi) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/staff/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // The PIN gate page is available to any authenticated (allowlisted) user;
  // the page itself double-checks allowlist status against the DB.
  if (isVerifyPin) return NextResponse.next();

  if (!session.role) {
    if (isApi) {
      return NextResponse.json({ error: 'Staff access not activated' }, { status: 403 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/staff/verify-pin';
    return NextResponse.redirect(url);
  }

  if (!session.pinVerified) {
    if (isApi) {
      return NextResponse.json({ error: 'PIN verification required' }, { status: 403 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/staff/verify-pin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/staff/:path*', '/api/staff/:path*'],
};
