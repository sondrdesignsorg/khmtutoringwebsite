import { NextResponse } from 'next/server';
import { z } from 'zod';
import { CONTACT_SUBJECTS } from '@/lib/contact/subjects';
import { sendFormNotification } from '@/lib/email/resend';
import { escapeHtml } from '@/lib/html';
import { checkRateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const ContactSchema = z.object({
  submissionId: z.uuid(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(1).max(60),
  grade: z.string().trim().max(120).optional(),
  school: z.string().trim().max(200).optional(),
  subject: z.enum(Object.keys(CONTACT_SUBJECTS) as (keyof typeof CONTACT_SUBJECTS)[]),
  message: z.string().trim().min(1).max(5000),
  website: z.literal('').optional(),
});

export async function POST(req: Request) {
  const limit = await checkRateLimit(`contact-inquiry:${clientIp(req)}`, 5, 600);
  const limited = tooManyRequests(limit);
  if (limited) return NextResponse.json(limited.body, limited.init);

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid inquiry' }, { status: 400 });
  }

  const { submissionId, name, email, phone, grade, school, subject, message } = parsed.data;
  const subjectLabel = CONTACT_SUBJECTS[subject];
  const result = await sendFormNotification({
    replyTo: email,
    subject: `New Website Inquiry: ${subjectLabel}`,
    html: [
      '<h1>New Website Inquiry</h1>',
      `<p><strong>Name:</strong> ${escapeHtml(name)}<br>`,
      `<strong>Email:</strong> ${escapeHtml(email)}<br>`,
      `<strong>Phone:</strong> ${escapeHtml(phone)}<br>`,
      `<strong>Grade:</strong> ${escapeHtml(grade || 'Not provided')}<br>`,
      `<strong>School:</strong> ${escapeHtml(school || 'Not provided')}<br>`,
      `<strong>Subject:</strong> ${subjectLabel}</p>`,
      `<p><strong>Message:</strong><br>${escapeHtml(message).replace(/\r?\n/g, '<br>')}</p>`,
    ].join(''),
    idempotencyKey: `contact-inquiry/${submissionId}`,
  });

  if (!result.ok) {
    console.error('contact inquiry email failed');
    return NextResponse.json({ error: 'Could not submit inquiry' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
