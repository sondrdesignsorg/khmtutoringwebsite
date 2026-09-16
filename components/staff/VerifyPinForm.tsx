'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const PIN_LENGTH = 6;

export function VerifyPinForm({ email }: { email: string }) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function setDigit(i: number, value: string) {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = cleaned;
    setDigits(next);
    if (cleaned && i < PIN_LENGTH - 1) inputs.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  async function submit(e: { preventDefault(): void }) {
    e.preventDefault();
    const pin = digits.join('');
    if (pin.length !== PIN_LENGTH) return;

    setLoading(true);
    setError(null);
    const res = await fetch('/api/staff/auth/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    setLoading(false);

    if (res.ok) {
      router.push('/staff/library');
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setDigits(Array(PIN_LENGTH).fill(''));
      inputs.current[0]?.focus();
      setError(body.error ?? 'That PIN was not accepted. Try again.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/40 to-background px-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-7 flex flex-col items-center text-center">
          <Image src="/images/khm-tutoring-logo.png" alt="KHM Tutoring" width={56} height={56} className="mb-3 object-contain" />
          <h1 className="font-heading text-3xl font-bold">Enter Staff PIN</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Signed in as <span className="font-semibold text-foreground">{email}</span>.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-7 shadow-lg">
          <div className="mb-5 flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-primary" />
            Enter the 6-digit PIN Kody or an admin gave you to activate staff access.
          </div>

          <div className="mb-5 flex justify-between gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                autoFocus={i === 0}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH);
                  if (!pasted) return;
                  const next = [...digits];
                  pasted.split('').forEach((ch, k) => { if (k < PIN_LENGTH) next[k] = ch; });
                  setDigits(next);
                  inputs.current[Math.min(pasted.length, PIN_LENGTH - 1)]?.focus();
                }}
                aria-label={`PIN digit ${i + 1}`}
                className={cn(
                  'h-12 w-full rounded-md border border-input bg-card text-center text-lg font-bold outline-none transition-colors focus:border-primary',
                  error && 'border-destructive',
                )}
              />
            ))}
          </div>

          {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading || digits.some((d) => !d)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Verify PIN'}
            {!loading && <KeyRound className="size-[18px]" />}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Lost your PIN? Ask Kody or an admin to reset it for you.
          </p>
        </form>
      </div>
    </div>
  );
}
