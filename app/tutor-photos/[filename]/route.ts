import { get } from '@vercel/blob';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const result = await get(`tutor-images/${filename}`, { access: 'private' });
    if (!result || result.statusCode !== 200) {
      return new Response('Not found', { status: 404 });
    }
    return new Response(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType,
        'Content-Length': String(result.blob.size),
        'Cache-Control': 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Tutor photo delivery failed:', error);
    return new Response('Photo unavailable', { status: 502 });
  }
}
