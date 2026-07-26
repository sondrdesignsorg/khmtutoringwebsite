import { redirect } from 'next/navigation';
import { getStaffSession } from '@/lib/staff/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { DiagnosticLeadsClient, type DiagnosticLead } from '@/components/staff/DiagnosticLeadsClient';

export default async function DiagnosticLeadsPage() {
  const session = await getStaffSession();
  if (!session) redirect('/staff/login?from=/staff/diagnostic-leads');
  if (session.role !== 'admin') redirect('/staff/library');

  const db = createAdminClient();
  const { data, error } = await db
    .from('diagnostic_leads')
    .select('id, parent_name, student_name, student_grade, email, phone, age_group, subject, length, score, tier, topic_breakdown, emailed_at, booked_at, client_status, notes, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Unable to load diagnostic leads: ${error.message}`);

  const leads: DiagnosticLead[] = (data ?? []).map((row) => ({
    id: row.id as string,
    parentName: row.parent_name as string,
    studentName: row.student_name as string,
    studentGrade: row.student_grade as string | null,
    email: row.email as string,
    phone: row.phone as string | null,
    ageGroup: row.age_group as string,
    subject: row.subject as string,
    length: row.length as number,
    score: row.score as number,
    tier: row.tier as string,
    emailedAt: row.emailed_at as string | null,
    bookedAt: row.booked_at as string | null,
    clientStatus: (row.client_status ?? 'new') as DiagnosticLead['clientStatus'],
    notes: row.notes as string | null,
    createdAt: row.created_at as string,
  }));

  return <DiagnosticLeadsClient leads={leads} session={session} />;
}
