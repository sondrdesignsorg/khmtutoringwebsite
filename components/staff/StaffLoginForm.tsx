'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

const GOOGLE_G = (
  <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
  </svg>
);

export function StaffLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') || '/staff/library';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const code = params.get('error');
    if (code === 'not_staff') return 'That Google account is not authorized for the staff portal. Contact Kody if you need access.';
    if (code === 'invalid_link') return 'That sign-in link was invalid or expired.';
    return null;
  });

  function signInWithGoogle() {
    setLoading(true);
    setError(null);
    const url = `/api/staff/auth/google?from=${encodeURIComponent(from)}`;
    router.push(url);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/40 to-background px-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-7 flex flex-col items-center text-center">
          <Image src="/images/khm-tutoring-logo.png" alt="KHM Tutoring" width={56} height={56} className="mb-3 object-contain" />
          <h1 className="font-heading text-3xl font-bold">Staff Portal</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Sign in with Google to access the resource library.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-lg">
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-border bg-background text-[15px] font-semibold text-foreground transition-colors hover:bg-primary/5 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-[18px] animate-spin" />Redirecting to Google…
              </>
            ) : (
              <>
                Continue with Google
                {GOOGLE_G}
              </>
            )}
          </button>

          {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Tutors &amp; staff only. Contact Kody if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
