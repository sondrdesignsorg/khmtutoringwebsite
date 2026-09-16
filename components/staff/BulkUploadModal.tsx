'use client';

import { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import {
  Check, CircleCheckBig, FileText, Folder, FolderUp, HelpCircle, Loader, Sparkles,
  TriangleAlert, UploadCloud,
} from 'lucide-react';
import { GRADES, SUBJECTS } from '@/lib/staff/resources';
import { classifyFilename } from '@/lib/staff/classify';
import { canonicalResourcePath, titleFromFilename, titleFromMetadata } from '@/lib/staff/naming';
import type { ClassifiedFile, ResourceDraft } from '@/lib/staff/types';
import { Modal, ModalCloseButton } from './Modal';
import { StaffSelect } from './StaffSelect';
import { CONFIDENCE_META } from './badges';
import { cn } from '@/lib/utils';

type Stage = 'drop' | 'scanning' | 'review';
type UploadMetadata = Pick<ClassifiedFile, 'fileUrl' | 'storageProvider' | 'storageKey' | 'originalFilename' | 'mimeType' | 'fileSize'>;
type DuplicateMap = Record<string, { resource: NonNullable<ClassifiedFile['duplicateOf']>; reason: string }>;

export function BulkUploadModal({
  onClose,
  onImport,
}: {
  onClose: () => void;
  onImport: (drafts: ResourceDraft[]) => void;
}) {
  const [stage, setStage] = useState<Stage>('drop');
  const [rows, setRows] = useState<ClassifiedFile[]>([]);
  const [progress, setProgress] = useState(0);

  async function startScan(files: File[]) {
    const pdfs = files.filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    if (!pdfs.length) return;

    setStage('scanning');
    setRows([]);
    setProgress(0);

    const nextRows: ClassifiedFile[] = [];
    for (let i = 0; i < pdfs.length; i++) {
      const file = pdfs[i];
      const id = `u_${i}_${Date.now()}`;
      const checksum = await fileSha256(file);

      let classified = classifyFilename(file.name, id);
      try {
        const res = await fetch('/api/staff/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name }),
        });
        if (res.ok) {
          const body = await res.json() as { classification?: ClassifiedFile };
          if (body.classification) classified = { ...classified, ...body.classification, id };
        }
      } catch {
        classified = classifyFilename(file.name, id);
      }

      const duplicate = await checkDuplicate({ id, filename: file.name, fileSize: file.size, checksum });
      let uploadResult: UploadMetadata | { uploadError: string } = {};

      if (!duplicate) {
        try {
          uploadResult = await uploadPdf(file, {
            subject: classified.subject,
            grade: classified.grade,
            type: classified.type,
            topic: classified.suggestedTopic?.trim() || titleFromFilename(file.name),
            added: new Date().toISOString().slice(0, 10),
            checksum,
          });
        } catch (err) {
          uploadResult = { uploadError: err instanceof Error ? err.message : 'Upload failed' };
        }
      }

      nextRows.push({
        ...classified,
        id,
        name: file.name,
        originalFilename: file.name,
        mimeType: file.type || 'application/pdf',
        fileSize: file.size,
        sourceProvider: 'manual_upload',
        sourceChecksum: checksum,
        duplicateOf: duplicate?.resource,
        duplicateReason: duplicate?.reason,
        ...uploadResult,
        include: !duplicate && !('uploadError' in uploadResult),
      });
      setRows([...nextRows]);
      setProgress(Math.round(((i + 1) / pdfs.length) * 100));
    }

    setStage('review');
  }

  const update = (id: string, patch: Partial<ClassifiedFile>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const included = rows.filter((r) => r.include && !r.uploadError && !r.duplicateOf);
  const duplicateCount = rows.filter((r) => r.duplicateOf).length;
  const needsReview = included.filter((r) => r.confidence !== 'high').length;

  function doImport() {
    const drafts: ResourceDraft[] = included.map((r) => ({
      title: r.suggestedTitle?.trim() || titleFromMetadata({ type: r.type, topic: r.suggestedTopic?.trim() || titleFromFilename(r.name) }),
      type: r.type,
      subject: r.subject,
      grade: r.grade,
      topic: r.suggestedTopic?.trim() || titleFromFilename(r.name),
      pages: r.pages,
      difficulty: r.difficulty,
      fileUrl: r.fileUrl,
      storageProvider: r.storageProvider,
      storageKey: r.storageKey,
      originalFilename: r.originalFilename || r.name,
      mimeType: r.mimeType,
      fileSize: r.fileSize,
      classificationConfidence: r.confidence,
      sourceProvider: 'manual_upload',
      sourceTable: 'bulk_upload',
      sourceId: r.sourceChecksum || r.storageKey || r.name,
      sourcePath: r.storageKey,
      sourceChecksum: r.sourceChecksum,
    }));
    onImport(drafts);
  }

  return (
    <Modal onClose={onClose} className={cn('flex flex-col transition-[max-width]', stage === 'review' ? 'max-w-[920px]' : 'max-w-[560px]')}>
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-[34px] items-center justify-center rounded-[9px] bg-primary text-primary-foreground">
            <FolderUp className="size-[18px]" />
          </span>
          <div>
            <h3 className="font-heading text-xl font-bold">Bulk Upload &amp; Auto-Sort</h3>
            <p className="text-[12.5px] text-muted-foreground">Upload PDFs, classify metadata, then save to the library.</p>
          </div>
        </div>
        <ModalCloseButton onClose={onClose} />
      </div>

      {stage === 'drop' && <DropStage onStart={startScan} />}
      {stage === 'scanning' && <ScanStage progress={progress} />}
      {stage === 'review' && <ReviewStage rows={rows} update={update} />}

      {stage === 'review' && (
        <div className="flex items-center gap-4 border-t border-border px-6 py-4">
          <div className="text-[13px] text-muted-foreground">
            <strong className="text-foreground">{included.length}</strong> of {rows.length} ready
            {needsReview > 0 && (
              <span className="ml-2.5 text-[hsl(38_70%_38%)]">
                <TriangleAlert className="mr-1 inline size-3.5 align-[-2px]" />
                {needsReview} need review
              </span>
            )}
            {duplicateCount > 0 && (
              <span className="ml-2.5 text-muted-foreground">
                {duplicateCount} duplicate{duplicateCount === 1 ? '' : 's'} skipped
              </span>
            )}
          </div>
          <div className="flex-1" />
          <button onClick={onClose} className="inline-flex h-9 items-center rounded-md px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10">
            Cancel
          </button>
          <button
            onClick={doImport}
            disabled={!included.length}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            <Check className="size-4" />Import {included.length} Files
          </button>
        </div>
      )}
    </Modal>
  );
}

async function checkDuplicate(file: { id: string; filename: string; fileSize: number; checksum: string }) {
  const res = await fetch('/api/staff/resources/duplicates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: [file] }),
  });
  if (!res.ok) return null;
  const body = await res.json() as { duplicates?: DuplicateMap };
  return body.duplicates?.[file.id] ?? null;
}

