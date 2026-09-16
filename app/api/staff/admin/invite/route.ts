import { NextResponse } from 'next/server';
import { requireAdmin, getStaffSession } from '@/lib/staff/auth';
import { inviteStaff } from '@/lib/staff/access';

// POST /api/staff/admin/invite  -> { email, role }  (admin only)
// Legacy endpoint — allowlists a Google email and issues a staff PIN.
// Prefer /api/staff/management/invite, which also emails the invite.
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { email, role } = await req.json() as { email?: string; role?: 'admin' | 'tutor' };
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const session = await getStaffSession();
  const result = await inviteStaff({ email, role: role ?? 'tutor', invitedBy: session?.email ?? null });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });

  return NextResponse.json({ ok: true, pin: result.pin, resend: result.resend });
}
