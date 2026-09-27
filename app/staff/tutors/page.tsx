import { redirect } from 'next/navigation';
import { getStaffSession } from '@/lib/staff/auth';
import { listAllTutors } from '@/lib/staff/tutor-repo';
import { TutorsAdminClient } from '@/components/staff/TutorsAdminClient';

export const runtime = 'nodejs';

/** Public educator roster management - admin role only. */
export default async function StaffTutorsPage() {
  const session = await getStaffSession();
  if (!session) redirect('/staff/login?from=/staff/tutors');
  if (session.role !== 'admin') redirect('/staff/library');

  const tutors = await listAllTutors();

  return <TutorsAdminClient initialTutors={tutors} session={session} />;
}
