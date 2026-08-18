'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, Search, Trash2 } from 'lucide-react';
import { PortalChrome } from './PortalChrome';
import type { StaffSession } from '@/lib/staff/auth';

type AuditRow = {
  id: string;
  action: 'keep' | 'delete';
  reasons: string[];
  title: string;
  subject: string | null;
  grade: string | null;
  originalFilename: string | null;
  storageProvider: string | null;
};

type Tab = 'flagged' | 'search';

export function LibraryAuditClient({
  session,
  total,
  flagged: initialFlagged,
  all,
}: {
  session: StaffSession;
  total: number;
  flagged: AuditRow[];
  all: AuditRow[];
}) {
  const [tab, setTab] = useState<Tab>('flagged');
  const [flagged, setFlagged] = useState<AuditRow[]>(initialFlagged);
  const [allResources, setAllResources] = useState<AuditRow[]>(all);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [done, setDone] = useState<{ deleted: number; errors: { id: string; error?: string }[] } | null>(null);
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allResources.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      (r.originalFilename ?? '').toLowerCase().includes(q) ||
      (r.subject ?? '').toLowerCase().includes(q),
    );
  }, [query, allResources]);

  const activeList = tab === 'flagged' ? flagged : searchResults;

  function toggleAll() {
    if (selected.size === activeList.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(activeList.map((r) => r.id)));
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function deleteSelected() {
    if (selected.size === 0) return;
    const confirmed = window.confirm(
      `Permanently delete ${selected.size} resource${selected.size === 1 ? '' : 's'} and their files? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/staff/library/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      const body = await res.json() as { deleted: number; errors: { id: string; error?: string }[] };
      const deletedIds = new Set(
        Array.from(selected).filter((id) => !body.errors.some((e) => e.id === id)),
      );
      setFlagged((prev) => prev.filter((r) => !deletedIds.has(r.id)));
      setAllResources((prev) => prev.filter((r) => !deletedIds.has(r.id)));
      setSelected(new Set());
      setDone(body);
    } finally {
      setDeleting(false);
    }
  }

  const kept = total - flagged.length;

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <PortalChrome
        session={session}
        crumbs={[{ label: 'Library', href: '/staff/library' }, { label: 'Audit' }]}
        showAdminLink
      />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-bold text-foreground">Library Audit</h1>
          <p className="text-sm text-muted-foreground">
            Review auto-flagged resources or search all resources to find and delete anything that doesn't belong.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Total resources', value: total },
            { label: 'Clean', value: kept },
            { label: 'Flagged', value: flagged.length, highlight: flagged.length > 0 },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="rounded-2xl border border-border bg-white px-5 py-4">
              <p className={`text-2xl font-bold ${highlight ? 'text-red-600' : 'text-foreground'}`}>{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {done && (
          <div className={`mb-6 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${done.errors.length ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-green-300 bg-green-50 text-green-800'}`}>
            <CheckCircle className="size-4 flex-shrink-0" />
            {done.deleted} resource{done.deleted === 1 ? '' : 's'} deleted.
            {done.errors.length > 0 && ` ${done.errors.length} failed — check console.`}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-5 flex gap-1 rounded-xl border border-border bg-white p-1">
          {(['flagged', 'search'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelected(new Set()); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${tab === t ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t === 'flagged' ? `Auto-flagged (${flagged.length})` : 'Search all'}
            </button>
          ))}
        </div>

        {/* Search input */}
        {tab === 'search' && (
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(new Set()); }}
              placeholder="Search by title or filename…"
              className="h-11 w-full rounded-xl border border-input bg-white pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary"
              autoFocus
            />
          </div>
        )}

        {/* List */}
        {tab === 'search' && !query.trim() ? (
          <div className="rounded-2xl border border-border bg-white px-6 py-10 text-center text-sm text-muted-foreground">
            Type a name or filename to find any resource.
          </div>
        ) : activeList.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white px-6 py-12 text-center">
            <CheckCircle className="mx-auto mb-3 size-10 text-green-500" />
            <p className="font-semibold text-foreground">
              {tab === 'flagged' ? 'No flagged resources' : 'No matches'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === 'flagged' ? 'All resources passed the audit filters.' : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={selected.size === activeList.length && activeList.length > 0}
                  onChange={toggleAll}
                  className="size-4 rounded border-input accent-primary"
                />
                Select all ({activeList.length})
              </label>
              <button
                onClick={deleteSelected}
                disabled={selected.size === 0 || deleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                {deleting ? 'Deleting…' : `Delete selected (${selected.size})`}
              </button>
            </div>

            <div className="space-y-2">
              {activeList.map((row) => (
                <label
                  key={row.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border bg-white p-4 transition-colors hover:border-primary/40 ${selected.has(row.id) ? 'border-red-300 bg-red-50/40' : 'border-border'}`}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(row.id)}
                    onChange={() => toggle(row.id)}
                    className="mt-0.5 size-4 flex-shrink-0 rounded border-input accent-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">{row.title}</span>
                      {row.subject && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">{row.subject}</span>
                      )}
                      {row.grade && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{row.grade}</span>
                      )}
                    </div>
                    {row.originalFilename && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.originalFilename}</p>
                    )}
                    {row.reasons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {row.reasons.map((r) => (
                          <span key={r} className="flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                            <AlertTriangle className="size-3" />
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
