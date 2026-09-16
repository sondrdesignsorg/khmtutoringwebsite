import { redirect } from 'next/navigation';
import { getStaffSession } from '@/lib/staff/auth';
import { listAllowlist } from '@/lib/staff/access';
import { ensureStaffSchema } from '@/lib/staff/db';
import { sql } from '@vercel/postgres';
import type { AllowlistEntry } from '@/lib/staff/access';
import { StaffManagementClient } from '@/components/staff/StaffManagementClient';

export const runtime = 'nodejs';

export interface StaffAuthUser {
  id: string;
  email: string;
  provider: string;
  lastSignInAt: string | null;
}

/** Staff Management - admin only. Invite tutors via Google, issue PINs, set roles. */
export default async function StaffManagementPage() {
  const session = await getStaffSession();
  if (!session) redirect('/staff/login?from=/staff/management');
  if (session.role !== 'admin') redirect('/staff/library');

  await ensureStaffSchema();
  const entries = await listAllowlist();

  const { rows: sessionRows } = await sql<StaffAuthUser>`
    SELECT email AS id, email, provider, last_sign_in_at AS "lastSignInAt"
    FROM staff_sessions
  `;

  return (
    <StaffManagementClient
      session={session}
      initialEntries={entries as AllowlistEntry[]}
      authUsers={sessionRows}
    />
  );
}
