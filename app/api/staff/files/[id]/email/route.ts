import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';
import { getStaffSession } from '@/lib/staff/auth';
import { getResource } from '@/lib/staff/resource-repo';
import { resolveRecipient } from '@/lib/staff/recipients';
import { recordEmailSend } from '@/lib/staff/email-log';
import { escapeHtml } from '@/lib/html';
import { checkRateLimit, tooManyRequests } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/email/resend';

export const runtime = 'nodejs';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limit = await checkRateLimit(`staff-email:${session.email}`, 40, 3600);
  const limited = tooManyRequests(limit);
  if (limited) return NextResponse.json(limited.body, limited.init);

  const body = await req.json().catch(() => ({})) as { studentId?: string; email?: string };

  // No recipient supplied means the original "Email me" behavior.
  let recipient = { email: session.email, name: session.name || '' };
  if (body.studentId || body.email) {
    const resolved = await resolveRecipient(body);
    if (!resolved.ok) return NextResponse.json({ error: resolved.error }, { status: 400 });
    recipient = resolved.recipient;
  }

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
  const subject = `KHM Resource Library: ${resource.title}`;

  const sent = await sendEmail({
    to: recipient.email,
    subject,
    html: [
      `<p>Hi ${escapeHtml(recipient.name) || 'there'},</p>`,
      `<p>The PDF you requested from the KHM Resource Library is attached.</p>`,
      `<ul>`,
      `<li><strong>Title:</strong> ${escapeHtml(resource.title)}</li>`,
      `<li><strong>Subject:</strong> ${escapeHtml(resource.subject)}</li>`,
      `<li><strong>Grade:</strong> ${escapeHtml(resource.grade)}</li>`,
      `</ul>`,
      `<p>— KHM Tutoring</p>`,
    ].join(''),
    attachments: [{ filename, content: buffer.toString('base64') }],
  });

  await recordEmailSend({
    staffEmail: session.email,
    recipient: recipient.email,
    studentId: body.studentId ?? null,
    resourceIds: [resource.id],
    subject,
    status: sent.ok ? 'sent' : 'failed',
    error: sent.ok ? null : sent.error,
  });

  if (!sent.ok) {
    return NextResponse.json({ error: sent.error || 'Could not send the PDF email' }, { status: 502 });
  }

  return NextResponse.json({ emailed: true, recipient: recipient.email, filename });
}
