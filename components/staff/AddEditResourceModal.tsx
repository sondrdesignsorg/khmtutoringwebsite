'use client';

import { useState } from 'react';
import { Check, ClipboardCheck, ClipboardList, FileText, Plus } from 'lucide-react';
import { GRADES, SUBJECTS } from '@/lib/staff/resources';
import type { Difficulty, Resource, ResourceDraft, ResourceType } from '@/lib/staff/types';
import { Modal, ModalCloseButton } from './Modal';
import { StaffSelect } from './StaffSelect';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const BLANK_DRAFT: ResourceDraft = {
  title: '', type: 'worksheet', subject: 'Algebra 1', grade: '9th', topic: '', pages: 2, difficulty: 'Intermediate',
};

type FormValue = ResourceDraft | Resource;

export function AddEditResourceModal({
  initial,
  isNew,
  onSave,
  onClose,
}: {
  initial: FormValue;
  isNew: boolean;
  onSave: (value: FormValue) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<FormValue>(initial);
  const set = (patch: Partial<FormValue>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <Modal onClose={onClose} className="flex max-w-[480px] flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <h3 className="font-heading text-2xl font-bold">{isNew ? 'Add Resource' : 'Edit Resource'}</h3>
        <ModalCloseButton onClose={onClose} />
      </div>

      <div className="flex flex-col gap-4 overflow-auto p-6">
        <Field label="Title" required>
          <Input
            value={draft.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="e.g. Solving Two-Step Equations"
          />
        </Field>

        <Field label="Type">
          <div className="grid grid-cols-3 gap-2">
            {([['worksheet', FileText, 'Worksheet'], ['quiz', ClipboardList, 'Quiz'], ['test', ClipboardCheck, 'Test']] as const).map(
              ([id, IconC, label]) => {
                const active = draft.type === id;
                return (
                  <button
                    key={id}
                    onClick={() => set({ type: id as ResourceType })}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-md border-[1.5px] p-2.5 text-[13.5px] font-semibold transition-colors',
                      active ? 'border-primary bg-primary/[0.08] text-primary' : 'border-border bg-card text-muted-foreground',
                    )}
                  >
                    <IconC className="size-4" />{label}
                  </button>
                );
              },
            )}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Subject">
            <StaffSelect value={draft.subject} onChange={(v) => set({ subject: v })} options={SUBJECTS} />
          </Field>
          <Field label="Grade">
            <StaffSelect value={draft.grade} onChange={(v) => set({ grade: v })} options={GRADES} />
          </Field>
        </div>

        <Field label="Topic">
          <Input value={draft.topic} onChange={(e) => set({ topic: e.target.value })} placeholder="e.g. Linear equations" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Difficulty">
            <StaffSelect
              value={draft.difficulty}
              onChange={(v) => set({ difficulty: v as Difficulty })}
              options={['Beginner', 'Intermediate', 'Advanced']}
            />
          </Field>
          <Field label="Pages">
            <Input
              type="number"
              min={1}
              value={draft.pages}
              onChange={(e) => set({ pages: Math.max(1, parseInt(e.target.value) || 1) })}
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
        <button onClick={onClose} className="inline-flex h-9 items-center rounded-md px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10">
          Cancel
        </button>
        <button
          onClick={() => onSave(draft)}
          disabled={!draft.title.trim()}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isNew ? <Plus className="size-4" /> : <Check className="size-4" />}
          {isNew ? 'Add to Library' : 'Save Changes'}
        </button>
      </div>
    </Modal>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}
