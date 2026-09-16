'use client';

import { cn } from '@/lib/utils';
import type { Question } from '@/lib/diagnostic/questions';

const LETTERS = ['A', 'B', 'C', 'D'];

interface Props {
  question: Question;
  selected: number | null;
  isLast: boolean;
  onSelect: (idx: number) => void;
  onNext: () => void;
}

export function QuizScreen({ question, selected, isLast, onSelect, onNext }: Props) {
  const disabled = selected === null;
  return (
    <div className="w-full max-w-[720px] mx-auto px-6 py-12">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
        {question.topic}
      </div>

      {question.passage && (
        <div className="bg-muted rounded-2xl px-5 py-5 md:px-6 mb-5 text-base leading-relaxed text-foreground">
          {question.passage}
        </div>
      )}

      <div className="font-heading font-bold text-xl md:text-2xl text-foreground leading-snug mb-6">
        {question.prompt}
      </div>

      <div className="flex flex-col gap-3">
        {question.choices.map((text, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={cn(
                'flex items-center gap-3 w-full text-left px-4 py-4 rounded-xl border transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5 border-[1.5px]'
                  : 'border-border bg-card hover:bg-primary/5',
              )}
            >
              <span
                className={cn(
                  'inline-flex items-center justify-center w-[26px] h-[26px] rounded-full flex-shrink-0 font-bold text-sm border',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground border-[1.5px]'
                    : 'border-border bg-transparent text-muted-foreground',
                )}
              >
                {LETTERS[i]}
              </span>
              <span className="text-foreground">{text}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end mt-7">
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className={cn(
            'h-[50px] px-7 rounded-full bg-primary text-primary-foreground font-semibold text-base shadow-md transition-opacity',
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90',
          )}
        >
          {isLast ? 'See Results' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}
