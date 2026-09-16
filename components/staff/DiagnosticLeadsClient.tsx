'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Calendar, ChevronDown, ChevronUp, Mail, Phone, Search, Settings } from 'lucide-react';
import { PortalChrome } from './PortalChrome';
import { Toast } from './Toast';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { StaffSession } from '@/lib/staff/auth';

export interface DiagnosticLead {
  id: string;
  parentName: string;
  studentName: string;
  studentGrade: string | null;
  email: string;
  phone: string | null;
  ageGroup: string;
  subject: string;
  length: number;
  score: number;
  tier: string;
  emailedAt: string | null;
  bookedAt: string | null;
  clientStatus: 'new' | 'contacted' | 'client';
  notes: string | null;
  createdAt: string;
}

type StatusFilter = 'all' | DiagnosticLead['clientStatus'];

const STATUS_CYCLE: DiagnosticLead['clientStatus'][] = ['new', 'contacted', 'client'];

const STATUS_META: Record<DiagnosticLead['clientStatus'], { label: string; bg: string; text: string }> = {
  new:       { label: 'New',       bg: 'bg-sky-100',   text: 'text-sky-700' },
  contacted: { label: 'Contacted', bg: 'bg-amber-100', text: 'text-amber-700' },
  client:    { label: 'Client',    bg: 'bg-green-100', text: 'text-green-700' },
};

const AGE_LABEL: Record<string, string> = {
  elementary: 'Elementary',
  middle:     'Middle',
  high:       'High School',
  satact:     'SAT/ACT',
};

