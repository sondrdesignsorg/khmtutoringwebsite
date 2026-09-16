import { cookies } from 'next/headers';
import type { StaffRole } from './types';
import { SESSION_COOKIE, verifySessionToken } from './session';
import { getAllowlistEntry } from './access';

export interface StaffSession {
  role: StaffRole;
  name: string;
  email: string;
}

/** The business owner's email — always treated as admin so access can never be locked out. */
export function ownerEmail(): string {
  return (
    process.env.KHM_STAFF_EMAIL ||
    process.env.DIAGNOSTIC_STAFF_EMAIL ||
    'khmtutoring1@gmail.com'
  ).toLowerCase().trim();
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const claims = await verifySessionToken(token);
  if (!claims) return null;

  const email = claims.sub.toLowerCase().trim();
  const isOwner = email === ownerEmail();

  // Live check so role changes / disables take effect immediately.
  let role: StaffRole | null = null;
  if (isOwner) {
    role = 'admin';
  } else {
    const entry = await getAllowlistEntry(email);
    if (entry && entry.status !== 'disabled') role = entry.role;
    if (!role) return null;
  }

  return { role, name: claims.name, email: claims.sub };
}

export async function requireAdmin(): Promise<boolean> {
  const session = await getStaffSession();
  return session?.role === 'admin';
}
