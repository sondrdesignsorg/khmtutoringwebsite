'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ClipboardCheck, ClipboardList, Copy, FileText } from 'lucide-react';
import { subjectArea, AREA_LABEL, TYPE_LABEL } from '@/lib/staff/resources';
import type { Resource } from '@/lib/staff/types';
import { AREA_CHIP, DIFFICULTY_CHIP, typePill } from './badges';
import { cn } from '@/lib/utils';

export function FileCard({
  file,
  selected,
  onOpen,
  onToggleSelect,
}: {
  file: Resource;
  selected: boolean;
  onOpen: () => void;
  onToggleSelect: () => void;
}) {
  const area = subjectArea(file.subject);
  const isTest = file.type === 'test';
  const isQuiz = file.type === 'quiz';
  const TypeIcon = isTest ? ClipboardCheck : isQuiz ? ClipboardList : FileText;
  const hasFile = !!(file.storageKey || file.fileUrl);

  const thumbRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!hasFile) return;
    const el = thumbRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasFile]);

  return (
    <div
      onClick={onOpen}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-xl border-2 bg-card transition-all',
        selected ? 'border-primary shadow-md' : 'border-border shadow-sm hover:border-primary/40 hover:shadow-md',
      )}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
        aria-label="Select file"
        className={cn(
          'absolute right-3 top-3 z-[2] flex size-6 items-center justify-center rounded-md border-[1.5px]',
          selected ? 'border-primary bg-primary' : 'border-border bg-white/90',
        )}
      >
        {selected && <Check className="size-3.5 text-white" />}
      </button>

      {/* PDF thumbnail */}
      <div ref={thumbRef} className="relative h-52 overflow-hidden border-b border-border bg-secondary/20">
        {hasFile ? (
          <>
            <div
              className={cn(
                'absolute inset-0 animate-pulse bg-secondary/30 transition-opacity duration-300',
                loaded ? 'opacity-0 pointer-events-none' : 'opacity-100',
              )}
            />
            {visible && (
              <iframe
                src={`/api/staff/files/${file.id}/download`}
                title=""
                aria-hidden
                tabIndex={-1}
                onLoad={() => setLoaded(true)}
                className="pointer-events-none border-none"
                style={{
                  width: 612,
                  height: 792,
                  transform: 'scale(0.56)',
                  transformOrigin: 'top left',
                }}
              />
            )}
            {/* Fade out the bottom so the crop looks intentional */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card/70 to-transparent" />
          </>
        ) : (
          <div className="px-4 py-3.5">
            <div className="mb-2 flex items-center gap-[7px]">
              <span className={cn('flex size-[26px] items-center justify-center rounded-[7px]', AREA_CHIP[area])}>
                <TypeIcon className="size-[15px]" />
              </span>
              <span className={cn('text-[10px] font-bold uppercase tracking-[0.05em]', AREA_CHIP[area].split(' ')[1])}>
                {AREA_LABEL[area]}
              </span>
            </div>
            {[88, 70, 80].map((w, i) => (
              <div key={i} className="mb-[5px] h-1 rounded-sm bg-[#dbe3ec]" style={{ width: `${w}%` }} />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3.5">
        <span className={cn('mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold', typePill(file.type))}>
          {TYPE_LABEL[file.type]}
        </span>
        <h3 className="mb-1 font-heading text-base font-semibold leading-tight">{file.title}</h3>
        <p className="mb-3 text-[12.5px] text-muted-foreground">{file.subject} · {file.grade}</p>
        <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
          <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', DIFFICULTY_CHIP[file.difficulty])}>
            {file.difficulty}
          </span>
          <span className="flex items-center gap-[5px] text-[11.5px] text-muted-foreground">
            <Copy className="size-[13px]" />{file.pages} pages
          </span>
        </div>
      </div>
    </div>
  );
}
