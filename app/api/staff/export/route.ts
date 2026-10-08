import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';
import { PDFDocument } from 'pdf-lib';
import { getStaffSession } from '@/lib/staff/auth';
import { getResourcesByIds } from '@/lib/staff/resource-repo';
import { resolveRecipient } from '@/lib/staff/recipients';
import { recordEmailSend } from '@/lib/staff/email-log';
import { escapeHtml } from '@/lib/html';
import { checkRateLimit, tooManyRequests } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/email/resend';
import type { Resource } from '@/lib/staff/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ids, delivery, studentId, email } = await req.json() as {
    ids: string[];
    delivery?: 'download' | 'email';
    studentId?: string;
    email?: string;
  };
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No resource IDs provided' }, { status: 400 });
  }

  // Email is the sensitive path: throttle it before doing expensive PDF work.
  if (delivery === 'email') {
    const limit = await checkRateLimit(`staff-email:${session.email}`, 40, 3600);
    const limited = tooManyRequests(limit);
    if (limited) return NextResponse.json(limited.body, limited.init);
  }

  const rows = await getResourcesByIds(ids);

  // Preserve the user's ordering
  const resourceMap = new Map(rows.map((r) => [r.id, r]));
  const resources = ids.map((id) => resourceMap.get(id)).filter(Boolean) as Resource[];

  const merged = await PDFDocument.create();

  // Append each PDF
  for (const resource of resources) {
    let pdfBytes: ArrayBuffer | null = null;

    if (resource.storageProvider === 'vercel_blob' && resource.storageKey) {
      const blobResult = await get(resource.storageKey, { access: 'private' });
      if (blobResult?.statusCode === 200 && blobResult.stream) {
        pdfBytes = await new Response(blobResult.stream).arrayBuffer();
      }
    } else if (resource.fileUrl) {
      const res = await fetch(resource.fileUrl);
      if (res.ok) pdfBytes = await res.arrayBuffer();
    }

    if (pdfBytes) {
      try {
        const doc = await PDFDocument.load(pdfBytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      } catch {
        // Skip unreadable PDFs silently
      }
    }
  }

  const pdfOut = Buffer.from(await merged.save());
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const slug = `KHM-Packet-${today.replace(/,?\s+/g, '-')}.pdf`;

  if (delivery === 'email') {
    if (resources.length === 0) {
      return NextResponse.json({ error: 'No readable files to email' }, { status: 400 });
    }

    // Default to the signed-in staff member; a student/recipient overrides it.
    let recipient = { email: session.email, name: session.name || '' };
    if (studentId || email) {
      const resolved = await resolveRecipient({ studentId, email });
      if (!resolved.ok) return NextResponse.json({ error: resolved.error }, { status: 400 });
      recipient = resolved.recipient;
    }
    if (pdfOut.length > 35 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'This packet is too large to email. Please download it instead.' },
        { status: 413 },
      );
    }

    const attachmentContent = pdfOut.toString('base64');
    if (attachmentContent.length > 40 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'This packet is too large to email. Please download it instead.' },
        { status: 413 },
      );
    }

    const subject = `Your KHM Resource Packet (${resources.length} file${resources.length === 1 ? '' : 's'})`;
    const sent = await sendEmail({
      to: recipient.email,
      subject,
      html: [
        `<p>Hi ${escapeHtml(recipient.name) || 'there'},</p>`,
        `<p>Your combined KHM Resource Library packet is attached.</p>`,
        `<ul>${resources.map((r) => `<li>${escapeHtml(r.title)}</li>`).join('')}</ul>`,
        `<p>— KHM Tutoring</p>`,
      ].join(''),
      attachments: [{ filename: slug, content: attachmentContent }],
    });

    await recordEmailSend({
      staffEmail: session.email,
      recipient: recipient.email,
      studentId: studentId ?? null,
      resourceIds: resources.map((r) => r.id),
      subject,
      status: sent.ok ? 'sent' : 'failed',
      error: sent.ok ? null : sent.error,
    });

    if (!sent.ok) {
      return NextResponse.json({ error: sent.error || 'Could not send the packet email' }, { status: 502 });
    }

    return NextResponse.json({ emailed: true, recipient: recipient.email, filename: slug, count: resources.length });
  }

  return new Response(pdfOut, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${slug}"`,
      'Cache-Control': 'no-store',
    },
  });
}
