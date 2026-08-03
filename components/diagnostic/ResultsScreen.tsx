'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { TopicResult } from '@/lib/diagnostic/questions';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  layout: 'A' | 'B';
  studentName: string;
  email: string;
  score: number;
  percentile: number;
  testLength: number;
  tier: { label: string; desc: string };
  topics: TopicResult[];
  emailed: boolean;
  submitting: boolean;
  error: string;
  bookingHref: string;
  onRestart: () => void;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export function ResultsScreen({
  layout,
  studentName,
  email,
  score,
  percentile,
  testLength,
  tier,
  topics,
  emailed,
  submitting,
  error,
  bookingHref,
  onRestart,
}: Props) {
  const displayName = studentName || 'Your student';
  const narrative = `${displayName} ${tier.desc}`;

  const emailStatus = submitting ? (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-semibold">
      <Loader2 className="w-4 h-4 animate-spin" />
      Saving your results…
    </div>
  ) : error ? (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-semibold">
      {error}
    </div>
  ) : emailed ? (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-semibold">
      <CheckCircle2 className="w-4 h-4" />✓ Results emailed to {email}
    </div>
  ) : (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-semibold">
      Results saved. Email delivery pending.
    </div>
  );

  if (layout === 'B') {
    return (
      <div className="w-full bg-background">
        <div className="grid md:grid-cols-[1fr_1.2fr] min-h-[600px]">
          <div className="bg-primary text-primary-foreground p-10 md:p-14 flex flex-col justify-center gap-5">
            <div className="text-sm font-semibold text-white/85 uppercase tracking-wider">
              Diagnostic Results
            </div>
            <div className="font-heading font-bold text-7xl leading-none">{score}%</div>
            <div className="text-base font-semibold text-white/80 -mt-1">{ordinal(percentile)} Percentile</div>
            <div className="font-bold text-2xl">
              {displayName}&apos;s Results: {tier.label}
            </div>
            <p className="text-base text-white/90 leading-relaxed max-w-md">{narrative}</p>
            <div className="w-fit">{emailStatus}</div>
            <Link
              href={bookingHref}
              className="h-14 px-7 rounded-full bg-white text-primary font-bold text-lg shadow-lg w-fit inline-flex items-center hover:bg-white/95 transition-colors"
            >
              Book Free Consultation
            </Link>
            <button
              type="button"
              onClick={onRestart}
              className="text-white/80 hover:text-white text-sm underline w-fit"
            >
              Take another test
            </button>
            {testLength < 100 && (
              <p className="text-xs text-white/60 max-w-xs leading-relaxed">
                Tip: A 100-question test gives the most accurate picture of your child&apos;s level compared with this {testLength}-question diagnostic.
              </p>
            )}
          </div>
          <div className="bg-card p-10 md:p-14 flex flex-col gap-5 justify-center">
            <div className="font-bold text-xl text-foreground">Topic Breakdown</div>
            <TopicList topics={topics} />
          </div>
        </div>
      </div>
    );
  }

  // Layout A
  return (
    <div className="w-full bg-background">
      <div className="max-w-[640px] mx-auto px-6 md:px-8 py-14 flex flex-col items-center gap-6 relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-16 w-[280px] h-[280px] rounded-full z-0"
          style={{ background: 'hsl(215 45% 30% / 0.06)' }}
        />
        <div className="w-36 h-36 rounded-full bg-primary flex flex-col items-center justify-center text-primary-foreground shadow-lg relative z-[1]">
          <div className="font-bold text-4xl leading-none">{score}%</div>
          <div className="text-xs font-semibold text-white/75 mt-1">{ordinal(percentile)} Percentile</div>
        </div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center relative z-[1]">
          {displayName}&apos;s Results: {tier.label}
        </h1>
        <p className="text-base text-muted-foreground text-center leading-relaxed max-w-lg relative z-[1]">
          {narrative}
        </p>
        <div className="relative z-[1]">{emailStatus}</div>

        <div className="w-full bg-card border border-border rounded-3xl p-6 md:p-7 shadow-sm flex flex-col gap-4 relative z-[1]">
          <div className="font-bold text-lg text-foreground">Topic Breakdown</div>
          <TopicList topics={topics} />
        </div>

        <Link
          href={bookingHref}
          className="h-14 px-9 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-md mt-2 relative z-[1] inline-flex items-center hover:bg-primary/90 transition-colors"
        >
          Book Free Consultation
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="bg-transparent border-0 text-muted-foreground text-sm underline mt-1 relative z-[1] hover:text-foreground"
        >
          Take another test
        </button>
        {testLength < 100 && (
          <p className="text-xs text-muted-foreground text-center max-w-sm leading-relaxed relative z-[1]">
            Tip: A 100-question test gives the most accurate picture of your child&apos;s level compared with this {testLength}-question diagnostic.
          </p>
        )}
      </div>
    </div>
  );
}

function TopicList({ topics }: { topics: TopicResult[] }) {
  return (
    <>
      {topics.map((t) => (
        <div key={t.topic}>
          <div className="flex justify-between mb-1.5 text-sm">
            <span className="font-semibold text-foreground">{t.topic}</span>
            <span
              className={cn(
                'font-semibold',
                t.strong ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground',
              )}
            >
              {t.correct}/{t.total} — {t.strong ? 'Strong' : 'Needs Work'}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-[width]',
                t.strong ? 'bg-green-500' : 'bg-accent',
              )}
              style={{ width: `${t.pct}%` }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
