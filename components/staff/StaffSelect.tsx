'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Native styled select matching the brand input. */
export function StaffSelect({
  value, onChange, options, className, flag,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[] | string[];
  className?: string;
  flag?: boolean;
}) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-9 w-full cursor-pointer appearance-none rounded-md border bg-card pl-3 pr-9 text-sm text-foreground outline-none transition-[box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          flag ? 'border-destructive/40 bg-destructive/[0.06]' : 'border-input',
        )}
      >
        {opts.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
