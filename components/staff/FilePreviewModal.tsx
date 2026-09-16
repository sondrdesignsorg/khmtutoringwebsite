'use client';

import {
  BarChart3, BookOpen, Calendar, Check, Download, FileText, GraduationCap, Plus, Tag, User,
} from 'lucide-react';
import { subjectArea, fmtDate, TYPE_LABEL } from '@/lib/staff/resources';
import type { Resource } from '@/lib/staff/types';
import { Modal, ModalCloseButton } from './Modal';
import { DocumentPage } from './DocumentPage';
import { typePill } from './badges';
import { cn } from '@/lib/utils';

const AREA_TEXT: Record<string, string> = {
  math: 'text-[hsl(215_45%_30%)]',
  testprep: 'text-[hsl(38_70%_38%)]',
  english: 'text-[hsl(215_45%_30%)]',
  science: 'text-[hsl(160_60%_30%)]',
};

export function FilePreviewModal({
  file,
  selected,
  onToggleSelect,
  onClose,
}: {
  file: Resource;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onClose: () => void;
}) {
  const areaText = AREA_TEXT[subjectArea(file.subject)];
  const fileRoute = `/api/staff/files/${file.id}/download`;
  const hasRealFile = !!(file.storageKey || file.fileUrl);

  const meta: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <BookOpen className="size-4" />, label: 'Subject', value: file.subject },
    { icon: <GraduationCap className="size-4" />, label: 'Grade', value: file.grade },
    { icon: <Tag className="size-4" />, label: 'Topic', value: file.topic },
    { icon: <FileText className="size-4" />, label: 'Length', value: `${file.pages} pages` },
    { icon: <BarChart3 className="size-4" />, label: 'Difficulty', value: file.difficulty },
    { icon: <User className="size-4" />, label: 'Added by', value: file.author },
    { icon: <Calendar className="size-4" />, label: 'Date added', value: fmtDate(file.added) },
  ];

  return (
    <Modal onClose={onClose} className="grid max-w-[1040px] grid-cols-[1fr_320px]">
      <div className="overflow-auto bg-secondary/30 p-7">
        {hasRealFile ? (
          <iframe
            title={`${file.title} PDF preview`}
            src={fileRoute}
            className="h-[720px] w-full rounded-md border border-border bg-white"
          />
        ) : (
          <DocumentPage file={file} />
        )}
      </div>

      <div className="flex min-h-0 flex-col border-l border-border">
        <div className="flex items-start justify-between gap-3 border-b border-border px-[22px] py-5">
          <div>
            <span className={cn('mb-2 inline-block rounded-full px-2.5 py-[3px] text-[11px] font-bold', typePill(file.type))}>
              {TYPE_LABEL[file.type]}
            </span>
            <h3 className="font-heading text-xl font-bold">{file.title}</h3>
            {file.originalFilename && <p className="mt-1 text-xs text-muted-foreground">{file.originalFilename}</p>}
          </div>
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="flex flex-1 flex-col gap-3.5 overflow-auto px-[22px] py-[18px]">
          {meta.map((m) => (
            <div key={m.label} className="flex items-start gap-3">
              <span className={cn('mt-0.5 shrink-0', areaText)}>{m.icon}</span>
              <div>
                <div className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground">{m.label}</div>
                <div className="text-sm font-medium">{m.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 border-t border-border px-[22px] py-4">
          <button
            onClick={() => onToggleSelect(file.id)}
            className={cn(
              'inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors',
              selected
                ? 'border border-border bg-background text-foreground hover:bg-primary/10'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            {selected ? <Check className="size-4" /> : <Plus className="size-4" />}
            {selected ? 'Added to selection' : 'Add to selection'}
          </button>
          <a
            href={`${fileRoute}?download=1`}
            className={cn(
              'inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors',
              hasRealFile ? 'text-foreground hover:bg-primary/10' : 'pointer-events-none text-muted-foreground opacity-50',
            )}
          >
            <Download className="size-4" />Download PDF
          </a>
        </div>
      </div>
    </Modal>
  );
}
