'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Pencil, Plus, Trash2, UserRound } from 'lucide-react';
import type { Tutor, TutorDraft } from '@/lib/staff/types';
import type { StaffSession } from '@/lib/staff/auth';
import { PortalChrome } from './PortalChrome';
import { TutorFormModal, BLANK_TUTOR } from './TutorFormModal';
import { Modal } from './Modal';
import { Toast } from './Toast';
import { cn } from '@/lib/utils';

export function TutorsAdminClient({
  initialTutors,
  session,
}: {
  initialTutors: Tutor[];
  session: StaffSession;
}) {
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>(initialTutors);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Tutor | null>(null);
  const [confirming, setConfirming] = useState<Tutor | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function flash(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  }

  async function addTutor(value: TutorDraft) {
    setSaving(true);
    try {
      const res = await fetch('/api/staff/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });
      const body = await res.json() as { tutor?: Tutor; error?: string };
      if (!res.ok || !body.tutor) throw new Error(body.error || 'Could not add tutor');
      setTutors((t) => [...t, body.tutor!]);
      setAdding(false);
      flash(`${body.tutor.name} added`);
      router.refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Could not add tutor');
    } finally {
      setSaving(false);
    }
  }

  async function saveTutor(value: TutorDraft) {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/staff/tutors/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });
      const body = await res.json() as { tutor?: Tutor; error?: string };
      if (!res.ok || !body.tutor) throw new Error(body.error || 'Could not save tutor');
      setTutors((t) => t.map((x) => (x.id === editing.id ? body.tutor! : x)));
      setEditing(null);
      flash('Changes saved');
      router.refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Could not save tutor');
    } finally {
      setSaving(false);
    }
  }

  async function removeTutor(tutor: Tutor) {
    setSaving(true);
    try {
      const res = await fetch(`/api/staff/tutors/${tutor.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not remove tutor');
      setTutors((t) => t.filter((x) => x.id !== tutor.id));
      setConfirming(null);
      flash(`${tutor.name} removed`);
      router.refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Could not remove tutor');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(tutor: Tutor) {
    const published = !tutor.published;
    setTutors((t) => t.map((x) => (x.id === tutor.id ? { ...x, published } : x)));
    try {
      const res = await fetch(`/api/staff/tutors/${tutor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setTutors((t) => t.map((x) => (x.id === tutor.id ? { ...x, published: !published } : x)));
      flash('Could not update visibility');
    }
  }

  const publishedCount = tutors.filter((t) => t.published).length;

  return (
    <div className="min-h-[70vh] bg-background">
      <PortalChrome
        session={session}
        crumbs={[{ label: 'Resource Library', href: '/staff/library' }, { label: 'Tutors' }]}
        showAdminLink
        showStaffLink
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-24 pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mb-1.5 flex items-center gap-2.5 font-heading text-4xl font-bold">
              <UserRound className="size-8 text-primary" />Tutors
            </h1>
            <p className="text-base text-muted-foreground">
              Add, edit, or remove the tutors shown on the public Educators page. {publishedCount} published of {tutors.length}.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/staff/library')}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10"
            >
              <ArrowLeft className="size-4" />Back to Library
            </button>
            <button
              onClick={() => setAdding(true)}
              disabled={saving}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              <Plus className="size-4" />Add Tutor
            </button>
          </div>
        </div>

        {tutors.length === 0 ? (
          <div className="rounded-xl border border-border bg-card py-16 text-center text-muted-foreground">
            No tutors yet. Click &ldquo;Add Tutor&rdquo; to create the first profile.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary/40">
                  {tutor.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={tutor.imageUrl} alt="" className="size-full object-cover object-top" />
                  ) : (
                    <span className="flex size-full items-center justify-center text-muted-foreground">
                      <UserRound className="size-6" />
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-heading text-lg font-bold">{tutor.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{tutor.subjects.join(' • ')}</div>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                        tutor.published ? 'bg-primary/10 text-primary' : 'bg-border text-muted-foreground',
                      )}
                    >
                      {tutor.published ? 'Live' : 'Hidden'}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs italic text-muted-foreground">{tutor.tagline}</p>
                  <div className="mt-auto flex items-center gap-1 pt-2">
                    <IconBtn label={tutor.published ? 'Hide from site' : 'Show on site'} onClick={() => void togglePublished(tutor)}>
                      {tutor.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </IconBtn>
                    <IconBtn label="Edit" onClick={() => setEditing(tutor)}>
                      <Pencil className="size-4" />
                    </IconBtn>
                    <IconBtn label="Delete" danger onClick={() => setConfirming(tutor)}>
                      <Trash2 className="size-4" />
                    </IconBtn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {adding && <TutorFormModal initial={BLANK_TUTOR} isNew onSave={(v) => void addTutor(v)} onClose={() => setAdding(false)} />}
      {editing && <TutorFormModal initial={editing} isNew={false} onSave={(v) => void saveTutor(v)} onClose={() => setEditing(null)} />}
      {confirming && (
        <Modal onClose={() => setConfirming(null)} className="max-w-[400px] p-7 text-center">
          <span className="mb-4 inline-flex size-[52px] items-center justify-center rounded-full bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_70%_45%)]">
            <Trash2 className="size-6" />
          </span>
          <h3 className="mb-2 font-heading text-xl font-bold">Remove this tutor?</h3>
          <p className="mb-[22px] text-sm text-muted-foreground">
            &ldquo;{confirming.name}&rdquo; will be removed from the Educators page. This can&rsquo;t be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setConfirming(null)} className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10">
              Cancel
            </button>
            <button
              onClick={() => void removeTutor(confirming)}
              disabled={saving}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-[hsl(0_70%_45%)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <Trash2 className="size-4" />Remove
            </button>
          </div>
        </Modal>
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function IconBtn({
  children, onClick, disabled, label, danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors disabled:pointer-events-none disabled:opacity-30',
        danger ? 'hover:bg-[hsl(0_84%_60%/0.12)] hover:text-[hsl(0_70%_45%)]' : 'hover:bg-primary/10',
      )}
    >
      {children}
    </button>
  );
}
