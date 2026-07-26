'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight, Lock, LogOut, Settings } from 'lucide-react';
import type { StaffSession } from '@/lib/staff/auth';
import { cn } from '@/lib/utils';

/** Internal navy context bar shown atop every staff screen. */
export function PortalChrome({
  session,
  crumbs,
  showAdminLink,
  showLeadsLink,
}: {
  session: StaffSession;
  crumbs: { label: string; href?: string }[];
  showAdminLink?: boolean;
  showLeadsLink?: boolean;
}) {
  const router = useRouter();
  const initial = session.name.trim().charAt(0).toUpperCase();

  async function signOut() {
    await fetch('/api/staff/auth', { method: 'DELETE' });
    router.push('/staff/login');
    router.refresh();
  }

  return (
    <div className="bg-primary text-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-3">
          <Lock className="size-4 text-white/70" />
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-3">
              {i > 0 && <ChevronRight className="size-3.5 text-white/40" />}
              {c.href ? (
                <button onClick={() => router.push(c.href!)} className="text-sm text-white/85 transition-colors hover:text-white">
                  {c.label}
                </button>
              ) : (
                <span className={cn('text-sm', i === crumbs.length - 1 ? 'font-semibold' : 'text-white/85')}>{c.label}</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          {session.role === 'admin' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-[3px] text-[11px] font-bold text-[hsl(215_45%_20%)]">
              <Settings className="size-3" />ADMIN
            </span>
          )}
          {showLeadsLink && session.role === 'admin' && (
            <button
              onClick={() => router.push('/staff/diagnostic-leads')}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Leads
            </button>
          )}
          {showAdminLink && session.role === 'admin' && (
            <button
              onClick={() => router.push('/staff/admin')}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              <Settings className="size-3.5" />Admin
            </button>
          )}
          <span className="text-sm text-white/85">{session.name}</span>
          <div className="flex size-[30px] items-center justify-center rounded-full bg-accent text-[13px] font-bold text-[hsl(215_45%_20%)]">
            {initial}
          </div>
          <button onClick={signOut} aria-label="Sign out" title="Sign out" className="flex size-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
