import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const TopicResultSchema = z.object({
  topic: z.string(),
  correct: z.number().int().nonnegative(),
  total: z.number().int().positive(),
  pct: z.number().int().min(0).max(100),
  strong: z.boolean(),
});

const AnswerLogSchema = z.object({
  prompt: z.string(),
  topic: z.string(),
  choices: z.array(z.string()),
  correctIndex: z.number().int().nonnegative(),
  selectedIndex: z.number().int().nullable(),
});

const SubmitSchema = z.object({
  parentName: z.string().trim().min(1).max(120),
  studentName: z.string().trim().min(1).max(120),
  studentGrade: z.string().trim().max(20).optional().nullable(),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().nullable(),
  ageGroup: z.enum(['elementary', 'middle', 'high', 'satact']),
  subject: z.enum(['math', 'reading']),
  length: z.number().int().min(1).max(50),
  score: z.number().int().min(0).max(100),
  tier: z.string().min(1).max(60),
  topicBreakdown: z.array(TopicResultSchema).min(1),
  answers: z.array(AnswerLogSchema).optional(),
});

const AGE_LABEL: Record<string, string> = {
  elementary: 'Elementary (K–5)',
  middle: 'Middle School (6–8)',
  high: 'High School (9–12)',
  satact: 'SAT / ACT Prep',
};

const SUBJECT_LABEL: Record<string, string> = {
  math: 'Math',
  reading: 'Reading',
};

const STAFF_EMAIL = 'khmtutoring1@gmail.com';
const FROM_ADDRESS = 'KHM Tutoring <onboarding@resend.dev>';

type TopicResult = z.infer<typeof TopicResultSchema>;

function tierColor(tier: string): string {
  if (tier === 'Excelling') return '#16a34a';
  if (tier === 'Strong Foundation') return '#2563eb';
  if (tier === 'Building Skills') return '#d97706';
  return '#dc2626';
}

