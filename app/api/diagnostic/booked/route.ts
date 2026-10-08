import { NextResponse } from 'next/server';
import { z } from 'zod';
import { markDiagnosticLeadBooked } from '@/lib/diagnostic/leads';
import { checkRateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const BookedSchema = z.object({
  leadId: z.string().uuid(),
});

export async function POST(req: Request) {
  const limit = await checkRateLimit(`diagnostic-booked:${clientIp(req)}`, 30, 600);
  const limited = tooManyRequests(limit);
  if (limited) return NextResponse.json(limited.body, limited.init);

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = BookedSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    await markDiagnosticLeadBooked(parsed.data.leadId);
  } catch (err) {
    console.error('diagnostic lead booked_at update failed:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
