import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { requireAdmin } from '@/lib/staff/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const maxDuration = 60;

const BUSINESS_RE = /\b(invoice|receipt|quote|proposal|contract|agreement|w-?9|1099|tax|irs|bank|statement|payroll|paystub|insurance|lease|rent|utility|bill|payment|venmo|zelle|cashapp|quickbooks|bookkeeping|accounting|profit|loss|resume|cv|cover.?letter|employee|onboarding|business.?plan|brand|branding|logo|web.?design|sondr|estimate|llc|inc\b|corp\b)\b/i;
const NON_LIBRARY_RE = /\b(admin|finance|financial|legal|personal|hr|operations|marketing|taxes?|receipts?|invoices?|contracts?|leases?|banking)\b/i;
const PDF_RE = /\.pdf($|[?#])/i;

type DbRow = Record<string, unknown>;

function auditRow(row: DbRow): {
  id: string;
  action: 'keep' | 'delete';
  reasons: string[];
  title: string;
  subject: string | null;
  grade: string | null;
  originalFilename: string | null;
  storageProvider: string | null;
  storageKey: string | null;
} {
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
    action: reasons.length ? 'delete' : 'keep',
    reasons,
    title: String(row.title ?? ''),
    subject: (row.subject as string) ?? null,
    grade: (row.grade as string) ?? null,
    originalFilename: (row.original_filename as string) ?? null,
    storageProvider: (row.storage_provider as string) ?? null,
    storageKey: (row.storage_key as string) ?? null,
  };
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from('resources')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const report = (data ?? []).map(auditRow);
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

  const db = createAdminClient();
  const { data, error } = await db
    .from('resources')
    .select('id, storage_provider, storage_key')
    .in('id', ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results: { id: string; ok: boolean; error?: string }[] = [];
  for (const row of data ?? []) {
    try {
      if (row.storage_provider === 'vercel_blob' && row.storage_key) {
        await del(row.storage_key as string);
      }
      const { error: deleteError } = await db.from('resources').delete().eq('id', row.id);
      if (deleteError) throw deleteError;
      results.push({ id: String(row.id), ok: true });
    } catch (err) {
      results.push({ id: String(row.id), ok: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }

  const deleted = results.filter((r) => r.ok).length;
  const errors = results.filter((r) => !r.ok);
  return NextResponse.json({ deleted, errors, results });
}
