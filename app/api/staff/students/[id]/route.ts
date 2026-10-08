import { NextResponse } from 'next/server';
import type { StudentDraft } from '@/lib/staff/types';
import { requireAdmin } from '@/lib/staff/auth';
import { updateStudent, deleteStudent, isDuplicateEmailError } from '@/lib/staff/student-repo';
import { isValidEmail } from '@/lib/staff/recipients';

export const runtime = 'nodejs';

// PATCH /api/staff/students/:id -> edit a student (admin only)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const patch = await req.json() as Partial<StudentDraft>;
  if (patch.email?.trim() && !isValidEmail(patch.email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
  }

  try {
    const student = await updateStudent(id, patch);
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    return NextResponse.json({ student });
  } catch (err) {
    if (isDuplicateEmailError(err)) {
      return NextResponse.json({ error: 'A student with that email already exists' }, { status: 409 });
    }
    console.error('student update failed:', err);
    return NextResponse.json({ error: 'Could not update student' }, { status: 500 });
  }
}

// DELETE /api/staff/students/:id (admin only)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const deleted = await deleteStudent(id);
  if (!deleted) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  return NextResponse.json({ id, deleted: true });
}
