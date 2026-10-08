'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GraduationCap, Mail, Pencil, Phone, Plus, Search, Trash2, UserRound } from 'lucide-react';
import type { Student, StudentDraft } from '@/lib/staff/types';
import type { StaffSession } from '@/lib/staff/auth';
import { PortalChrome } from './PortalChrome';
import { StudentFormModal, BLANK_STUDENT } from './StudentFormModal';
import { Modal } from './Modal';
import { Toast } from './Toast';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { matchesAllTerms } from '@/lib/search';

export function StudentsAdminClient({
  initialStudents,
  session,
}: {
  initialStudents: Student[];
  session: StaffSession;
}) {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [confirming, setConfirming] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function flash(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  }

  const visible = students.filter((s) =>
    matchesAllTerms([s.name, s.email, s.grade, s.parentName, s.notes], query),
  );

  async function addStudent(value: StudentDraft) {
    setSaving(true);
    try {
      const res = await fetch('/api/staff/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });
      const body = await res.json() as { student?: Student; error?: string };
      if (!res.ok || !body.student) throw new Error(body.error || 'Could not add student');
      setStudents((s) => [...s, body.student!].sort((a, b) => a.name.localeCompare(b.name)));
      setAdding(false);
      flash(`${body.student.name} added`);
      router.refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Could not add student');
    } finally {
      setSaving(false);
    }
  }

  async function saveStudent(value: StudentDraft) {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/staff/students/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });
      const body = await res.json() as { student?: Student; error?: string };
      if (!res.ok || !body.student) throw new Error(body.error || 'Could not save student');
      setStudents((s) => s.map((x) => (x.id === editing.id ? body.student! : x)));
      setEditing(null);
      flash('Changes saved');
      router.refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Could not save student');
    } finally {
      setSaving(false);
    }
  }

  async function removeStudent(student: Student) {
    setSaving(true);
    try {
      const res = await fetch(`/api/staff/students/${student.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not remove student');
      setStudents((s) => s.filter((x) => x.id !== student.id));
      setConfirming(null);
      flash(`${student.name} removed`);
      router.refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Could not remove student');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[70vh] bg-background">
      <PortalChrome
        session={session}
        crumbs={[{ label: 'Resource Library', href: '/staff/library' }, { label: 'Students' }]}
        showAdminLink
        showStaffLink
        showStudentsLink
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-24 pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mb-1.5 flex items-center gap-2.5 font-heading text-4xl font-bold">
              <GraduationCap className="size-8 text-primary" />Students
            </h1>
            <p className="text-base text-muted-foreground">
              Save students once, then send them worksheets and packets from the library. {students.length} on the roster.
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
              <Plus className="size-4" />Add Student
            </button>
          </div>
        </div>

        <div className="mb-5 max-w-[340px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students..." className="h-10 pl-9" />
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-xl border border-border bg-card py-16 text-center text-muted-foreground">
            {students.length === 0 ? 'No students yet. Click "Add Student" to create the first record.' : 'No students match your search.'}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full border-collapse text-[13.5px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.05em] text-muted-foreground">
                  <th className="border-b border-border px-4 py-3 font-semibold">Student</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Grade</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Contact</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Notes</th>
                  <th className="border-b border-border px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((student) => (
                  <tr key={student.id}>
                    <td className="border-b border-border/50 px-4 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <UserRound className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{student.name}</div>
                          {student.parentName && <div className="truncate text-xs text-muted-foreground">Parent: {student.parentName}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-border/50 px-4 py-3 align-middle text-muted-foreground">{student.grade || '—'}</td>
                    <td className="border-b border-border/50 px-4 py-3 align-middle">
                      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                        {student.email && (
                          <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5" />{student.email}</span>
                        )}
                        {student.phone && (
                          <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" />{student.phone}</span>
                        )}
                        {!student.email && !student.phone && '—'}
                      </div>
                    </td>
                    <td className="max-w-[240px] border-b border-border/50 px-4 py-3 align-middle text-muted-foreground">
                      <span className="line-clamp-1">{student.notes || '—'}</span>
                    </td>
                    <td className="border-b border-border/50 px-4 py-3 text-right align-middle">
                      <div className="inline-flex gap-1">
                        <RowBtn label="Edit" onClick={() => setEditing(student)}><Pencil className="size-[15px]" /></RowBtn>
                        <RowBtn label="Delete" danger onClick={() => setConfirming(student)}><Trash2 className="size-[15px]" /></RowBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {adding && <StudentFormModal initial={BLANK_STUDENT} isNew onSave={(v) => void addStudent(v)} onClose={() => setAdding(false)} />}
      {editing && <StudentFormModal initial={editing} isNew={false} onSave={(v) => void saveStudent(v)} onClose={() => setEditing(null)} />}
      {confirming && (
        <Modal onClose={() => setConfirming(null)} className="max-w-[400px] p-7 text-center">
          <span className="mb-4 inline-flex size-[52px] items-center justify-center rounded-full bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_70%_45%)]">
            <Trash2 className="size-6" />
          </span>
          <h3 className="mb-2 font-heading text-xl font-bold">Remove this student?</h3>
          <p className="mb-[22px] text-sm text-muted-foreground">
            &ldquo;{confirming.name}&rdquo; will be removed from the roster. This can&rsquo;t be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setConfirming(null)} className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10">
              Cancel
            </button>
            <button
              onClick={() => void removeStudent(confirming)}
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

function RowBtn({ children, onClick, danger, label }: { children: React.ReactNode; onClick: () => void; danger?: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'flex size-8 items-center justify-center rounded-lg border border-border bg-card transition-colors',
        danger ? 'text-[hsl(0_70%_45%)] hover:bg-[hsl(0_84%_60%/0.1)]' : 'text-primary hover:bg-primary/[0.08]',
      )}
    >
      {children}
    </button>
  );
}
