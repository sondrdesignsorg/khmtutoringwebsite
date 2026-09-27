import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';
import { getStaffSession } from '@/lib/staff/auth';
import { getResource } from '@/lib/staff/resource-repo';
import { sendEmail } from '@/lib/email/resend';

export const runtime = 'nodejs';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const resource = await getResource(id);
  if (!resource) return NextResponse.json({ error: 'File not found' }, { status: 404 });

  let buffer: Buffer | null = null;
  if (resource.storageProvider === 'vercel_blob' && resource.storageKey) {
    const blobResult = await get(resource.storageKey, { access: 'private' });
    if (!blobResult || blobResult.statusCode !== 200 || !blobResult.stream) {
      return NextResponse.json({ error: 'Blob file not found' }, { status: 404 });
    }
    buffer = Buffer.from(await new Response(blobResult.stream).arrayBuffer());
  } else if (resource.fileUrl) {
    const upstream = await fetch(resource.fileUrl);
    if (!upstream.ok) return NextResponse.json({ error: 'File not found' }, { status: 404 });
    buffer = Buffer.from(await upstream.arrayBuffer());
  }

  if (!buffer) {
    return NextResponse.json({ error: 'No file is attached to this resource' }, { status: 404 });
  }

  const filename = resource.originalFilename || `${resource.title}.pdf`;

  const sent = await sendEmail({
    to: session.email,
    subject: `KHM Resource Library: ${resource.title}`,
    html: [
      `<p>Hi ${session.name || 'there'},</p>`,
      `<p>The PDF you requested from the KHM Resource Library is attached.</p>`,
      `<ul>`,
      `<li><strong>Title:</strong> ${resource.title}</li>`,
      `<li><strong>Subject:</strong> ${resource.subject}</li>`,
      `<li><strong>Grade:</strong> ${resource.grade}</li>`,
      `</ul>`,
      `<p>— KHM Tutoring</p>`,
    ].join(''),
    attachments: [{ filename, content: buffer.toString('base64') }],
  });

  if (!sent.ok) {
    return NextResponse.json({ error: sent.error || 'Could not send the PDF email' }, { status: 502 });
  }

  return NextResponse.json({ emailed: true, recipient: session.email, filename });
}
