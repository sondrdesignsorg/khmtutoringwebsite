'use client';

import { useState } from 'react';
import { Check, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { LibraryFolder } from '@/lib/staff/types';
import { Modal, ModalCloseButton } from './Modal';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/** Admin tool for adding, renaming, and deleting resource folders. */
export function FolderManagerModal({
  initialFolders,
  onClose,
  onChanged,
}: {
  initialFolders: LibraryFolder[];
  onClose: () => void;
  onChanged: (folders: LibraryFolder[]) => void;
}) {
  const [folders, setFolders] = useState<LibraryFolder[]>(initialFolders);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function commit(next: LibraryFolder[]) {
    setFolders(next);
    onChanged(next);
  }

  async function addFolder() {
    const name = newName.trim();
    if (!name) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/staff/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const body = await res.json() as { folder?: LibraryFolder; error?: string };
      if (!res.ok || !body.folder) throw new Error(body.error || 'Could not add folder');
      commit([...folders, body.folder]);
      setNewName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add folder');
    } finally {
      setBusy(false);
    }
  }

  async function renameFolder(id: string) {
    const name = editName.trim();
    if (!name) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/staff/folders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const body = await res.json() as { folder?: LibraryFolder; error?: string };
      if (!res.ok || !body.folder) throw new Error(body.error || 'Could not rename folder');
      commit(folders.map((f) => (f.id === id ? body.folder! : f)));
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not rename folder');
    } finally {
      setBusy(false);
    }
  }

  async function removeFolder(folder: LibraryFolder) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/staff/folders/${folder.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete folder');
      commit(folders.filter((f) => f.id !== folder.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete folder');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal onClose={onClose} className="flex max-w-[480px] flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-[18px]">
        <div>
          <h3 className="font-heading text-2xl font-bold">Folders</h3>
          <p className="mt-1 text-sm text-muted-foreground">Group tests by course or year.</p>
        </div>
        <ModalCloseButton onClose={onClose} />
      </div>

      <div className="flex max-h-[50vh] flex-col gap-2 overflow-auto px-6 py-4">
        {folders.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No folders yet.</p>}
        {folders.map((folder) =>
          editingId === folder.id ? (
            <div key={folder.id} className="flex items-center gap-2">
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9" autoFocus />
              <button
                onClick={() => void renameFolder(folder.id)}
                disabled={busy}
                aria-label="Save name"
                className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Check className="size-4" />
              </button>
              <button onClick={() => setEditingId(null)} aria-label="Cancel" className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-primary/10">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div key={folder.id} className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2">
              <span className="truncate text-sm font-semibold">{folder.name}</span>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => { setEditingId(folder.id); setEditName(folder.name); }}
                  aria-label="Rename folder"
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-primary/10"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => void removeFolder(folder)}
                  disabled={busy}
                  aria-label="Delete folder"
                  className="flex size-7 items-center justify-center rounded-md text-[hsl(0_70%_45%)] hover:bg-[hsl(0_84%_60%/0.1)] disabled:opacity-50"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void addFolder(); }}
            placeholder="New folder name"
            className="h-9"
          />
          <button
            onClick={() => void addFolder()}
            disabled={busy || !newName.trim()}
            className={cn(
              'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90',
              (busy || !newName.trim()) && 'pointer-events-none opacity-50',
            )}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}Add
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    </Modal>
  );
}
