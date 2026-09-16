import { NextResponse } from 'next/server';
import type { ResourceDraft } from '@/lib/staff/types';
import { getStaffSession, requireAdmin } from '@/lib/staff/auth';
import { listResources, createResource } from '@/lib/staff/resource-repo';

export const runtime = 'nodejs';

// GET /api/staff/resources  -> list all (any signed-in staff)
export async function GET() {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resources = await listResources();
  return NextResponse.json({ resources });
}

// POST /api/staff/resources  -> add one (admin only)
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const draft = await req.json() as ResourceDraft;
  const resource = await createResource(draft);
  return NextResponse.json({ resource }, { status: 201 });
}
