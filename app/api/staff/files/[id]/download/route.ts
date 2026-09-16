import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';
import { getStaffSession } from '@/lib/staff/auth';
import { getResource } from '@/lib/staff/resource-repo';

export const runtime = 'nodejs';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const resource = await getResource(id);
  if (!resource) return NextResponse.json({ error: 'File not found' }, { status: 404 });
  const url = new URL(req.url);
  const asDownload = url.searchParams.get('download') === '1';
  const filename = resource.originalFilename || `${resource.title}.pdf`;

  if (resource.storageProvider === 'vercel_blob' && resource.storageKey) {
    const blobResult = await get(resource.storageKey, { access: 'private' });
    if (!blobResult || blobResult.statusCode !== 200 || !blobResult.stream) {
      return NextResponse.json({ error: 'Blob file not found' }, { status: 404 });
    }

    const buffer = Buffer.from(await new Response(blobResult.stream).arrayBuffer());
    const headers = new Headers();
    headers.set('Content-Type', resource.mimeType || 'application/pdf');
    headers.set('Content-Disposition', `${asDownload ? 'attachment' : 'inline'}; filename="${filename.replace(/"/g, '')}"`);
    headers.set('Content-Length', String(buffer.length));
    headers.set('Cache-Control', 'private, max-age=300');
    return new Response(buffer, { status: 200, headers });
  }

  if (resource.fileUrl) {
    const upstream = await fetch(resource.fileUrl);
    if (!upstream.ok) return NextResponse.json({ error: 'File not found' }, { status: 404 });

    const headers = new Headers();
    headers.set('Content-Type', resource.mimeType || 'application/pdf');
    headers.set('Content-Disposition', `${asDownload ? 'attachment' : 'inline'}; filename="${filename.replace(/"/g, '')}"`);
    headers.set('Cache-Control', 'private, max-age=300');
    return new Response(upstream.body, { status: 200, headers });
  }

  return NextResponse.json({ error: 'No file is attached to this resource' }, { status: 404 });
}
