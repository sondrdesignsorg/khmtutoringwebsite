import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import type { Resource } from '@/lib/staff/types';
import { requireAdmin } from '@/lib/staff/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { toResource, toResourcePatch, type DbResourceRow } from '@/lib/staff/resource-db';

// PATCH /api/staff/resources/:id  -> edit metadata (admin only)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const patch = await req.json() as Partial<Resource>;

  const db = createAdminClient();
  const { data, error } = await db
    .from('resources')
    .update(toResourcePatch(patch))
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ resource: toResource(data as DbResourceRow) });
}

// DELETE /api/staff/resources/:id  (admin only)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const db = createAdminClient();
  const { data: row, error: loadError } = await db
    .from('resources')
    .select('storage_provider, storage_key')
    .eq('id', id)
    .maybeSingle();

  if (loadError) return NextResponse.json({ error: loadError.message }, { status: 500 });

  const { error } = await db.from('resources').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (row?.storage_provider === 'vercel_blob' && row.storage_key) {
    await del(row.storage_key).catch((err) => {
      console.error('resource blob delete failed:', err);
    });
  }

  return NextResponse.json({ id, deleted: true });
}
