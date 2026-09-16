'use client';

import { Trash2 } from 'lucide-react';
import type { Resource } from '@/lib/staff/types';
import { Modal } from './Modal';

export function ConfirmDelete({
  file, onCancel, onConfirm,
}: {
  file: Resource;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal onClose={onCancel} className="max-w-[400px] p-7 text-center">
      <span className="mb-4 inline-flex size-[52px] items-center justify-center rounded-full bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_70%_45%)]">
        <Trash2 className="size-6" />
      </span>
      <h3 className="mb-2 font-heading text-xl font-bold">Remove this resource?</h3>
      <p className="mb-[22px] text-sm text-muted-foreground">
        &ldquo;{file.title}&rdquo; will be removed from the library. This can&rsquo;t be undone.
      </p>
      <div className="flex justify-center gap-3">
        <button onClick={onCancel} className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-[hsl(0_70%_45%)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Trash2 className="size-4" />Remove
        </button>
      </div>
    </Modal>
  );
}
