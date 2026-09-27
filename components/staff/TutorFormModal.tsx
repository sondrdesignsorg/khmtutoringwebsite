'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';
import { Check, ImagePlus, Loader2, Plus, X } from 'lucide-react';
import type { Tutor, TutorDraft } from '@/lib/staff/types';
import { Modal, ModalCloseButton } from './Modal';
import { StaffSelect } from './StaffSelect';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'SAT/SSAT', 'Math', 'English', 'AP Subjects', 'Chemistry', 'Biology', 'College Counseling', 'Science', 'Other',
];

export const BLANK_TUTOR: TutorDraft = {
  name: '',
  subjects: [],
  tagline: '',
  imageUrl: '',
  bio: '',
  achievements: [],
  experience: '',
  certifications: '',
  funFact: '',
  grades: '',
  category: 'Math',
  sortOrder: 0,
  published: true,
};

type FormValue = TutorDraft | Tutor;

export function TutorFormModal({
  initial,
  isNew,
  onSave,
  onClose,
}: {
  initial: FormValue;
  isNew: boolean;
  onSave: (value: TutorDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<FormValue>(initial);
  const [subjectsText, setSubjectsText] = useState(initial.subjects.join(', '));
  const [achievementsText, setAchievementsText] = useState(initial.achievements.join('\n'));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const set = (patch: Partial<FormValue>) => setDraft((d) => ({ ...d, ...patch }));

  async function handleImage(file: File) {
    setUploading(true);
    setUploadError('');
    try {
      const blob = await upload(`tutor-images/${Date.now()}-${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/staff/tutors/image',
        contentType: file.type || 'image/jpeg',
      });
      set({ imageUrl: blob.url, imageKey: blob.pathname });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  function save() {
    onSave({
      ...draft,
      name: draft.name.trim(),
      subjects: subjectsText.split(',').map((s) => s.trim()).filter(Boolean),
      achievements: achievementsText.split('\n').map((s) => s.trim()).filter(Boolean),
    });
  }

  return (
    <Modal onClose={onClose} className="flex max-w-[620px] flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <h3 className="font-heading text-2xl font-bold">{isNew ? 'Add Tutor' : 'Edit Tutor'}</h3>
        <ModalCloseButton onClose={onClose} />
      </div>

      <div className="flex flex-col gap-4 overflow-auto p-6">
        <div className="flex items-start gap-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary/40">
            {draft.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.imageUrl} alt="" className="size-full object-cover object-top" />
            ) : (
              <span className="flex size-full items-center justify-center text-muted-foreground">
                <ImagePlus className="size-6" />
              </span>
            )}
            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                <Loader2 className="size-5 animate-spin" />
              </span>
            )}
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Photo</label>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10">
                <ImagePlus className="size-4" />Upload image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleImage(f); }}
                />
              </label>
              {draft.imageUrl && (
                <button
                  onClick={() => set({ imageUrl: '', imageKey: undefined })}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-primary/10"
                >
                  <X className="size-4" />Remove
                </button>
              )}
            </div>
            <Input
              value={draft.imageUrl}
              onChange={(e) => set({ imageUrl: e.target.value, imageKey: undefined })}
              placeholder="or paste an image URL / path"
              className="mt-2"
            />
            {uploadError && <p className="mt-1 text-xs text-destructive">{uploadError}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" required>
            <Input value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Jordan Lee" />
          </Field>
          <Field label="Category">
            <StaffSelect value={draft.category} onChange={(v) => set({ category: v })} options={CATEGORIES} />
          </Field>
        </div>

        <Field label="Tagline">
          <Input value={draft.tagline} onChange={(e) => set({ tagline: e.target.value })} placeholder="Short headline shown on the card" />
        </Field>

        <Field label="Subjects" hint="Comma-separated">
          <Input value={subjectsText} onChange={(e) => setSubjectsText(e.target.value)} placeholder="Math, Physics, SAT/ACT" />
        </Field>

        <Field label="Bio">
          <Textarea value={draft.bio} onChange={(e) => set({ bio: e.target.value })} rows={3} placeholder="A paragraph about this tutor" />
        </Field>

        <Field label="Achievements" hint="One per line">
          <Textarea value={achievementsText} onChange={(e) => setAchievementsText(e.target.value)} rows={4} placeholder={'Graduated from ...\nTaught ...'} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Experience">
            <Input value={draft.experience} onChange={(e) => set({ experience: e.target.value })} placeholder="e.g. Since 2016" />
          </Field>
          <Field label="Grades">
            <Input value={draft.grades} onChange={(e) => set({ grades: e.target.value })} placeholder="e.g. K-12, College" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Education & Background">
            <Input value={draft.certifications} onChange={(e) => set({ certifications: e.target.value })} placeholder="e.g. Princeton University" />
          </Field>
          <Field label="Fun Fact">
            <Input value={draft.funFact} onChange={(e) => set({ funFact: e.target.value })} placeholder="e.g. Enjoys surfing" />
          </Field>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Published</div>
            <div className="text-xs text-muted-foreground">Show this tutor on the public Educators page</div>
          </div>
          <button
            onClick={() => set({ published: !draft.published })}
            aria-pressed={draft.published}
            className={cn('relative h-6 w-11 rounded-full transition-colors', draft.published ? 'bg-primary' : 'bg-border')}
          >
            <span className={cn('absolute top-0.5 size-5 rounded-full bg-white transition-all', draft.published ? 'left-[22px]' : 'left-0.5')} />
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
        <button onClick={onClose} className="inline-flex h-9 items-center rounded-md px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10">
          Cancel
        </button>
        <button
          onClick={save}
          disabled={!draft.name.trim() || uploading}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isNew ? <Plus className="size-4" /> : <Check className="size-4" />}
          {isNew ? 'Add Tutor' : 'Save Changes'}
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
