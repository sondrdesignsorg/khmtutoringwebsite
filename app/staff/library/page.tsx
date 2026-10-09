import { redirect } from 'next/navigation';
import { getStaffSession } from '@/lib/staff/auth';
import { listResources } from '@/lib/staff/resource-repo';
import { listStudents } from '@/lib/staff/student-repo';
import { listFolders } from '@/lib/staff/folder-repo';
import { LibraryClient } from '@/components/staff/LibraryClient';

export const runtime = 'nodejs';

/** Resource Library - any signed-in staff (tutors + admin). */
export default async function LibraryPage() {
  const session = await getStaffSession();
  if (!session) redirect('/staff/login?from=/staff/library');

  // Resolve folders first so the one-time test-filing backfill is applied
  // before resources are read.
  const folders = await listFolders();
  const [resources, students] = await Promise.all([listResources(), listStudents()]);

  return <LibraryClient initialResources={resources} students={students} folders={folders} session={session} />;
}
