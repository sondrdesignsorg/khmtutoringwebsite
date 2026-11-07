import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { requireAdmin } from '@/lib/staff/auth';
import { MAX_IMAGE_UPLOAD_BYTES, UPLOADABLE_IMAGE_MIME_TYPES } from '@/lib/image-upload';

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
        allowedContentTypes: [...UPLOADABLE_IMAGE_MIME_TYPES],
        maximumSizeInBytes: MAX_IMAGE_UPLOAD_BYTES,
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
