import { NextResponse } from 'next/server';
import type { LibraryFolderDraft } from '@/lib/staff/types';
import { getStaffSession, requireAdmin } from '@/lib/staff/auth';
import { listFolders, createFolder } from '@/lib/staff/folder-repo';

export const runtime = 'nodejs';

// GET /api/staff/folders -> editable folder list (any signed-in staff)
export async function GET() {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const folders = await listFolders();
  return NextResponse.json({ folders });
}

// POST /api/staff/folders -> add a folder (admin only)
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const draft = await req.json() as LibraryFolderDraft;
  if (!draft?.name?.trim()) {
    return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
  }

  try {
    const folder = await createFolder({ ...draft, name: draft.name.trim() });
    return NextResponse.json({ folder }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error && /unique/i.test(err.message)
      ? 'A folder with that name already exists'
      : 'Could not create folder';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
