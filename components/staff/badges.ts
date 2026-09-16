import type { SubjectArea } from '@/lib/staff/resources';
import type { Confidence, Difficulty } from '@/lib/staff/types';

// Full literal Tailwind class strings (so the JIT compiler picks them up).

export const AREA_CHIP: Record<SubjectArea, string> = {
  math: 'bg-[hsl(215_45%_30%/0.10)] text-[hsl(215_45%_30%)]',
  testprep: 'bg-[hsl(45_85%_60%/0.20)] text-[hsl(38_70%_38%)]',
  english: 'bg-[hsl(210_35%_80%/0.45)] text-[hsl(215_45%_30%)]',
  science: 'bg-[hsl(160_60%_42%/0.16)] text-[hsl(160_60%_30%)]',
};

export const DIFFICULTY_CHIP: Record<Difficulty, string> = {
  Beginner: 'bg-[hsl(160_60%_42%/0.14)] text-[hsl(160_60%_30%)]',
  Intermediate: 'bg-[hsl(45_85%_60%/0.20)] text-[hsl(38_70%_38%)]',
  Advanced: 'bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_70%_45%)]',
};

export const CONFIDENCE_META: Record<
  Confidence,
  { chip: string; label: string; icon: 'circle-check-big' | 'help-circle' | 'triangle-alert' }
> = {
  high: { chip: 'bg-[hsl(160_60%_42%/0.14)] text-[hsl(160_60%_30%)]', label: 'High match', icon: 'circle-check-big' },
  medium: { chip: 'bg-[hsl(45_85%_60%/0.20)] text-[hsl(38_70%_38%)]', label: 'Review', icon: 'help-circle' },
  low: { chip: 'bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_70%_45%)]', label: 'Needs review', icon: 'triangle-alert' },
};

export function typePill(type: 'worksheet' | 'quiz' | 'test'): string {
  if (type === 'test') return 'bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_70%_45%)]';
  if (type === 'quiz') return 'bg-[hsl(268_65%_55%/0.14)] text-[hsl(268_60%_45%)]';
  return 'bg-[hsl(210_35%_80%/0.45)] text-[hsl(215_45%_30%)]';
}
