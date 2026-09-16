import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/staff/auth';
import { updateAllowlistEntry } from '@/lib/staff/access';

export const runtime = 'nodejs';

// PATCH /api/staff/management/[id]  -> { role?, status? }  (admin only)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json() as { role?: 'admin' | 'tutor'; status?: 'invited' | 'active' | 'disabled' };

  const result = await updateAllowlistEntry(id, {
    ...(body.role ? { role: body.role } : {}),
    ...(body.status ? { status: body.status } : {}),
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });

  return NextResponse.json({ ok: true });
}
