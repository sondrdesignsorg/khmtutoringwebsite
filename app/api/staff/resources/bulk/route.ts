import { NextResponse } from 'next/server';
import type { ResourceDraft } from '@/lib/staff/types';
import { requireAdmin } from '@/lib/staff/auth';
import { bulkCreateResources } from '@/lib/staff/resource-repo';

export const runtime = 'nodejs';

// POST /api/staff/resources/bulk  -> { drafts: ResourceDraft[] }  (admin only)
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { drafts } = await req.json() as { drafts: ResourceDraft[] };
  if (!drafts?.length) return NextResponse.json({ created: [], skipped: [], count: 0 }, { status: 201 });

  const { created, skipped } = await bulkCreateResources(drafts);
  return NextResponse.json({ created, skipped, count: created.length }, { status: 201 });
}
