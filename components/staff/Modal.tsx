'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Shared modal shell: scrim + centered card. */
export function Modal({
  onClose,
  children,
  className,
  labelledBy,
}: {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[hsl(215_45%_18%/0.55)] p-7 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'max-h-[90vh] w-full overflow-hidden rounded-2xl bg-card shadow-2xl',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      aria-label="Close"
      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary/10"
    >
      <X className="size-4" />
    </button>
  );
}
