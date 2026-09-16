'use client';

import { useState } from 'react';
import {
  ArrowLeft, BookOpen, ClipboardCheck, ClipboardList, FileText, FolderUp, Pencil, Plus, Search,
  Sparkles, Trash2, UploadCloud,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Resource, ResourceDraft, ResourceType } from '@/lib/staff/types';
import type { StaffSession } from '@/lib/staff/auth';
import { subjectArea, fmtDate, TYPE_LABEL } from '@/lib/staff/resources';
import { PortalChrome } from './PortalChrome';
import { AddEditResourceModal, BLANK_DRAFT } from './AddEditResourceModal';
import { ConfirmDelete } from './ConfirmDelete';
import { BulkUploadModal } from './BulkUploadModal';
import { Toast } from './Toast';
import { Input } from '@/components/ui/input';
import { AREA_CHIP, DIFFICULTY_CHIP } from './badges';
import { cn } from '@/lib/utils';

export function AdminClient({
  initialResources,
  session,
}: {
  initialResources: Resource[];
  session: StaffSession;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<Resource[]>(initialResources);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ResourceType>('all');
  const [editing, setEditing] = useState<Resource | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirming, setConfirming] = useState<Resource | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3200); };

  async function addFile(draft: ResourceDraft) {
    setSaving(true);
    try {
      const body = await jsonFetch<{ resource: Resource }>('/api/staff/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      setFiles((s) => [body.resource, ...s]);
      setAdding(false);
      flash(`"${body.resource.title}" added to the library`);
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Unable to add resource');
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit(updated: Resource) {
    setSaving(true);
    try {
      const body = await jsonFetch<{ resource: Resource }>(`/api/staff/resources/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setFiles((s) => s.map((f) => (f.id === body.resource.id ? body.resource : f)));
      setEditing(null);
      flash(`"${body.resource.title}" updated`);
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Unable to update resource');
    } finally {
      setSaving(false);
    }
  }

  async function deleteFile(f: Resource) {
    setSaving(true);
    try {
      await jsonFetch(`/api/staff/resources/${f.id}`, { method: 'DELETE' });
      setFiles((s) => s.filter((x) => x.id !== f.id));
      setConfirming(null);
      flash(`"${f.title}" removed`);
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Unable to delete resource');
    } finally {
      setSaving(false);
    }
  }

  async function bulkImport(drafts: ResourceDraft[]) {
    setSaving(true);
    try {
      const body = await jsonFetch<{ created: Resource[]; count: number }>('/api/staff/resources/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drafts }),
      });
      setFiles((s) => [...body.created, ...s]);
      setBulkOpen(false);
      flash(`${body.count} files imported and saved to the library`);
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Unable to import files');
    } finally {
      setSaving(false);
    }
  }

  const visible = files.filter((f) => {
    if (typeFilter !== 'all' && f.type !== typeFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!`${f.title} ${f.topic} ${f.subject} ${f.author} ${f.originalFilename ?? ''}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const stats = [
    { Icon: FileText, label: 'Worksheets', value: files.filter((f) => f.type === 'worksheet').length },
    { Icon: ClipboardList, label: 'Quizzes', value: files.filter((f) => f.type === 'quiz').length },
    { Icon: ClipboardCheck, label: 'Tests', value: files.filter((f) => f.type === 'test').length },
    { Icon: BookOpen, label: 'Subjects', value: new Set(files.map((f) => f.subject)).size },
  ];

  return (
    <div className="min-h-[70vh] bg-background">
      <PortalChrome session={session} crumbs={[{ label: 'Resource Library', href: '/staff/library' }, { label: 'Library Admin' }]} showLeadsLink showStaffLink />

      <div className="mx-auto max-w-[1280px] px-6 pb-20 pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mb-1.5 font-heading text-4xl font-bold">Library Admin</h1>
            <p className="text-base text-muted-foreground">Upload, auto-sort, and manage staff PDFs. Visible to admins only.</p>
          </div>
          <button
            onClick={() => router.push('/staff/library')}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10"
          >
            <ArrowLeft className="size-4" />Back to Library
          </button>
        </div>

        <button
          onClick={() => setBulkOpen(true)}
          className="relative mb-7 flex w-full items-center gap-7 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary from-[42%] to-secondary p-[30px_32px] text-left shadow-lg"
        >
          <span className="absolute -top-10 right-20 size-52 rounded-full bg-white/[0.06]" />
          <span className="absolute -bottom-16 -right-5 size-56 rounded-full bg-secondary/20" />
          <span className="relative flex size-16 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
            <FolderUp className="size-8" />
          </span>
          <div className="relative flex-1">
            <div className="mb-1.5 flex items-center gap-2.5">
              <h2 className="font-heading text-2xl font-bold text-white">Bulk Upload &amp; Auto-Sort</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-[3px] text-[11px] font-bold text-[hsl(215_45%_20%)]">
                <Sparkles className="size-3" />AUTO-SORT
              </span>
            </div>
            <p className="max-w-[560px] text-base leading-relaxed text-white/90">
              Upload PDFs to private storage, classify them by subject, grade, and type, then review before saving.
            </p>
          </div>
          <span className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-primary shadow-md">
            <UploadCloud className="size-[18px]" />Upload Files
          </span>
        </button>


        <div className="mb-7 grid grid-cols-4 gap-4">
          {stats.map(({ Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-[18px_20px] shadow-sm">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-[22px]" />
              </span>
              <div>
                <div className="font-heading text-3xl font-bold leading-none">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
            <span className="text-base font-bold">All Resources</span>
            <span className="text-xs text-muted-foreground">{visible.length} shown</span>
            <div className="flex-1" />
            <div className="relative w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="h-9 pl-9 text-sm" />
            </div>
            <MiniToggle value={typeFilter} onChange={setTypeFilter} />
            <button
              onClick={() => setAdding(true)}
              disabled={saving}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-[13.5px] font-semibold text-primary transition-colors hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-50"
            >
              <Plus className="size-[15px]" />Add manually
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13.5px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.05em] text-muted-foreground">
                  <th className="border-b border-border px-4 py-3 font-semibold">Resource</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Grade</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Difficulty</th>
                  <th className="border-b border-border px-4 py-3 text-center font-semibold">Pages</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Added</th>
                  <th className="border-b border-border px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((f) => (
                  <AdminRow key={f.id} file={f} onEdit={() => setEditing(f)} onDelete={() => setConfirming(f)} />
                ))}
              </tbody>
            </table>
            {visible.length === 0 && <div className="py-12 text-center text-muted-foreground">No resources match your search.</div>}
          </div>
        </div>
      </div>

      {editing && <AddEditResourceModal initial={editing} isNew={false} onSave={(v) => void saveEdit(v as Resource)} onClose={() => setEditing(null)} />}
      {adding && <AddEditResourceModal initial={BLANK_DRAFT} isNew onSave={(v) => void addFile(v as ResourceDraft)} onClose={() => setAdding(false)} />}
      {confirming && <ConfirmDelete file={confirming} onCancel={() => setConfirming(null)} onConfirm={() => void deleteFile(confirming)} />}
      {bulkOpen && <BulkUploadModal onClose={() => setBulkOpen(false)} onImport={(drafts) => void bulkImport(drafts)} />}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function AdminRow({ file, onEdit, onDelete }: { file: Resource; onEdit: () => void; onDelete: () => void }) {
  const isTest = file.type === 'test';
  const isQuiz = file.type === 'quiz';
  const Icon = isTest ? ClipboardCheck : isQuiz ? ClipboardList : FileText;
  return (
    <tr>
      <td className="border-b border-border/50 px-4 py-3 align-middle">
        <div className="flex items-center gap-3">
          <span className={cn('flex size-[34px] shrink-0 items-center justify-center rounded-lg', AREA_CHIP[subjectArea(file.subject)])}>
            <Icon className="size-[17px]" />
          </span>
          <div className="min-w-0">
            <div className="max-w-[240px] truncate font-semibold">{file.title}</div>
            <div className="text-xs text-muted-foreground">
              <span className={cn('font-semibold', isTest ? 'text-[hsl(0_70%_45%)]' : isQuiz ? 'text-[hsl(268_60%_45%)]' : 'text-primary')}>{TYPE_LABEL[file.type]}</span> - {file.subject}
            </div>
          </div>
        </div>
      </td>
      <td className="border-b border-border/50 px-4 py-3 align-middle">{file.grade}</td>
      <td className="border-b border-border/50 px-4 py-3 align-middle">
        <span className={cn('rounded-full px-2 py-0.5 text-[11.5px] font-semibold', DIFFICULTY_CHIP[file.difficulty])}>{file.difficulty}</span>
      </td>
      <td className="border-b border-border/50 px-4 py-3 text-center align-middle text-muted-foreground">{file.pages}</td>
      <td className="whitespace-nowrap border-b border-border/50 px-4 py-3 align-middle text-muted-foreground">{fmtDate(file.added)}</td>
      <td className="border-b border-border/50 px-4 py-3 text-right align-middle">
        <div className="inline-flex gap-1">
          <RowBtn label="Edit" onClick={onEdit}><Pencil className="size-[15px]" /></RowBtn>
          <RowBtn label="Delete" danger onClick={onDelete}><Trash2 className="size-[15px]" /></RowBtn>
        </div>
      </td>
    </tr>
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

function MiniToggle({ value, onChange }: { value: 'all' | ResourceType; onChange: (v: 'all' | ResourceType) => void }) {
  const opts: ['all' | ResourceType, string][] = [['all', 'All'], ['worksheet', 'Worksheets'], ['quiz', 'Quizzes'], ['test', 'Tests']];
  return (
    <div className="inline-flex gap-0.5 rounded-full bg-secondary/40 p-[3px]">
      {opts.map(([id, label]) => {
        const active = value === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn('rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors', active ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

async function jsonFetch<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({})) as { error?: string } & T;
  if (!res.ok) throw new Error(body.error || 'Request failed');
  return body as T;
}
