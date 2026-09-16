'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, ShieldAlert } from 'lucide-react';

export function SignOutNotice({ disabled }: { disabled?: boolean }) {
  const router = useRouter();

  async function signOut() {
    await fetch('/api/staff/auth', { method: 'DELETE' });
    router.push('/staff/login');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/40 to-background px-6">
      <div className="w-full max-w-[420px] text-center">
        <Image src="/images/khm-tutoring-logo.png" alt="KHM Tutoring" width={56} height={56} className="mx-auto mb-4 object-contain" />
        <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_70%_45%)]">
          <ShieldAlert className="size-6" />
        </span>
        <h1 className="font-heading text-2xl font-bold">
          {disabled ? 'Staff access disabled' : 'Not authorized'}
        </h1>
        <p className="mx-auto mt-2 max-w-[320px] text-sm text-muted-foreground">
          {disabled
            ? 'This staff account has been disabled. Contact Kody if you think this is a mistake.'
            : 'This Google account is not registered for the KHM staff portal. Contact Kody if you need access.'}
        </p>
        <button
          onClick={signOut}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10"
        >
          <LogOut className="size-4" />Sign out
        </button>
      </div>
    </div>
  );
}
