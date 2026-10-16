'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ChevronDown,
  FileText,
  GraduationCap,
  Laptop,
  MousePointerClick,
  PenLine,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

export interface ServiceStackItem {
  slug: string;
  path: string;
  navLabel: string;
  metaDescription: string;
  topics: string[];
}

const ICONS: Record<string, LucideIcon> = {
  'sat-prep-honolulu': TrendingUp,
  'math-tutoring-honolulu': Calculator,
  'ssat-prep-hawaii': FileText,
  'ap-tutoring-honolulu': Target,
  'college-essay-help-honolulu': PenLine,
  'online-tutoring-hawaii': Laptop,
  'private-school-entrance-prep-hawaii': GraduationCap,
};

const ACCENTS = ['#2a476f', '#0e7490', '#7c3aed', '#b45309', '#0f766e', '#1d4ed8', '#be123c'];

const CARD_W = 220;
const CARD_H = 250;
const COLS = 4;
const GAP = 22;

export function ServiceStack({ items }: { items: ServiceStackItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const n = items.length;
  const rows = Math.ceil(n / COLS);

  const gridW = COLS * CARD_W + (COLS - 1) * GAP;
  const gridH = rows * CARD_H + (rows - 1) * GAP;

  const collapse = useCallback(() => setExpanded(false), []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') collapse();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expanded, collapse]);

  return (
    <div
      onClick={() => {
        if (expanded) collapse();
      }}
    >
      <div
        className={`flex items-center justify-center overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          expanded
            ? 'h-[180px] sm:h-[264px] md:h-[380px] lg:h-[524px]'
            : 'h-[150px] sm:h-[215px] md:h-[295px] lg:h-[432px]'
        }`}
      >
        <div
          className={`origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            expanded
              ? 'scale-[0.34] sm:scale-[0.5] md:scale-[0.72] lg:scale-100'
              : 'scale-[0.5] sm:scale-[0.72] md:scale-100 lg:scale-[1.45]'
          }`}
        >
          <div
            className="relative transition-[height,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: expanded ? gridW : CARD_W + 60,
              height: expanded ? gridH : CARD_H + 40,
            }}
          >
            {items.map((item, index) => {
              const Icon = ICONS[item.slug] ?? Target;
              const accent = ACCENTS[index % ACCENTS.length];

              const row = Math.floor(index / COLS);
              const col = index % COLS;
              const countInRow = Math.min(COLS, n - row * COLS);
              const rowWidth = countInRow * CARD_W + (countInRow - 1) * GAP;
              const targetX = col * (CARD_W + GAP) - rowWidth / 2 + CARD_W / 2;
              const targetY = row * (CARD_H + GAP) - gridH / 2 + CARD_H / 2;

              const mid = (n - 1) / 2;
              const spread = index - mid;

              const transform = expanded
                ? `translate(-50%, -50%) translate3d(${targetX}px, ${targetY}px, 0) rotate(0deg) scale(1)`
                : `translate(-50%, -50%) translate3d(${spread * 9}px, ${
                    spread * -6
                  }px, 0) rotate(${spread * 1.4}deg) scale(${1 - Math.abs(spread) * 0.012})`;

              return (
                <Link
                  key={item.slug}
                  href={item.path}
                  aria-expanded={expanded}
                  onClick={(event) => {
                    if (!expanded) {
                      event.preventDefault();
                      setExpanded(true);
                    } else {
                      event.stopPropagation();
                    }
                  }}
                  className="absolute left-1/2 top-1/2 block cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    transform,
                    zIndex: expanded ? 200 : 100 - index,
                    transitionProperty: 'transform',
                  }}
                >
                  <div className="flex h-full flex-col">
                    <div
                      className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${accent}1a`, color: accent }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1.5 text-base font-heading font-bold leading-tight text-foreground">
                      {item.navLabel}
                    </h3>
                    <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {item.metaDescription}
                    </p>
                    <span
                      className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold"
                      style={{ color: accent }}
                    >
                      View service
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-1 text-center">
        {expanded ? (
          <button
            type="button"
            onClick={collapse}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <ChevronDown className="h-4 w-4 rotate-180" />
            Collapse services
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <MousePointerClick className="h-4 w-4" />
            Click the stack to see all {n} services
          </button>
        )}
      </div>
    </div>
  );
}
