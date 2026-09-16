'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Ban, Check, Copy, KeyRound, Mail, ShieldCheck, UserPlus,
} from 'lucide-react';
import type { AllowlistEntry } from '@/lib/staff/access';
import type { StaffSession } from '@/lib/staff/auth';
import type { StaffAuthUser } from '@/app/staff/management/page';
import { PortalChrome } from './PortalChrome';
import { Modal, ModalCloseButton } from './Modal';
import { StaffSelect } from './StaffSelect';
import { Toast } from './Toast';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PinReveal = { email: string; pin: string; emailSent: boolean };

const STATUS_META: Record<AllowlistEntry['status'], { chip: string; label: string }> = {
  invited: { chip: 'bg-[hsl(45_85%_60%/0.20)] text-[hsl(38_70%_38%)]', label: 'Invited' },
  active: { chip: 'bg-[hsl(160_60%_42%/0.14)] text-[hsl(160_60%_30%)]', label: 'Active' },
  disabled: { chip: 'bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_70%_45%)]', label: 'Disabled' },
};

export function StaffManagementClient({
  session,
  initialEntries,
  authUsers,
}: {
  session: StaffSession;
  initialEntries: AllowlistEntry[];
  authUsers: StaffAuthUser[];
}) {
  const router = useRouter();
  const [entries, setEntries] = useState<AllowlistEntry[]>(initialEntries);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'tutor' | 'admin'>('tutor');
  const [inviting, setInviting] = useState(false);
  const [reveal, setReveal] = useState<PinReveal | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3200); };

  const authByEmail = (e: string) => authUsers.find((u) => u.email.toLowerCase() === e.toLowerCase());

  async function invite() {
    if (!email.trim()) return;
    setInviting(true);
    try {
      const res = await fetch('/api/staff/management/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const body = await res.json().catch(() => ({})) as { ok?: boolean; error?: string; pin?: string; emailSent?: boolean; resend?: boolean };
      if (!res.ok || !body.ok) throw new Error(body.error ?? 'Unable to invite');
      setEmail('');
      setReveal({ email: email.trim(), pin: body.pin ?? '', emailSent: !!body.emailSent });
      router.refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Unable to invite');
    } finally {
      setInviting(false);
    }
  }

  async function changeRole(entry: AllowlistEntry, nextRole: 'tutor' | 'admin') {
    try {
      const res = await fetch(`/api/staff/management/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });
      const body = await res.json().catch(() => ({})) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? 'Unable to update role');
      setEntries((s) => s.map((e) => (e.id === entry.id ? { ...e, role: nextRole } : e)));
      flash(`${entry.email} is now ${nextRole === 'admin' ? 'an admin' : 'a tutor'}`);
      router.refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Unable to update role');
    }
  }

  async function toggleStatus(entry: AllowlistEntry) {
    const nextStatus = entry.status === 'disabled' ? 'invited' : 'disabled';
    try {
      const res = await fetch(`/api/staff/management/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const body = await res.json().catch(() => ({})) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? 'Unable to update status');
      setEntries((s) => s.map((e) => (e.id === entry.id ? { ...e, status: nextStatus } : e)));
      flash(nextStatus === 'disabled' ? `${entry.email} disabled` : `${entry.email} re-enabled (PIN required again)`);
      router.refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Unable to update status');
    }
  }

  async function resetPin(entry: AllowlistEntry) {
    try {
      const res = await fetch(`/api/staff/management/${entry.id}/reset-pin`, { method: 'POST' });
      const body = await res.json().catch(() => ({})) as { ok?: boolean; error?: string; pin?: string };
      if (!res.ok || !body.ok) throw new Error(body.error ?? 'Unable to reset PIN');
      setReveal({ email: entry.email, pin: body.pin ?? '', emailSent: false });
      setEntries((s) => s.map((e) => (e.id === entry.id ? { ...e, status: 'invited' as const } : e)));
      router.refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Unable to reset PIN');
    }
  }

  return (
    <div className="min-h-[70vh] bg-background">
      <PortalChrome session={session} crumbs={[{ label: 'Staff Management' }]} showLeadsLink showAdminLink />

      <div className="mx-auto max-w-[1280px] px-6 pb-20 pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mb-1.5 font-heading text-4xl font-bold">Staff Management</h1>
            <p className="text-base text-muted-foreground">Invite tutors by email, issue PINs, and control access. Visible to admins only.</p>
          </div>
          <button
            onClick={() => router.push('/staff/library')}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10"
          >
            <ArrowLeft className="size-4" />Back to Library
          </button>
        </div>

        <div className="mb-7 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-base font-bold">
            <UserPlus className="size-[18px] text-primary" />Invite a tutor
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[280px] flex-1">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tutor@gmail.com"
                className="h-10 pl-10"
              />
            </div>
            <StaffSelect
              value={role}
              onChange={(v) => setRole(v as 'tutor' | 'admin')}
              options={[{ value: 'tutor', label: 'Tutor' }, { value: 'admin', label: 'Admin' }]}
            />
            <button
              onClick={invite}
              disabled={inviting || !email.trim()}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {inviting ? 'Sending…' : 'Invite & Issue PIN'}
            </button>
          </div>
          <p className="mt-3 text-[12.5px] text-muted-foreground">
            The tutor signs in with Google using this email, then enters the PIN. The invite email includes the PIN automatically.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <ShieldCheck className="size-[18px] text-primary" />
            <span className="text-base font-bold">Staff Access</span>
            <span className="text-xs text-muted-foreground">{entries.length} entr{entries.length === 1 ? 'y' : 'ies'}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13.5px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.05em] text-muted-foreground">
                  <th className="border-b border-border px-4 py-3 font-semibold">Email</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Role</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Status</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Signed in</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Invited by</th>
                  <th className="border-b border-border px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const auth = authByEmail(entry.email);
                  const meta = STATUS_META[entry.status];
                  return (
                    <tr key={entry.id}>
                      <td className="border-b border-border/50 px-4 py-3 align-middle font-semibold">{entry.email}</td>
                      <td className="border-b border-border/50 px-4 py-3 align-middle">
                        <StaffSelect
                          value={entry.role}
                          onChange={(v) => changeRole(entry, v as 'tutor' | 'admin')}
                          options={[{ value: 'tutor', label: 'Tutor' }, { value: 'admin', label: 'Admin' }]}
                        />
                      </td>
                      <td className="border-b border-border/50 px-4 py-3 align-middle">
                        <span className={cn('rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold', meta.chip)}>{meta.label}</span>
                      </td>
                      <td className="border-b border-border/50 px-4 py-3 align-middle text-muted-foreground">
                        {auth ? (auth.provider === 'google' ? 'Google' : 'Email') : 'Not yet'}
                      </td>
                      <td className="border-b border-border/50 px-4 py-3 align-middle text-muted-foreground">{entry.invited_by ?? '—'}</td>
                      <td className="border-b border-border/50 px-4 py-3 text-right align-middle">
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => resetPin(entry)}
                            title="Reset PIN"
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-[12.5px] font-semibold text-primary transition-colors hover:bg-primary/[0.08]"
                          >
                            <KeyRound className="size-3.5" />Reset PIN
                          </button>
                          <button
                            onClick={() => toggleStatus(entry)}
                            title={entry.status === 'disabled' ? 'Enable' : 'Disable'}
                            className={cn(
                              'inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[12.5px] font-semibold transition-colors',
                              entry.status === 'disabled'
                                ? 'border-border bg-card text-[hsl(160_60%_30%)] hover:bg-[hsl(160_60%_42%/0.1)]'
                                : 'border-border bg-card text-[hsl(0_70%_45%)] hover:bg-[hsl(0_84%_60%/0.1)]',
                            )}
                          >
                            {entry.status === 'disabled' ? <Check className="size-3.5" /> : <Ban className="size-3.5" />}
                            {entry.status === 'disabled' ? 'Enable' : 'Disable'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No staff yet — invite a tutor above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {reveal && <PinRevealModal reveal={reveal} onClose={() => setReveal(null)} />}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function PinRevealModal({ reveal, onClose }: { reveal: PinReveal; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  async function copyPin() {
    await navigator.clipboard.writeText(reveal.pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <Modal onClose={onClose} className="flex max-w-[440px] flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <h3 className="font-heading text-xl font-bold">Staff PIN</h3>
        <ModalCloseButton onClose={onClose} />
      </div>
      <div className="p-6 text-center">
        <p className="mb-1 text-sm text-muted-foreground">New PIN for</p>
        <p className="mb-4 font-semibold">{reveal.email}</p>
        <div className="mb-4 flex items-center justify-center gap-3">
          {reveal.pin.split('').map((d, i) => (
            <span key={i} className="flex size-11 items-center justify-center rounded-md border border-border bg-secondary/30 text-xl font-bold">
              {d}
            </span>
          ))}
        </div>
        <button
          onClick={copyPin}
          className="mx-auto mb-3 inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? 'Copied' : 'Copy PIN'}
        </button>
        <p className="text-[12.5px] leading-relaxed text-muted-foreground">
          {reveal.emailSent
            ? 'The invite email with this PIN has been sent.'
            : 'Share this PIN with the tutor securely. It is shown only once.'}
        </p>
      </div>
    </Modal>
  );
}
