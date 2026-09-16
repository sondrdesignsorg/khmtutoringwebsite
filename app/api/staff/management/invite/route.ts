import { NextResponse } from 'next/server';
import { requireAdmin, getStaffSession } from '@/lib/staff/auth';
import { inviteStaff } from '@/lib/staff/access';
import { sendEmail, getEmailConfig } from '@/lib/email/resend';

export const runtime = 'nodejs';

// POST /api/staff/management/invite  -> { email, role }  (admin only)
// Creates/updates an allowlist entry, issues a fresh PIN, and emails the invite.
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { email, role } = await req.json() as { email?: string; role?: 'admin' | 'tutor' };
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const session = await getStaffSession();
  const result = await inviteStaff({ email, role: role ?? 'tutor', invitedBy: session?.email ?? session?.name ?? null });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });

  let emailSent = false;
  const config = getEmailConfig();
  if (config) {
    const staffLabel = result.entry.role === 'admin' ? 'admin' : 'tutor';
    const sent = await sendEmail({
      to: result.entry.email,
      subject: 'You\u2019re invited to the KHM Tutoring staff portal',
      html: [
        '<p>Hi!</p>',
        `<p>You have been added to the KHM Tutoring staff portal as a <strong>${staffLabel}</strong>.</p>`,
        '<p><strong>How to sign in:</strong></p>',
        '<ol>',
        `<li>Go to the <a href="https://khmtutoring.com/staff/login">Staff Portal</a>.</li>`,
        `<li>Click <strong>Continue with Google</strong> and use <strong>${result.entry.email}</strong>.</li>`,
        `<li>Enter your staff PIN: <strong>${result.pin}</strong></li>`,
        '</ol>',
        '<p>Your PIN is only for staff access — keep it to yourself. Questions? Reply to Kody.</p>',
      ].join(''),
    });
    emailSent = sent.ok;
  }

  return NextResponse.json({ ok: true, pin: result.pin, resend: result.resend, emailSent });
}
