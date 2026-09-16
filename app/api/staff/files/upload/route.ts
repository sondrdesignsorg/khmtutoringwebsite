import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { requireAdmin } from '@/lib/staff/auth';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(req: Request) {
  const body = await req.json() as HandleUploadBody;

  if (body.type === 'blob.generate-client-token' && !(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const response = await handleUpload({
    request: req,
    body,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ['application/pdf'],
      maximumSizeInBytes: MAX_FILE_SIZE,
      // Canonical keys already embed a content checksum, so an identical
      // re-upload may safely overwrite the same path instead of adding a
      // random suffix (which would break the library naming convention).
      allowOverwrite: true,
    }),
  });

  return NextResponse.json(response);
}
