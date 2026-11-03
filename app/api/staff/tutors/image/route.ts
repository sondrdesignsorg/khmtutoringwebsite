import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { requireAdmin } from '@/lib/staff/auth';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const body = await req.json() as HandleUploadBody;

    if (body.type === 'blob.generate-client-token' && !(await requireAdmin())) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const response = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        maximumSizeInBytes: MAX_IMAGE_SIZE,
        addRandomSuffix: true,
      }),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Tutor image upload request failed:', error);
    const message = error instanceof Error ? error.message : 'Image upload could not be started';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
