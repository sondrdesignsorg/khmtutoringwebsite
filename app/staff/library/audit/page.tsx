import { redirect } from 'next/navigation';
import { getStaffSession } from '@/lib/staff/auth';
import { listResources } from '@/lib/staff/resource-repo';
import { LibraryAuditClient } from '@/components/staff/LibraryAuditClient';

export const runtime = 'nodejs';

const BUSINESS_RE = /\b(invoice|receipt|quote|proposal|contract|agreement|w-?9|1099|tax|irs|bank|statement|payroll|paystub|insurance|lease|rent|utility|bill|payment|venmo|zelle|cashapp|quickbooks|bookkeeping|accounting|profit|loss|resume|cv|cover.?letter|employee|onboarding|business.?plan|brand|branding|logo|web.?design|sondr|estimate|llc|inc\b|corp\b)\b/i;
const NON_LIBRARY_RE = /\b(admin|finance|financial|legal|personal|hr|operations|marketing|taxes?|receipts?|invoices?|contracts?|leases?|banking)\b/i;
const PDF_RE = /\.pdf($|[?#])/i;

export default async function LibraryAuditPage() {
  const session = await getStaffSession();
  if (!session) redirect('/staff/login?from=/staff/library/audit');
  if (session.role !== 'admin') redirect('/staff/library');

  const rows = await listResources();

  const report = rows.map((r) => {
    const text = [
      r.title, r.topic, r.originalFilename,
      r.sourcePath, r.sourceId, r.fileUrl, r.storageKey,
    ].filter(Boolean).join(' ');

    const reasons: string[] = [];
    if (BUSINESS_RE.test(text) || NON_LIBRARY_RE.test(text)) reasons.push('likely business or admin document');

    const fileName = r.originalFilename || r.storageKey || r.fileUrl || '';
    if (r.mimeType && !/pdf/i.test(r.mimeType)) reasons.push(`non-PDF type: ${r.mimeType}`);
    if (fileName && !PDF_RE.test(fileName)) reasons.push('filename is not a PDF');
    if (!r.storageKey && !r.fileUrl) reasons.push('no file attached');

    return {
      id: r.id,
      action: (reasons.length ? 'delete' : 'keep') as 'keep' | 'delete',
      reasons,
      title: r.title,
      subject: r.subject ?? null,
      grade: r.grade ?? null,
      originalFilename: r.originalFilename ?? null,
      storageProvider: r.storageProvider ?? null,
    };
  });

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
