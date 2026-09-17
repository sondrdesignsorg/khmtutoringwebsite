import { sql } from '@vercel/postgres';
import { randomInt, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { ensureStaffSchema } from './db';
import type { StaffRole } from './types';

/**
 * Staff access control for the Google sign-in flow.
 *
 * Google users are only granted access when their email is in
 * `staff_allowlist` and they have verified a PIN issued by an admin.
 * The PIN is scrypt-hashed at rest and verified with a rate limit.
 */

export const PIN_LENGTH = 6;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export interface AllowlistEntry {
  id: string;
  email: string;
  role: StaffRole;
  pin_hash: string | null;
  failed_attempts: number;
  locked_until: string | null;
  status: 'invited' | 'active' | 'disabled';
  invited_by: string | null;
  created_at: string;
  updated_at: string;
}

export function generatePin(): string {
  return randomInt(0, 10 ** PIN_LENGTH).toString().padStart(PIN_LENGTH, '0');
}

export function hashPin(pin: string, saltHex?: string): string {
  const salt = saltHex ? Buffer.from(saltHex, 'hex') : randomBytes(16);
  const hash = scryptSync(pin, salt, 32).toString('hex');
  return `${salt.toString('hex')}:${hash}`;
}

export function verifyPinHash(pin: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(pin, Buffer.from(saltHex, 'hex'), 32);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function getAllowlistEntry(email: string): Promise<AllowlistEntry | null> {
  await ensureStaffSchema();
  const { rows } = await sql<AllowlistEntry>`
    SELECT * FROM staff_allowlist WHERE email = ${email.toLowerCase().trim()} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function listAllowlist(): Promise<AllowlistEntry[]> {
  await ensureStaffSchema();
  const { rows } = await sql<AllowlistEntry>`
    SELECT * FROM staff_allowlist ORDER BY created_at ASC
  `;
  return rows;
}

export async function verifyStaffPin(email: string, pin: string): Promise<
  { ok: true; role: StaffRole } | { ok: false; error: string; locked?: boolean }
> {
  await ensureStaffSchema();
  const entry = await getAllowlistEntry(email);

  if (!entry) {
    return { ok: false, error: 'This Google account is not registered for the KHM staff portal. Contact Kody if you need access.' };
  }

  if (entry.status === 'disabled') return { ok: false, error: 'This staff account has been disabled. Contact Kody.' };

  if (entry.locked_until && new Date(entry.locked_until) > new Date()) {
    return { ok: false, error: 'Too many incorrect PIN attempts. Try again in 15 minutes.', locked: true };
  }

  if (!entry.pin_hash) {
    return { ok: false, error: 'No PIN has been issued for this account yet. Ask Kody or an admin to send one.' };
  }

  if (verifyPinHash(pin, entry.pin_hash)) {
    await activateEntry(entry.id);
    return { ok: true, role: entry.role };
  }

  const failed = (entry.failed_attempts ?? 0) + 1;
  const lockedUntil = failed >= MAX_FAILED_ATTEMPTS
    ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString()
    : null;
  await sql`
    UPDATE staff_allowlist
    SET failed_attempts = ${lockedUntil ? 0 : failed},
        locked_until = ${lockedUntil ?? null},
        updated_at = now()
    WHERE id = ${entry.id}
  `;
  return {
    ok: false,
    locked: !!lockedUntil,
    error: lockedUntil
      ? 'Too many incorrect PIN attempts. Try again in 15 minutes.'
      : `Incorrect PIN. ${MAX_FAILED_ATTEMPTS - failed} attempt${MAX_FAILED_ATTEMPTS - failed === 1 ? '' : 's'} left.`,
  };
}

async function activateEntry(id: string): Promise<void> {
  await sql`
    UPDATE staff_allowlist
    SET failed_attempts = 0, locked_until = null, status = 'active', updated_at = now()
    WHERE id = ${id}
  `;
}

export interface StaffInvite {
  email: string;
  role: StaffRole;
  invitedBy?: string | null;
}

export async function inviteStaff(input: StaffInvite): Promise<
  { ok: true; pin: string; entry: AllowlistEntry; resend: boolean } | { ok: false; error: string }
> {
  const email = input.email.toLowerCase().trim();
  if (!email) return { ok: false, error: 'Email is required' };

  await ensureStaffSchema();
  const pin = generatePin();
  const existing = await getAllowlistEntry(email);

  if (existing) {
    const { rows } = await sql<AllowlistEntry>`
      UPDATE staff_allowlist
      SET role = ${input.role ?? 'tutor'},
          pin_hash = ${hashPin(pin)},
          pin_updated_at = now(),
          failed_attempts = 0,
          locked_until = null,
          status = 'invited',
          invited_by = ${input.invitedBy ?? existing.invited_by},
          updated_at = now()
      WHERE id = ${existing.id}
      RETURNING *
    `;
    return { ok: true, pin, entry: rows[0], resend: true };
  }

  const { rows } = await sql<AllowlistEntry>`
    INSERT INTO staff_allowlist (id, email, role, pin_hash, pin_updated_at, status, invited_by)
    VALUES (${randomUUID()}, ${email}, ${input.role ?? 'tutor'}, ${hashPin(pin)}, now(), 'invited', ${input.invitedBy ?? null})
    RETURNING *
  `;
  return { ok: true, pin, entry: rows[0], resend: false };
}

export async function updateAllowlistEntry(
  id: string,
  updates: { role?: StaffRole; status?: 'invited' | 'active' | 'disabled' },
): Promise<{ ok: true; entry: AllowlistEntry } | { ok: false; error: string }> {
  await ensureStaffSchema();
  const { rows } = await sql<AllowlistEntry>`
    UPDATE staff_allowlist
    SET role = COALESCE(${updates.role ?? null}, role),
        status = COALESCE(${updates.status ?? null}, status),
        updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  if (!rows[0]) return { ok: false, error: 'Staff entry not found' };
  return { ok: true, entry: rows[0] };
}

export async function resetAllowlistPin(id: string): Promise<
  { ok: true; pin: string; entry: AllowlistEntry } | { ok: false; error: string }
> {
  await ensureStaffSchema();
  const pin = generatePin();
  const { rows } = await sql<AllowlistEntry>`
    UPDATE staff_allowlist
    SET pin_hash = ${hashPin(pin)},
        pin_updated_at = now(),
        failed_attempts = 0,
        locked_until = null,
        status = 'invited',
        updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  if (!rows[0]) return { ok: false, error: 'Staff entry not found' };
  return { ok: true, pin, entry: rows[0] };
}

/** Logs a successful sign-in so the management page can show join status. */
export async function recordStaffSignIn(email: string, name: string | null, provider = 'google'): Promise<void> {
  await ensureStaffSchema();
  await sql`
    INSERT INTO staff_sessions (email, name, provider, last_sign_in_at)
    VALUES (${email.toLowerCase().trim()}, ${name ?? null}, ${provider}, now())
    ON CONFLICT (email) DO UPDATE
    SET name = EXCLUDED.name, provider = EXCLUDED.provider, last_sign_in_at = now()
  `;
}