function percentile(score: number) {
  return Math.max(5, Math.round(95 * Math.pow(score / 100, 2)));
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function patchLead(id: string, updates: { client_status?: DiagnosticLead['clientStatus']; notes?: string | null }) {
  const res = await fetch(`/api/staff/diagnostic-leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const body = await res.json().catch(() => ({})) as { error?: string };
  if (!res.ok) throw new Error(body.error ?? 'Update failed');
  return body;
}

export function DiagnosticLeadsClient({
  leads: initialLeads,
  session,
}: {
  leads: DiagnosticLead[];
  session: StaffSession;
}) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.clientStatus === 'new').length,
    contacted: leads.filter((l) => l.clientStatus === 'contacted').length,
    client: leads.filter((l) => l.clientStatus === 'client').length,
  };

  const visible = leads.filter((l) => {
    if (statusFilter !== 'all' && l.clientStatus !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (
        !l.studentName.toLowerCase().includes(q) &&
        !l.parentName.toLowerCase().includes(q) &&
        !l.email.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  async function cycleStatus(lead: DiagnosticLead) {
    const idx = STATUS_CYCLE.indexOf(lead.clientStatus);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    setSavingId(lead.id);
    try {
      await patchLead(lead.id, { client_status: next });
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, clientStatus: next } : l));
      flash(`${lead.studentName} marked as ${STATUS_META[next].label}`);
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSavingId(null);
    }
  }

  async function saveNotes(lead: DiagnosticLead) {
    const notes = editingNotes[lead.id] ?? (lead.notes ?? '');
    setSavingId(lead.id);
    try {
      await patchLead(lead.id, { notes: notes.trim() || null });
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, notes: notes.trim() || null } : l));
      setEditingNotes((prev) => { const n = { ...prev }; delete n[lead.id]; return n; });
      flash('Notes saved');
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PortalChrome
        session={session}
        crumbs={[{ label: 'Staff', href: '/staff/library' }, { label: 'Diagnostic Leads' }]}
        showAdminLink
      />

      <div className="mx-auto max-w-[1280px] px-6 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Diagnostic Leads</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Everyone who took the diagnostic — track who becomes a client.</p>
          </div>
          <button
            onClick={() => router.refresh()}
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([['all', 'Total Leads', 'bg-card border border-border'], ['new', 'New', 'bg-sky-50 border border-sky-200'], ['contacted', 'Contacted', 'bg-amber-50 border border-amber-200'], ['client', 'Clients', 'bg-green-50 border border-green-200']] as const).map(([key, label, cls]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={cn('rounded-2xl p-4 text-left transition-opacity', cls, statusFilter === key ? 'ring-2 ring-primary/40' : 'opacity-80 hover:opacity-100')}
            >
              <div className="text-2xl font-bold text-foreground">{counts[key]}</div>
              <div className="text-xs font-semibold text-muted-foreground mt-0.5">{label}</div>
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search name or email…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <StatusTabs value={statusFilter} onChange={setStatusFilter} counts={counts} />
        </div>

        {/* Table */}
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground text-sm">
            {leads.length === 0 ? 'No diagnostic leads yet. They\'ll appear here once someone takes the test.' : 'No leads match this filter.'}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Student</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Parent / Contact</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Test</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Score</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map((lead) => {
                  const isExpanded = expandedId === lead.id;
                  const notesDraft = editingNotes[lead.id] ?? lead.notes ?? '';
                  const notesChanged = lead.id in editingNotes && editingNotes[lead.id] !== (lead.notes ?? '');
                  const pct = percentile(lead.score);
                  const meta = STATUS_META[lead.clientStatus];
                  const saving = savingId === lead.id;

                  return (
                    <>
                      <tr
                        key={lead.id}
                        className={cn('hover:bg-muted/30 transition-colors', isExpanded && 'bg-muted/20')}
                      >
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(lead.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-foreground">{lead.studentName}</div>
                          {lead.studentGrade && <div className="text-xs text-muted-foreground">Grade {lead.studentGrade}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{lead.parentName}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Mail className="size-3 shrink-0" />
                            <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="size-3 shrink-0" />{lead.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="size-3.5 text-muted-foreground" />
                            <span className="font-medium">{AGE_LABEL[lead.ageGroup] ?? lead.ageGroup}</span>
                          </div>
                          <div className="text-xs text-muted-foreground capitalize">{lead.subject} · {lead.length}Q</div>
                          {lead.bookedAt && (
                            <div className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                              <Calendar className="size-3" />Booked
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-bold text-foreground text-base">{lead.score}%</div>
                          <div className="text-xs text-muted-foreground">{pct}th pct · {lead.tier}</div>
                          {!lead.emailedAt && <div className="text-xs text-amber-600 mt-0.5">Email unsent</div>}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => cycleStatus(lead)}
                            disabled={saving}
                            title="Click to advance status"
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-opacity',
                              meta.bg, meta.text,
                              saving ? 'opacity-50 cursor-wait' : 'hover:opacity-80 cursor-pointer',
                            )}
                          >
                            {meta.label}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {lead.notes ? <span className="max-w-[120px] truncate text-foreground">{lead.notes}</span> : <span>Add note</span>}
                            {isExpanded ? <ChevronUp className="size-3 shrink-0" /> : <ChevronDown className="size-3 shrink-0" />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${lead.id}-notes`} className="bg-muted/10">
                          <td colSpan={7} className="px-4 pb-4 pt-2">
                            <div className="flex flex-col gap-2 max-w-xl">
                              <label className="text-xs font-semibold text-muted-foreground">Notes for {lead.studentName}</label>
                              <textarea
                                rows={3}
                                value={notesDraft}
                                onChange={(e) =>
                                  setEditingNotes((prev) => ({ ...prev, [lead.id]: e.target.value }))
                                }
                                placeholder="Add internal notes here…"
                                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                              />
                              {notesChanged && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => saveNotes(lead)}
                                    disabled={saving}
                                    className="rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold hover:bg-primary/90 disabled:opacity-50"
                                  >
                                    {saving ? 'Saving…' : 'Save notes'}
                                  </button>
                                  <button
                                    onClick={() => setEditingNotes((prev) => { const n = { ...prev }; delete n[lead.id]; return n; })}
                                    className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}

function StatusTabs({
  value,
  onChange,
  counts,
}: {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
  counts: Record<StatusFilter, number>;
}) {
  const opts: [StatusFilter, string][] = [['all', 'All'], ['new', 'New'], ['contacted', 'Contacted'], ['client', 'Client']];
  return (
    <div className="inline-flex gap-0.5 rounded-full bg-secondary/40 p-[3px]">
      {opts.map(([id, label]) => {
        const active = value === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              'rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
              active ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label} <span className="opacity-60">({counts[id]})</span>
          </button>
        );
      })}
    </div>
  );
}
