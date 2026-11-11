import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/staff/auth';
import { MAX_SERVER_IMAGE_BYTES, UPLOADABLE_IMAGE_MIME_TYPES } from '@/lib/image-upload';

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/bmp': 'bmp',
  'image/tiff': 'tiff',
};

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const contentType = req.headers.get('content-type')?.split(';')[0].trim().toLowerCase() ?? '';
  if (!UPLOADABLE_IMAGE_MIME_TYPES.some((type) => type === contentType)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 });
  }
  const declaredSize = Number(req.headers.get('content-length'));
  if (declaredSize > MAX_SERVER_IMAGE_BYTES) {
    return NextResponse.json({ error: 'Image is too large for this upload path' }, { status: 413 });
  }

  try {
    const bytes = await req.arrayBuffer();
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_SERVER_IMAGE_BYTES) {
      return NextResponse.json({ error: 'Image must be between 1 byte and 4 MB' }, { status: 413 });
    }
    const extension = EXTENSIONS[contentType];
    const blob = await put(`tutor-images/${Date.now()}-photo.${extension}`, bytes, {
      access: 'public',
      addRandomSuffix: true,
      contentType,
    });
    return NextResponse.json({ url: blob.url, pathname: blob.pathname });
  } catch (error) {
    console.error('Tutor image server upload failed:', error);
    return NextResponse.json({ error: 'Photo upload failed. Please try again.' }, { status: 500 });
  }
}
