import { redirect } from 'next/navigation';
import { getStaffSession } from '@/lib/staff/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { LibraryAuditClient } from '@/components/staff/LibraryAuditClient';

const BUSINESS_RE = /\b(invoice|receipt|quote|proposal|contract|agreement|w-?9|1099|tax|irs|bank|statement|payroll|paystub|insurance|lease|rent|utility|bill|payment|venmo|zelle|cashapp|quickbooks|bookkeeping|accounting|profit|loss|resume|cv|cover.?letter|employee|onboarding|business.?plan|brand|branding|logo|web.?design|sondr|estimate|llc|inc\b|corp\b)\b/i;
const NON_LIBRARY_RE = /\b(admin|finance|financial|legal|personal|hr|operations|marketing|taxes?|receipts?|invoices?|contracts?|leases?|banking)\b/i;
const PDF_RE = /\.pdf($|[?#])/i;

type DbRow = Record<string, unknown>;

function auditRow(row: DbRow) {
  const text = [
    row.title, row.topic, row.original_filename,
    row.source_path, row.source_id, row.file_url, row.storage_key,
  ].filter(Boolean).join(' ');

  const reasons: string[] = [];
  if (BUSINESS_RE.test(text) || NON_LIBRARY_RE.test(text)) reasons.push('likely business or admin document');

  const fileName = String(row.original_filename || row.storage_key || row.file_url || '');
  if (row.mime_type && !/pdf/i.test(String(row.mime_type))) reasons.push(`non-PDF type: ${row.mime_type}`);
  if (fileName && !PDF_RE.test(fileName)) reasons.push('filename is not a PDF');
  if (!row.storage_key && !row.file_url) reasons.push('no file attached');

  return {
    id: String(row.id),
    action: (reasons.length ? 'delete' : 'keep') as 'keep' | 'delete',
    reasons,
    title: String(row.title ?? ''),
    subject: (row.subject as string) ?? null,
    grade: (row.grade as string) ?? null,
    originalFilename: (row.original_filename as string) ?? null,
    storageProvider: (row.storage_provider as string) ?? null,
  };
}

export default async function LibraryAuditPage() {
  const session = await getStaffSession();
  if (!session) redirect('/staff/login?from=/staff/library/audit');
  if (session.role !== 'admin') redirect('/staff/library');

  const db = createAdminClient();
  const { data, error } = await db
    .from('resources')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Could not load resources: ${error.message}`);

  const report = (data ?? []).map(auditRow);
  const flagged = report.filter((r) => r.action === 'delete');

  return (
    <LibraryAuditClient
      session={session}
      total={report.length}
      flagged={flagged}
      all={report}
    />
  );
}
