import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createGroupSatInquiry, markGroupSatInquiryEmails } from '@/lib/sat-group/inquiries';
import { getEmailConfig, sendEmail } from '@/lib/email/resend';

export const runtime = 'nodejs';

const InquirySchema = z.object({
  parentName: z.string().trim().min(1).max(120),
  studentName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().nullable(),
  grade: z.string().trim().max(40).optional().nullable(),
  cohort: z.string().trim().min(1).max(120),
  satDate: z.string().trim().max(80).optional().nullable(),
  currentScore: z.string().trim().max(80).optional().nullable(),
  goals: z.string().trim().max(1000).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
});

type Inquiry = z.infer<typeof InquirySchema>;

function parentConfirmationHtml(p: Inquiry & { id: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr><td style="background:#2a476f;padding:28px 36px;text-align:center;">
          <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:#ffffff;">KHM Tutoring</p>
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);text-transform:uppercase;letter-spacing:0.5px;">SAT Cohort Fit Form Received</p>
        </td></tr>
        <tr><td style="padding:32px 36px;">
          <p style="margin:0 0 14px;font-size:17px;color:#111827;">Hi ${p.parentName},</p>
          <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#4b5563;">
            We received ${p.studentName}'s small-cohort SAT prep fit form. KHM will review the details and coordinate next steps by email.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;margin:0 0 20px;">
            <tr><td style="padding:16px 18px;font-size:14px;color:#111827;">
              <strong>Preferred cohort:</strong> ${p.cohort}<br>
              <strong>Grade:</strong> ${p.grade || 'Not provided'}<br>
              <strong>Target SAT date:</strong> ${p.satDate || 'Not provided'}<br>
              <strong>Current score/level:</strong> ${p.currentScore || 'Not provided'}
            </td></tr>
          </table>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
            The target start date is September 6, 2026. Cohorts are planned for 6-8 students and 20 total hours of instruction.
          </p>
        </td></tr>
        <tr><td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:18px 36px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">KHM Tutoring - Honolulu, Hawaii - khmtutoring1@gmail.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function staffNotificationHtml(p: Inquiry & { id: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr><td style="background:#1e3a5f;padding:24px 36px;">
          <p style="margin:0;font-size:18px;font-weight:800;color:#ffffff;">New Group SAT Inquiry</p>
          <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">Inquiry ID: ${p.id}</p>
        </td></tr>
        <tr><td style="padding:28px 36px;">
          <p style="margin:0 0 14px;font-size:15px;font-weight:700;color:#111827;">Student + Parent</p>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#374151;">
            Parent: ${p.parentName}<br>
            Student: ${p.studentName}${p.grade ? ` (${p.grade})` : ''}<br>
            Email: <a href="mailto:${p.email}" style="color:#2a476f;">${p.email}</a><br>
            Phone: ${p.phone || 'Not provided'}
          </p>
          <p style="margin:0 0 14px;font-size:15px;font-weight:700;color:#111827;">Cohort Fit Details</p>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;">
            Preferred cohort: ${p.cohort}<br>
            Target SAT date: ${p.satDate || 'Not provided'}<br>
            Current score/level: ${p.currentScore || 'Not provided'}<br>
            Goals: ${p.goals || 'Not provided'}<br>
            Notes: ${p.notes || 'Not provided'}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendInquiryEmails(params: Inquiry & { id: string }): Promise<{
  parent: boolean;
  staff: boolean;
  error?: string;
}> {
  const config = getEmailConfig();
  if (!config) {
    return {
      parent: false,
      staff: false,
      error: 'RESEND_API_KEY and RESEND_FROM_ADDRESS must be configured.',
    };
  }

  const [parentResult, staffResult] = await Promise.allSettled([
    sendEmail({
      to: params.email,
      replyTo: config.staffEmail,
      subject: 'KHM SAT Cohort Fit Form Received',
      html: parentConfirmationHtml(params),
    }),
    sendEmail({
      to: config.staffEmail,
      replyTo: params.email,
      subject: `New Group SAT Inquiry: ${params.studentName}`,
      html: staffNotificationHtml(params),
    }),
  ]);

  const parent = parentResult.status === 'fulfilled' && parentResult.value.ok;
  const staff = staffResult.status === 'fulfilled' && staffResult.value.ok;
  const error = [parentResult, staffResult]
    .map((result) => {
      if (result.status === 'rejected') return (result.reason as Error)?.message;
      return result.value.ok ? null : result.value.error;
    })
    .filter(Boolean)
    .join('; ');

  return { parent, staff, error: error || undefined };
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = InquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid inquiry', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const inquiry = {
    parentName: data.parentName,
    studentName: data.studentName,
    email: data.email,
    phone: data.phone || null,
    grade: data.grade || null,
    cohort: data.cohort,
    satDate: data.satDate || null,
    currentScore: data.currentScore || null,
    goals: data.goals || null,
    notes: data.notes || null,
  };

  try {
    const id = await createGroupSatInquiry(inquiry);
    const emailResult = await sendInquiryEmails({ ...inquiry, id });

    if (emailResult.parent || emailResult.staff) {
      await markGroupSatInquiryEmails(id, {
        confirmation: emailResult.parent,
        staff: emailResult.staff,
      }).catch((err) => console.error('group SAT email status update failed:', err));
    }

    if (emailResult.error) {
      console.error('group SAT inquiry email failed:', emailResult.error);
    }

    return NextResponse.json({
      id,
      emailed: emailResult.parent && emailResult.staff,
      parentEmailed: emailResult.parent,
      staffEmailed: emailResult.staff,
    });
  } catch (err) {
    console.error('group SAT inquiry insert failed:', err);
    return NextResponse.json({ error: 'Could not submit inquiry' }, { status: 500 });
  }
}
