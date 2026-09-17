import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getAllowlistEntry } from '@/lib/staff/access';
import { ownerEmail } from '@/lib/staff/auth';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/staff/session';
import { VerifyPinForm } from '@/components/staff/VerifyPinForm';
import { SignOutNotice } from '@/components/staff/SignOutNotice';

// PIN gate for Google sign-in: shown after OAuth for allowlisted staff.
export default async function VerifyPinPage() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const claims = token ? await verifySessionToken(token) : null;
  if (!claims) redirect('/staff/login?from=/staff/verify-pin');

  if (claims.sub.toLowerCase().trim() === ownerEmail()) redirect('/staff/library');
  if (claims.role && claims.pinVerified) redirect('/staff/library');

  const entry = await getAllowlistEntry(claims.sub);
  if (!entry) return <SignOutNotice />;
  if (entry.status === 'disabled') return <SignOutNotice disabled />;

  return <VerifyPinForm email={claims.sub} />;
}
