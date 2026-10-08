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

  const [resources, students, folders] = await Promise.all([
    listResources(),
    listStudents(),
    listFolders(),
  ]);

  return <LibraryClient initialResources={resources} students={students} folders={folders} session={session} />;
}
