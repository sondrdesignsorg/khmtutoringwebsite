import { redirect } from 'next/navigation';
import { getStaffSession } from '@/lib/staff/auth';
import { listResources } from '@/lib/staff/resource-repo';
import { LibraryClient } from '@/components/staff/LibraryClient';

export const runtime = 'nodejs';

/** Resource Library - any signed-in staff (tutors + admin). */
export default async function LibraryPage() {
  const session = await getStaffSession();
  if (!session) redirect('/staff/login?from=/staff/library');

  const resources = await listResources();

  return <LibraryClient initialResources={resources} session={session} />;
}
