import { sql } from '@vercel/postgres';
import { ensureStaffSchema } from './db';

/**
 * Audit trail for worksheets/packets emailed from the staff library.
 * Recording is best-effort so a logging failure never blocks a send.
 */

export interface EmailSendRecord {
  staffEmail: string;
  recipient: string;
  studentId?: string | null;
  resourceIds?: string[];
  subject: string;
  status: 'sent' | 'failed';
  error?: string | null;
}

export interface EmailSendRow {
  id: string;
  staff_email: string;
  recipient: string;
  student_id: string | null;
  resource_ids: string[];
  subject: string;
  status: 'sent' | 'failed';
  error: string | null;
  created_at: string;
}

/** @vercel/postgres types require a scalar; JS arrays serialize as text[] at runtime. */
const pgArray = (values: string[]): string => values as unknown as string;

export async function recordEmailSend(record: EmailSendRecord): Promise<void> {
  try {
    await ensureStaffSchema();
    await sql`
      INSERT INTO email_sends (id, staff_email, recipient, student_id, resource_ids, subject, status, error)
      VALUES (
        ${crypto.randomUUID()},
        ${record.staffEmail.toLowerCase().trim()},
        ${record.recipient.toLowerCase().trim()},
        ${record.studentId ?? null},
        ${pgArray(record.resourceIds ?? [])},
        ${record.subject.slice(0, 200)},
        ${record.status},
        ${record.error ? record.error.slice(0, 500) : null}
      )
    `;
  } catch (err) {
    console.error('failed to record email send:', err);
  }
}

export async function listRecentEmailSends(limit = 50): Promise<EmailSendRow[]> {
  await ensureStaffSchema();
  const { rows } = await sql<EmailSendRow>`
    SELECT * FROM email_sends ORDER BY created_at DESC LIMIT ${Math.min(Math.max(limit, 1), 200)}
  `;
  return rows;
}