function topicRowsHtml(topics: TopicResult[]): string {
  return topics
    .map(
      (t) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#374151;">${t.topic}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#374151;text-align:center;">${t.correct}/${t.total}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:center;">
          <span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;background:${t.strong ? '#dcfce7' : '#fef3c7'};color:${t.strong ? '#15803d' : '#92400e'};">
            ${t.strong ? 'Strong' : 'Needs Work'}
          </span>
        </td>
      </tr>`,
    )
    .join('');
}

function parentEmailHtml(p: {
  parentName: string;
  studentName: string;
  ageGroup: string;
  subject: string;
  length: number;
  score: number;
  tier: string;
  topicBreakdown: TopicResult[];
  leadId: string;
}): string {
  const color = tierColor(p.tier);
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#2a476f 0%,#1e3a5f 100%);padding:32px 40px;text-align:center;">
          <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">KHM Tutoring</p>
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:0.5px;text-transform:uppercase;">Academic Diagnostic Results</p>
        </td></tr>

        <!-- Greeting -->
        <tr><td style="padding:36px 40px 20px;">
          <p style="margin:0 0 12px;font-size:17px;color:#111827;">Hi ${p.parentName},</p>
          <p style="margin:0;font-size:15px;color:#4b5563;line-height:1.6;">
            ${p.studentName} just completed the <strong>${AGE_LABEL[p.ageGroup] ?? p.ageGroup} ${SUBJECT_LABEL[p.subject] ?? p.subject}</strong> diagnostic (${p.length} questions). Here's a full breakdown of the results.
          </p>
        </td></tr>

        <!-- Score card -->
        <tr><td style="padding:0 40px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;">
            <tr>
              <td style="padding:24px;text-align:center;border-right:1px solid #e5e7eb;">
                <p style="margin:0 0 4px;font-size:38px;font-weight:800;color:#111827;">${p.score}%</p>
                <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Score</p>
              </td>
              <td style="padding:24px;text-align:center;">
                <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:${color};">${p.tier}</p>
                <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Performance Level</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Topic breakdown -->
        <tr><td style="padding:0 40px 28px;">
          <p style="margin:0 0 14px;font-size:15px;font-weight:600;color:#111827;">Topic Breakdown</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
            <tr style="background:#f3f4f6;">
              <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">Topic</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">Score</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">Level</th>
            </tr>
            ${topicRowsHtml(p.topicBreakdown)}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 40px 36px;text-align:center;">
          <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.6;">
            Our tutors can build on ${p.studentName}'s strengths and close the gaps identified above. Book a free consultation to get started.
          </p>
          <a href="https://www.khmtutoring.com/contact" style="display:inline-block;background:#2a476f;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:999px;">
            Book Free Consultation →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">KHM Tutoring · Honolulu, Hawaii · (808) 381-7856</p>
          <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">khmtutoring1@gmail.com</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function staffEmailHtml(p: {
  parentName: string;
  studentName: string;
  studentGrade: string | null;
  email: string;
  phone: string | null;
  ageGroup: string;
  subject: string;
  length: number;
  score: number;
  tier: string;
  topicBreakdown: TopicResult[];
  leadId: string;
}): string {
  const color = tierColor(p.tier);
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#1e3a5f;padding:24px 40px;">
          <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">🎯 New Diagnostic Lead</p>
          <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.65);">KHM Tutoring · Staff Notification</p>
        </td></tr>

        <!-- Contact info -->
        <tr><td style="padding:28px 40px 20px;">
          <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#111827;">Contact Info</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#6b7280;width:120px;">Parent</td>
              <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:500;">${p.parentName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#6b7280;">Student</td>
              <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:500;">${p.studentName}${p.studentGrade ? ` · ${p.studentGrade}` : ''}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#6b7280;">Email</td>
              <td style="padding:6px 0;font-size:14px;"><a href="mailto:${p.email}" style="color:#2a476f;">${p.email}</a></td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#6b7280;">Phone</td>
              <td style="padding:6px 0;font-size:14px;color:#111827;">${p.phone ?? 'Not provided'}</td>
            </tr>
          </table>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #f0f0f0;margin:0;"></td></tr>

        <!-- Test results -->
        <tr><td style="padding:20px 40px;">
          <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#111827;">Test Results</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;">
            <tr>
              <td style="padding:16px 20px;border-right:1px solid #e5e7eb;">
                <p style="margin:0 0 2px;font-size:26px;font-weight:800;color:#111827;">${p.score}%</p>
                <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.4px;">Score · ${p.length}q ${AGE_LABEL[p.ageGroup] ?? p.ageGroup} ${SUBJECT_LABEL[p.subject] ?? p.subject}</p>
              </td>
              <td style="padding:16px 20px;">
                <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:${color};">${p.tier}</p>
                <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.4px;">Performance Level</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Topic breakdown -->
        <tr><td style="padding:0 40px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
            <tr style="background:#f3f4f6;">
              <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">Topic</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">Score</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">Level</th>
            </tr>
            ${topicRowsHtml(p.topicBreakdown)}
          </table>
        </td></tr>

        <!-- CRM link -->
        <tr><td style="padding:0 40px 32px;text-align:center;">
          <a href="https://www.khmtutoring.com/staff/diagnostic-leads" style="display:inline-block;background:#2a476f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:999px;">
            View in CRM →
          </a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendResultsEmail(params: {
  leadId: string;
  parentName: string;
  studentName: string;
  studentGrade: string | null;
  email: string;
  phone: string | null;
  ageGroup: string;
  subject: string;
  length: number;
  score: number;
  tier: string;
  topicBreakdown: TopicResult[];
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY is not configured.' };
  }

  const resend = new Resend(apiKey);

  const [parentResult, staffResult] = await Promise.allSettled([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: params.email,
      replyTo: STAFF_EMAIL,
      subject: `${params.studentName}'s KHM Diagnostic Results — ${params.tier}`,
      html: parentEmailHtml(params),
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: STAFF_EMAIL,
      replyTo: params.email,
      subject: `New Lead: ${params.studentName} scored ${params.score}% (${params.tier})`,
      html: staffEmailHtml(params),
    }),
  ]);

  const parentOk = parentResult.status === 'fulfilled' && !parentResult.value.error;

  if (staffResult.status === 'rejected' || staffResult.value.error) {
    const err = staffResult.status === 'rejected'
      ? (staffResult.reason as Error)?.message
      : staffResult.value.error?.message;
    console.error('diagnostic staff email failed:', err);
  }

  return parentOk
    ? { ok: true }
    : {
        ok: false,
        error:
          parentResult.status === 'fulfilled'
            ? (parentResult.value.error?.message ?? 'Unknown Resend error')
            : (parentResult.reason as Error)?.message,
      };
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = SubmitSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const db = createAdminClient();
  const { data: inserted, error: insertError } = await db
    .from('diagnostic_leads')
    .insert({
      parent_name: data.parentName,
      student_name: data.studentName,
      student_grade: data.studentGrade || null,
      email: data.email,
      phone: data.phone || null,
      age_group: data.ageGroup,
      subject: data.subject,
      length: data.length,
      score: data.score,
      tier: data.tier,
      topic_breakdown: data.topicBreakdown,
      answers: data.answers ?? null,
    })
    .select('id')
    .single();

  if (insertError || !inserted) {
    console.error('diagnostic_leads insert failed:', insertError);
    return NextResponse.json(
      { error: 'Could not save your results. Please try again.' },
      { status: 500 },
    );
  }

  const leadId = inserted.id as string;

  const emailResult = await sendResultsEmail({
    leadId,
    parentName: data.parentName,
    studentName: data.studentName,
    studentGrade: data.studentGrade ?? null,
    email: data.email,
    phone: data.phone || null,
    ageGroup: data.ageGroup,
    subject: data.subject,
    length: data.length,
    score: data.score,
    tier: data.tier,
    topicBreakdown: data.topicBreakdown,
  });

  if (emailResult.ok) {
    const { error: updateError } = await db
      .from('diagnostic_leads')
      .update({ emailed_at: new Date().toISOString() })
      .eq('id', leadId);
    if (updateError) {
      console.error('diagnostic_leads emailed_at update failed:', updateError);
    }
  } else {
    console.error('diagnostic email send failed:', emailResult.error);
  }

  return NextResponse.json({ id: leadId, emailed: emailResult.ok });
}
