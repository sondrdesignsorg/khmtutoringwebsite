import { cookies } from 'next/headers';
import type { StaffRole } from './types';
import { SESSION_COOKIE, verifySessionToken } from './session';
import { getAllowlistEntry, isOwnerEmail, ownerEmails } from './access';

export interface StaffSession {
  role: StaffRole;
  name: string;
  email: string;
}

/**
 * The primary owner email — used for dev sign-in and display fallbacks.
 * Every address in the owner list is treated as admin (see `isOwnerEmail`),
 * so access can never be locked out.
 */
export function ownerEmail(): string {
  return ownerEmails()[0] ?? 'khmtutoring1@gmail.com';
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const claims = await verifySessionToken(token);
  if (!claims) return null;

  const email = claims.sub.toLowerCase().trim();
  const isOwner = isOwnerEmail(email);

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
