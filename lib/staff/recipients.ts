import { getStudent } from './student-repo';

export interface ResolvedRecipient {
  email: string;
  name: string;
}

export interface RecipientInput {
  studentId?: unknown;
  email?: unknown;
}

/** Lightweight email shape check — the mail provider does the real validation. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Resolves an outbound recipient from either a saved student id or a raw
 * email address typed by staff. Student ids win when both are supplied.
 */
export async function resolveRecipient(
  input: RecipientInput,
): Promise<{ ok: true; recipient: ResolvedRecipient } | { ok: false; error: string }> {
  const studentId = typeof input.studentId === 'string' ? input.studentId.trim() : '';
  if (studentId) {
    const student = await getStudent(studentId);
    if (!student) return { ok: false, error: 'Student not found' };
    if (!isValidEmail(student.email)) {
      return { ok: false, error: `${student.name} has no email address on file.` };
    }
    return { ok: true, recipient: { email: student.email, name: student.name } };
  }

  const rawEmail = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (rawEmail) {
    if (!isValidEmail(rawEmail)) return { ok: false, error: 'Enter a valid email address' };
    return { ok: true, recipient: { email: rawEmail, name: '' } };
  }

  return { ok: false, error: 'No recipient provided' };
}
