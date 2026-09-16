import { redirect } from 'next/navigation';
import { getStaffSession } from '@/lib/staff/auth';
import { listResources } from '@/lib/staff/resource-repo';
import { AdminClient } from '@/components/staff/AdminClient';

export const runtime = 'nodejs';

/** Library Admin - admin role only. Tutors are redirected to the library. */
export default async function AdminPage() {
  const session = await getStaffSession();
  if (!session) redirect('/staff/login?from=/staff/admin');
  if (session.role !== 'admin') redirect('/staff/library');

  const resources = await listResources();

  return <AdminClient initialResources={resources} session={session} />;
}
