import { NextResponse } from 'next/server';
import type { StudentDraft } from '@/lib/staff/types';
import { getStaffSession, requireAdmin } from '@/lib/staff/auth';
import { listStudents, createStudent, isDuplicateEmailError } from '@/lib/staff/student-repo';
import { isValidEmail } from '@/lib/staff/recipients';

export const runtime = 'nodejs';

// GET /api/staff/students -> student roster for the recipient picker (any staff)
export async function GET() {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const students = await listStudents();
  return NextResponse.json({ students });
}

// POST /api/staff/students -> add a student (admin only)
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const draft = await req.json() as StudentDraft;
  if (!draft?.name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (draft.email?.trim() && !isValidEmail(draft.email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
  }

  try {
    const student = await createStudent({ ...draft, name: draft.name.trim() });
    return NextResponse.json({ student }, { status: 201 });
  } catch (err) {
    if (isDuplicateEmailError(err)) {
      return NextResponse.json({ error: 'A student with that email already exists' }, { status: 409 });
    }
    console.error('student create failed:', err);
    return NextResponse.json({ error: 'Could not add student' }, { status: 500 });
  }
}
