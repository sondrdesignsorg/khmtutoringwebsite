import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import type { TutorDraft } from '@/lib/staff/types';
import { requireAdmin } from '@/lib/staff/auth';
import { getTutor, updateTutor, deleteTutor } from '@/lib/staff/tutor-repo';

export const runtime = 'nodejs';

// PATCH /api/staff/tutors/:id -> edit a tutor (admin only)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const patch = await req.json() as Partial<TutorDraft>;

  const before = await getTutor(id);
  const tutor = await updateTutor(id, patch);
  if (!tutor) return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });

  if (before?.imageKey && before.imageKey !== tutor.imageKey) {
    await del(before.imageKey).catch((err) => {
      console.error('tutor image blob delete failed:', err);
    });
  }

  return NextResponse.json({ tutor });
}

// DELETE /api/staff/tutors/:id (admin only)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const removed = await deleteTutor(id);
  if (!removed) return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });

  if (removed.imageKey) {
    await del(removed.imageKey).catch((err) => {
      console.error('tutor image blob delete failed:', err);
    });
  }

  return NextResponse.json({ id, deleted: true });
}
