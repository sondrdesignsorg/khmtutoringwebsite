import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/staff/auth';
import { assignResourcesFolder } from '@/lib/staff/resource-repo';

export const runtime = 'nodejs';

// POST /api/staff/resources/folder  -> { ids, folderId }  (admin only)
// Bulk-moves resources into a folder, or out of any folder when folderId is null.
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({})) as { ids?: unknown; folderId?: unknown };
  const ids = Array.isArray(body.ids) ? body.ids.map(String).filter(Boolean) : [];
  if (!ids.length) return NextResponse.json({ error: 'No resources selected' }, { status: 400 });

  const folderId = typeof body.folderId === 'string' && body.folderId ? body.folderId : null;

  try {
    const moved = await assignResourcesFolder(ids, folderId);
    return NextResponse.json({ moved });
  } catch (err) {
    console.error('bulk folder assign failed:', err);
    return NextResponse.json({ error: 'Could not move resources' }, { status: 400 });
  }
}
