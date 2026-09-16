import { NextResponse } from 'next/server';
import { getStaffSession } from '@/lib/staff/auth';
import { findDuplicateResources } from '@/lib/staff/resource-repo';

export const runtime = 'nodejs';

interface DuplicateCheckInput {
  files?: Array<{
    id: string;
    filename: string;
    fileSize?: number;
    checksum?: string;
  }>;
}

export async function POST(req: Request) {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({})) as DuplicateCheckInput;
  const files = body.files ?? [];
  if (!files.length) return NextResponse.json({ duplicates: {} });

  const duplicates = await findDuplicateResources(files);
  return NextResponse.json({ duplicates });
}
