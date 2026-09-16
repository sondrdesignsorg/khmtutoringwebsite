import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { requireAdmin } from '@/lib/staff/auth';
import { listResources, deleteResourcesByIds } from '@/lib/staff/resource-repo';

export const runtime = 'nodejs';
export const maxDuration = 60;

const BUSINESS_RE = /\b(invoice|receipt|quote|proposal|contract|agreement|w-?9|1099|tax|irs|bank|statement|payroll|paystub|insurance|lease|rent|utility|bill|payment|venmo|zelle|cashapp|quickbooks|bookkeeping|accounting|profit|loss|resume|cv|cover.?letter|employee|onboarding|business.?plan|brand|branding|logo|web.?design|sondr|estimate|llc|inc\b|corp\b)\b/i;
const NON_LIBRARY_RE = /\b(admin|finance|financial|legal|personal|hr|operations|marketing|taxes?|receipts?|invoices?|contracts?|leases?|banking)\b/i;
const PDF_RE = /\.pdf($|[?#])/i;

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

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
      action: reasons.length ? 'delete' : 'keep',
      reasons,
      title: r.title,
      subject: r.subject ?? null,
      grade: r.grade ?? null,
      originalFilename: r.originalFilename ?? null,
      storageProvider: r.storageProvider ?? null,
      storageKey: r.storageKey ?? null,
    };
  });

  const flagged = report.filter((r) => r.action === 'delete');
  return NextResponse.json({ total: report.length, flagged: flagged.length, report });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  let ids: string[];
  try {
    const body = await req.json() as { ids?: unknown };
    if (!Array.isArray(body.ids) || body.ids.length === 0) throw new Error('ids must be a non-empty array');
    ids = body.ids.map(String);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Invalid body' }, { status: 400 });
  }

  const removed = await deleteResourcesByIds(ids);

  const results: { id: string; ok: boolean; error?: string }[] = [];
  for (const row of removed) {
    try {
      if (row.storageProvider === 'vercel_blob' && row.storageKey) {
        await del(row.storageKey);
      }
      results.push({ id: row.id, ok: true });
    } catch (err) {
      results.push({ id: row.id, ok: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }

  const deleted = results.filter((r) => r.ok).length;
  const errors = results.filter((r) => !r.ok);
  return NextResponse.json({ deleted, errors, results });
}
