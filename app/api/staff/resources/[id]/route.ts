import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import type { Resource } from '@/lib/staff/types';
import { requireAdmin } from '@/lib/staff/auth';
import { updateResource, deleteResource } from '@/lib/staff/resource-repo';

export const runtime = 'nodejs';

// PATCH /api/staff/resources/:id  -> edit metadata (admin only)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const patch = await req.json() as Partial<Resource>;

  const resource = await updateResource(id, patch);
  if (!resource) return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  return NextResponse.json({ resource });
}

// DELETE /api/staff/resources/:id  (admin only)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const removed = await deleteResource(id);
  if (!removed) return NextResponse.json({ error: 'Resource not found' }, { status: 404 });

  if (removed.storageProvider === 'vercel_blob' && removed.storageKey) {
    await del(removed.storageKey).catch((err) => {
      console.error('resource blob delete failed:', err);
    });
  }

  return NextResponse.json({ id, deleted: true });
}
