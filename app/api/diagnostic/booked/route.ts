import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const BookedSchema = z.object({
  leadId: z.string().uuid(),
});

export async function POST(req: Request) {
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

  const db = createAdminClient();
  const { error } = await db
    .from('diagnostic_leads')
    .update({ booked_at: new Date().toISOString() })
    .eq('id', parsed.data.leadId)
    .is('booked_at', null);

  if (error) {
    console.error('diagnostic_leads booked_at update failed:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
