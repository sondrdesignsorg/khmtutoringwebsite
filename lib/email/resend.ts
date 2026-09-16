import { Resend } from 'resend';

export interface EmailSendResult {
  ok: boolean;
  error?: string;
}

export interface EmailConfig {
  apiKey: string;
  from: string;
  staffEmail: string;
}

export function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_ADDRESS;
  const staffEmail =
    process.env.KHM_STAFF_EMAIL ||
    process.env.DIAGNOSTIC_STAFF_EMAIL ||
    'khmtutoring1@gmail.com';

  if (!apiKey || !from) return null;
  return { apiKey, from, staffEmail };
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<EmailSendResult> {
  const config = getEmailConfig();
  if (!config) {
    return {
      ok: false,
      error: 'RESEND_API_KEY and RESEND_FROM_ADDRESS must be configured.',
    };
  }

  try {
    const resend = new Resend(config.apiKey);
    const result = await resend.emails.send({
      from: config.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      replyTo: params.replyTo,
    });

    if (result.error) {
      return { ok: false, error: result.error.message };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown email error',
    };
  }
}
