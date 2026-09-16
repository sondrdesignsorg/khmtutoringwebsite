'use client';

import { CircleCheckBig } from 'lucide-react';

export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-7 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[hsl(215_45%_20%)] px-5 py-3 text-sm font-medium text-white shadow-2xl">
      <CircleCheckBig className="size-[18px] text-accent" />
      {message}
    </div>
  );
}
