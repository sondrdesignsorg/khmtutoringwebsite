import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/staff/auth';
import { resetAllowlistPin } from '@/lib/staff/access';

export const runtime = 'nodejs';

// POST /api/staff/management/[id]/reset-pin  (admin only)
// Issues a new PIN and forces the user to verify it again on next use.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const result = await resetAllowlistPin(id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });

  return NextResponse.json({ ok: true, pin: result.pin });
}
