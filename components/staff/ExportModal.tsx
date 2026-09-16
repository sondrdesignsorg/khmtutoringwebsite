'use client';

import { ChevronDown, ChevronUp, FileDown, Loader2, X } from 'lucide-react';
import type { Resource } from '@/lib/staff/types';
import { Modal, ModalCloseButton } from './Modal';

export function ExportModal({
  files,
  onReorder,
  onRemove,
  onClose,
  onExport,
  loading = false,
}: {
  files: Resource[];
  onReorder: (index: number, dir: -1 | 1) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
  onExport: () => void;
  loading?: boolean;
}) {
  const totalPages = files.reduce((s, f) => s + f.pages, 0) + 1; // + cover
  return (
    <Modal onClose={onClose} className="flex max-w-[560px] flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-[18px]">
        <div>
          <h3 className="font-heading text-2xl font-bold">Build Packet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {files.length} files · ~{totalPages} pages · cover page included
          </p>
        </div>
        <ModalCloseButton onClose={onClose} />
      </div>

      <div className="flex-1 overflow-auto px-6 py-3">
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <div key={f.id} className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5">
              <span className="flex size-[26px] shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.subject} · {f.pages} pages</div>
              </div>
              <div className="flex gap-0.5">
                <IconBtn label="Move up" disabled={i === 0} onClick={() => onReorder(i, -1)}>
                  <ChevronUp className="size-4" />
                </IconBtn>
                <IconBtn label="Move down" disabled={i === files.length - 1} onClick={() => onReorder(i, 1)}>
                  <ChevronDown className="size-4" />
                </IconBtn>
                <IconBtn label="Remove" onClick={() => onRemove(f.id)}>
                  <X className="size-4" />
                </IconBtn>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
        <button onClick={onClose} className="inline-flex h-9 items-center rounded-md px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10">
          Cancel
        </button>
        <button
          onClick={onExport}
          disabled={loading}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
          {loading ? 'Building PDF…' : 'Export Combined PDF'}
        </button>
      </div>
    </Modal>
  );
}

function IconBtn({
  children, onClick, disabled, label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
