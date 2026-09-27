import { NextResponse } from 'next/server';
import type { TutorDraft } from '@/lib/staff/types';
import { requireAdmin, getStaffSession } from '@/lib/staff/auth';
import { listAllTutors, createTutor } from '@/lib/staff/tutor-repo';

export const runtime = 'nodejs';

// GET /api/staff/tutors -> all tutors, published or not (admin only)
export async function GET() {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const tutors = await listAllTutors();
  return NextResponse.json({ tutors });
}

// POST /api/staff/tutors -> add a tutor (admin only)
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const draft = await req.json() as TutorDraft;
  if (!draft?.name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const tutor = await createTutor({ ...draft, name: draft.name.trim() });
  return NextResponse.json({ tutor }, { status: 201 });
}