async function fileSha256(file: File): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(hashBuffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function uploadPdf(
  file: File,
  meta: { subject: string; grade: string; type: ClassifiedFile['type']; topic: string; added: string; checksum: string },
): Promise<UploadMetadata> {
  const pathname = canonicalResourcePath(meta);
  const blob = await upload(pathname, file, {
    access: 'private',
    handleUploadUrl: '/api/staff/files/upload',
    contentType: file.type || 'application/pdf',
    multipart: file.size > 8 * 1024 * 1024,
  });

  return {
    fileUrl: blob.url,
    storageProvider: 'vercel_blob',
    storageKey: blob.pathname,
    originalFilename: file.name,
    mimeType: file.type || 'application/pdf',
    fileSize: file.size,
  };
}

function DropStage({ onStart }: { onStart: (files: File[]) => void }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="p-6">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={(e) => onStart(Array.from(e.target.files ?? []))}
      />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); onStart(Array.from(e.dataTransfer.files)); }}
        className={cn(
          'cursor-pointer rounded-xl border-2 border-dashed px-6 py-11 text-center transition-colors',
          over ? 'border-primary bg-primary/[0.06]' : 'border-border bg-secondary/30',
        )}
      >
        <span className="mb-3.5 inline-flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UploadCloud className="size-7" />
        </span>
        <div className="mb-1 text-lg font-bold">Drop PDFs here</div>
        <div className="mb-[18px] text-sm text-muted-foreground">or click to browse - multiple files at once</div>
        <span className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground">
          <Folder className="size-4" />Select Files
        </span>
      </div>
      <div className="mt-[18px] flex items-start gap-3 rounded-md border border-border bg-[hsl(210_40%_92%/0.5)] px-3.5 py-3">
        <Sparkles className="mt-px size-[18px] shrink-0 text-primary" />
        <div className="text-[12.5px] leading-relaxed text-[hsl(215_45%_20%/0.85)]">
          Files are checked for duplicates before upload, then saved to private Blob storage and sorted by metadata.
        </div>
      </div>
    </div>
  );
}

