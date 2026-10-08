import { redirect } from 'next/navigation';
import { getStaffSession } from '@/lib/staff/auth';
import { listStudents } from '@/lib/staff/student-repo';
import { StudentsAdminClient } from '@/components/staff/StudentsAdminClient';

export const runtime = 'nodejs';

/** Student roster management - admin role only. */
export default async function StaffStudentsPage() {
  const session = await getStaffSession();
  if (!session) redirect('/staff/login?from=/staff/students');
  if (session.role !== 'admin') redirect('/staff/library');

  const students = await listStudents();

  return <StudentsAdminClient initialStudents={students} session={session} />;
}
