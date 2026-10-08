'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Download, FileDown, Loader2, Mail, Send, X } from 'lucide-react';
import type { Resource, Student } from '@/lib/staff/types';
import { Modal, ModalCloseButton } from './Modal';
import { RecipientPicker, type Recipient } from './RecipientPicker';
import { cn } from '@/lib/utils';

export function ExportModal({
  files,
  students,
  onReorder,
  onRemove,
  onClose,
  onExport,
  loading = false,
  recipientEmail,
}: {
  files: Resource[];
  students: Student[];
  onReorder: (index: number, dir: -1 | 1) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
  onExport: (delivery: 'download' | 'email', recipient?: Recipient) => void;
  loading?: boolean;
  recipientEmail: string;
}) {
  const [delivery, setDelivery] = useState<'download' | 'email' | 'student'>('download');
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const totalPages = files.reduce((s, f) => s + f.pages, 0) + 1; // + cover
  const studentMode = delivery === 'student';
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

      <div className="border-t border-border px-6 py-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">Deliver packet</p>
        <div className="grid grid-cols-3 gap-2">
          <DeliveryOption
            active={delivery === 'download'}
            onClick={() => { setDelivery('download'); setRecipient(null); }}
            icon={<Download className="size-4" />}
            title="Download"
            subtitle="Save to this device"
          />
          <DeliveryOption
            active={delivery === 'email'}
            onClick={() => { setDelivery('email'); setRecipient(null); }}
            icon={<Mail className="size-4" />}
            title="Email to me"
            subtitle={recipientEmail}
          />
          <DeliveryOption
            active={delivery === 'student'}
            onClick={() => { setDelivery('student'); setRecipient(null); }}
            icon={<Send className="size-4" />}
            title="Send to student"
            subtitle="Pick from roster"
          />
        </div>
        {studentMode && (
          <div className="mt-3 rounded-lg border border-border bg-secondary/20 p-3">
            <RecipientPicker students={students} onChange={setRecipient} />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
        <button onClick={onClose} className="inline-flex h-9 items-center rounded-md px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10">
          Cancel
        </button>
        <button
          onClick={() => onExport(studentMode ? 'email' : delivery, studentMode ? recipient ?? undefined : undefined)}
          disabled={loading || (studentMode && !recipient)}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : studentMode ? <Send className="size-4" /> : delivery === 'email' ? <Mail className="size-4" /> : <FileDown className="size-4" />}
          {loading
            ? 'Building PDF…'
            : studentMode
              ? 'Send to Student'
              : delivery === 'email'
                ? 'Email Combined PDF'
                : 'Export Combined PDF'}
        </button>
      </div>
    </Modal>
  );
}

function DeliveryOption({
  active, onClick, icon, title, subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors',
        active ? 'border-primary bg-primary/[0.06]' : 'border-border bg-card hover:border-primary/40',
      )}
    >
      <span className={cn('mt-0.5 shrink-0', active ? 'text-primary' : 'text-muted-foreground')}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
      </span>
    </button>
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
