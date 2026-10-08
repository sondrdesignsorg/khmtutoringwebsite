'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import type { Student, StudentDraft } from '@/lib/staff/types';
import { GRADES } from '@/lib/staff/resources';
import { Modal, ModalCloseButton } from './Modal';
import { StaffSelect } from './StaffSelect';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const BLANK_STUDENT: StudentDraft = {
  name: '', email: '', grade: '', parentName: '', phone: '', notes: '',
};

type FormValue = StudentDraft | Student;

export function StudentFormModal({
  initial,
  isNew,
  onSave,
  onClose,
}: {
  initial: FormValue;
  isNew: boolean;
  onSave: (value: StudentDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<FormValue>(initial);
  const set = (patch: Partial<FormValue>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <Modal onClose={onClose} className="flex max-w-[520px] flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <h3 className="font-heading text-2xl font-bold">{isNew ? 'Add Student' : 'Edit Student'}</h3>
        <ModalCloseButton onClose={onClose} />
      </div>

      <div className="flex flex-col gap-4 overflow-auto p-6">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" required>
            <Input value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Alex Chen" />
          </Field>
          <Field label="Grade">
            <StaffSelect
              value={draft.grade}
              onChange={(v) => set({ grade: v })}
              options={[{ value: '', label: '—' }, ...GRADES.map((g) => ({ value: g, label: g }))]}
            />
          </Field>
        </div>

        <Field label="Email" hint="Where worksheets are sent">
          <Input
            type="email"
            value={draft.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder="student@example.com"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Parent / Guardian">
            <Input value={draft.parentName} onChange={(e) => set({ parentName: e.target.value })} placeholder="e.g. Jamie Chen" />
          </Field>
          <Field label="Phone">
            <Input value={draft.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="(555) 123-4567" />
          </Field>
        </div>

        <Field label="Notes">
          <Textarea value={draft.notes} onChange={(e) => set({ notes: e.target.value })} rows={3} placeholder="Anything helpful — goals, class, schedule" />
        </Field>
      </div>

      <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
        <button onClick={onClose} className="inline-flex h-9 items-center rounded-md px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10">
          Cancel
        </button>
        <button
          onClick={() => onSave({ ...draft, name: draft.name.trim() })}
          disabled={!draft.name.trim()}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isNew ? <Plus className="size-4" /> : <Check className="size-4" />}
          {isNew ? 'Add Student' : 'Save Changes'}
        </button>
      </div>
    </Modal>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline gap-2 text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive">*</span>}
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