function ScanStage({ progress }: { progress: number }) {
  return (
    <div className="px-8 py-14 text-center">
      <span className="mb-[18px] inline-flex size-14 animate-spin items-center justify-center rounded-full bg-primary/10 text-primary">
        <Loader className="size-[26px]" />
      </span>
      <div className="mb-1.5 text-lg font-bold">Checking, uploading, and sorting files...</div>
      <div className="mb-5 text-sm text-muted-foreground">Matching duplicates before saving private PDFs</div>
      <div className="mx-auto h-2 max-w-[320px] overflow-hidden rounded-full bg-secondary/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ReviewStage({
  rows, update,
}: {
  rows: ClassifiedFile[];
  update: (id: string, patch: Partial<ClassifiedFile>) => void;
}) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="px-6 pb-1 pt-3.5 text-xs text-muted-foreground">
        Review the auto-sorted results. Duplicates are excluded automatically and can be left skipped.
      </div>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-[0.05em] text-muted-foreground">
            <th className="py-2.5 pl-6 pr-3" />
            <th className="px-3 py-2.5">File</th>
            <th className="px-3 py-2.5">Type</th>
            <th className="px-3 py-2.5">Subject</th>
            <th className="px-3 py-2.5">Grade</th>
            <th className="px-3 py-2.5">Pages</th>
            <th className="py-2.5 pl-3 pr-6">Match</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const conf = CONFIDENCE_META[r.confidence];
            const ConfIcon = conf.icon === 'circle-check-big' ? CircleCheckBig : conf.icon === 'help-circle' ? HelpCircle : TriangleAlert;
            const locked = !!r.uploadError || !!r.duplicateOf;
            return (
              <tr key={r.id} className={cn('border-t border-border/50', (!r.include || locked) && 'opacity-50')}>
                <td className="py-2.5 pl-6 pr-3">
                  <button
                    onClick={() => update(r.id, { include: !r.include })}
                    disabled={locked}
                    aria-label="Toggle"
                    className={cn(
                      'flex size-5 items-center justify-center rounded-[5px] border-[1.5px] disabled:pointer-events-none',
                      r.include && !locked ? 'border-primary bg-primary' : 'border-border bg-card',
                    )}
                  >
                    {r.include && !locked && <Check className="size-3 text-white" />}
                  </button>
                </td>
                <td className="max-w-[220px] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="size-[15px] shrink-0 text-[hsl(0_70%_45%)]" />
                    <span className="truncate text-[12.5px]" title={r.name}>{r.name}</span>
                  </div>
                  {r.uploadError && <div className="mt-1 text-[11px] text-destructive">{r.uploadError}</div>}
                  {r.duplicateOf && (
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Duplicate: {r.duplicateReason} - {r.duplicateOf.title}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <StaffSelect value={r.type} onChange={(v) => update(r.id, { type: v as ClassifiedFile['type'] })} options={[{ value: 'worksheet', label: 'Worksheet' }, { value: 'quiz', label: 'Quiz' }, { value: 'test', label: 'Test' }]} />
                </td>
                <td className="px-3 py-2.5">
                  <StaffSelect value={r.subject} onChange={(v) => update(r.id, { subject: v, subjectKnown: true })} options={SUBJECTS} flag={!r.subjectKnown} />
                </td>
                <td className="px-3 py-2.5">
                  <StaffSelect value={r.grade} onChange={(v) => update(r.id, { grade: v, gradeKnown: true })} options={GRADES} flag={!r.gradeKnown} />
                </td>
                <td className="px-3 py-2.5">
                  <input
                    type="number"
                    min={1}
                    value={r.pages}
                    onChange={(e) => update(r.id, { pages: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="h-8 w-16 rounded-md border border-input bg-card px-2 text-sm outline-none"
                  />
                </td>
                <td className="py-2.5 pl-3 pr-6">
                  {r.duplicateOf ? (
                    <span className="inline-flex items-center gap-[5px] whitespace-nowrap rounded-full bg-secondary/60 px-2.5 py-[3px] text-[11px] font-semibold text-muted-foreground">
                      <TriangleAlert className="size-3" />Duplicate
                    </span>
                  ) : (
                    <span className={cn('inline-flex items-center gap-[5px] whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-semibold', conf.chip)} title={r.reasons.join(' / ')}>
                      <ConfIcon className="size-3" />{conf.label}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
