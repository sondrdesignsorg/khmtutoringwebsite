import { NextResponse } from 'next/server';
import type { LibraryFolderDraft } from '@/lib/staff/types';
import { requireAdmin } from '@/lib/staff/auth';
import { updateFolder, deleteFolder } from '@/lib/staff/folder-repo';

export const runtime = 'nodejs';

// PATCH /api/staff/folders/:id -> rename a folder (admin only)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const patch = await req.json() as Partial<LibraryFolderDraft>;

  try {
    const folder = await updateFolder(id, patch);
    if (!folder) return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    return NextResponse.json({ folder });
  } catch (err) {
    const message = err instanceof Error && /unique/i.test(err.message)
      ? 'A folder with that name already exists'
      : 'Could not update folder';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/staff/folders/:id (admin only) -> removes the folder, resources are kept
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const deleted = await deleteFolder(id);
  if (!deleted) return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
  return NextResponse.json({ id, deleted: true });
}
