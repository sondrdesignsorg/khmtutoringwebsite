import { Resend } from 'resend';
import { BUSINESS } from '@/lib/business/config';

export interface EmailSendResult {
  ok: boolean;
  error?: string;
}

export interface EmailConfig {
  apiKey: string;
  from: string;
}

export function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_ADDRESS;

  if (!apiKey || !from) return null;
  return { apiKey, from };
}

export interface EmailAttachment {
  filename: string;
  /** Base64-encoded file content, as required by the Resend API. */
  content: string;
}

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
  idempotencyKey?: string;
}

export function sendFormNotification(params: Omit<SendEmailParams, 'to'>): Promise<EmailSendResult> {
  return sendEmail({ ...params, to: BUSINESS.email });
}

export async function sendEmail(params: SendEmailParams): Promise<EmailSendResult> {
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
      ...(params.attachments?.length ? { attachments: params.attachments } : {}),
    }, params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : undefined);

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
