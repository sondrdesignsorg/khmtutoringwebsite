import { redirect } from 'next/navigation';
import { getStaffSession } from '@/lib/staff/auth';
import { listDiagnosticLeads } from '@/lib/diagnostic/leads';
import { DiagnosticLeadsClient, type DiagnosticLead } from '@/components/staff/DiagnosticLeadsClient';

export default async function DiagnosticLeadsPage() {
  const session = await getStaffSession();
  if (!session) redirect('/staff/login?from=/staff/diagnostic-leads');
  if (session.role !== 'admin') redirect('/staff/library');

  const data = await listDiagnosticLeads();

  const leads: DiagnosticLead[] = data.map((row) => ({
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
