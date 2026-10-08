import { sql } from '@vercel/postgres';

/**
 * Shared, Postgres-backed fixed-window rate limiter for public form endpoints
 * and outbound email. A database counter is used (rather than in-memory state)
 * because serverless functions scale horizontally and do not share memory.
 *
 * All helpers fail open: a transient database problem must never take down a
 * public form. Abuse protection is best-effort, not an availability risk.
 */

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        key text PRIMARY KEY,
        count integer NOT NULL DEFAULT 0,
        reset_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS rate_limits_reset_idx ON rate_limits (reset_at)`;
  })();
  return schemaReady;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/** Best-effort client IP from the proxy headers Vercel sets. */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Throws on database errors — prefer `checkRateLimit` in request handlers. */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  await ensureSchema();

  const { rows } = await sql<{ count: number; reset_at: string }>`
    INSERT INTO rate_limits (key, count, reset_at)
    VALUES (${key}, 1, now() + (${windowSeconds}::int * interval '1 second'))
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN rate_limits.reset_at <= now() THEN 1 ELSE rate_limits.count + 1 END,
      reset_at = CASE
        WHEN rate_limits.reset_at <= now()
          THEN now() + (${windowSeconds}::int * interval '1 second')
        ELSE rate_limits.reset_at
      END,
      updated_at = now()
    RETURNING count, reset_at
  `;

  // Opportunistically sweep old windows so the table stays small.
  await sql`DELETE FROM rate_limits WHERE reset_at < now() - interval '1 hour'`;

  const count = rows[0]?.count ?? 1;
  const resetAt = rows[0]?.reset_at ? new Date(rows[0].reset_at) : new Date();
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / 1000));

  return {
    ok: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds,
  };
}

/** Fail-open wrapper for request handlers. */
export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  try {
    return await rateLimit(key, limit, windowSeconds);
  } catch (err) {
    console.error('rate limit check failed; allowing request:', err);
    return { ok: true, remaining: limit, retryAfterSeconds: 0 };
  }
}

/** Standard 429 body/headers, or null when the request is allowed. */
export function tooManyRequests(result: RateLimitResult): { body: { error: string }; init: ResponseInit } | null {
  if (result.ok) return null;
  return {
    body: { error: 'Too many requests. Please slow down and try again shortly.' },
    init: { status: 429, headers: { 'Retry-After': String(result.retryAfterSeconds) } },
  };
}
