'use client';

import { cn } from '@/lib/utils';
import {
  AGE_GROUPS,
  LENGTHS,
  SUBJECTS,
  type AgeGroupId,
  type LengthId,
  type SubjectId,
} from '@/lib/diagnostic/questions';

interface Props {
  layout: 'A' | 'B';
  ageGroup: AgeGroupId;
  subject: SubjectId;
  length: LengthId;
  onSelectAge: (id: AgeGroupId) => void;
  onSelectSubject: (id: SubjectId) => void;
  onSelectLength: (id: LengthId) => void;
  onStart: () => void;
}

export function StartScreen({
  layout,
  ageGroup,
  subject,
  length,
  onSelectAge,
  onSelectSubject,
  onSelectLength,
  onStart,
}: Props) {
  const lengthOptions = subject === 'reading' ? LENGTHS.filter((l) => l.id === 20) : LENGTHS;

  if (layout === 'B') {
    return (
      <div className="w-full relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-[360px] h-[360px] rounded-full"
          style={{ background: 'hsl(215 45% 30% / 0.06)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full"
          style={{ background: 'hsl(45 85% 60% / 0.08)' }}
        />
        <div className="grid md:grid-cols-[1fr_1.2fr] min-h-[600px] relative z-[1]">
          <div className="bg-primary text-primary-foreground p-10 md:p-14 flex flex-col justify-center gap-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 text-sm font-semibold w-fit">
              Free Diagnostic Test
            </div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl leading-tight">
              See exactly where your child stands.
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-md">
              A quick, level-appropriate assessment that shows strengths and gaps by topic — plus a free consultation with one of our tutors.
            </p>
            <div className="flex gap-7 mt-3">
              <div>
                <div className="font-bold text-2xl">300+</div>
                <div className="text-sm text-white/80">Students Helped</div>
              </div>
              <div>
                <div className="font-bold text-2xl">5.0</div>
                <div className="text-sm text-white/80">Parent Rating</div>
              </div>
            </div>
          </div>
          <div className="bg-card p-10 md:p-14 flex flex-col gap-7 justify-center">
            <StepBlock title="1. Choose age group">
              <div className="flex flex-wrap gap-2.5">
                {AGE_GROUPS.map((g) => (
                  <TwoLineButton
                    key={g.id}
                    active={g.id === ageGroup}
                    label={g.label}
                    sub={g.sub}
                    onClick={() => onSelectAge(g.id)}
                  />
                ))}
              </div>
            </StepBlock>
            <StepBlock title="2. Choose subject">
              <div className="flex flex-wrap gap-2.5">
                {SUBJECTS.map((s) => (
                  <PillButton
                    key={s.id}
                    active={s.id === subject}
                    label={s.label}
                    onClick={() => onSelectSubject(s.id)}
                  />
                ))}
              </div>
            </StepBlock>
            <StepBlock title="3. Choose length">
              <div className="flex flex-wrap gap-2.5">
                {lengthOptions.map((l) => (
                  <TwoLineButton
                    key={l.id}
                    active={l.id === length}
                    label={l.label}
                    sub={l.sub}
                    onClick={() => onSelectLength(l.id)}
                  />
                ))}
              </div>
            </StepBlock>
            <button
              type="button"
              onClick={onStart}
              className="h-13 px-8 rounded-full bg-white text-primary font-semibold text-lg shadow-md w-fit mt-2 hover:bg-white/90 transition-colors"
              style={{ height: '52px' }}
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Layout A — centered card
  return (
    <div className="w-full relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 w-[360px] h-[360px] rounded-full"
        style={{ background: 'hsl(215 45% 30% / 0.06)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full"
        style={{ background: 'hsl(45 85% 60% / 0.08)' }}
      />
      <div className="max-w-[720px] mx-auto px-6 md:px-8 py-14 flex flex-col items-center gap-7 relative z-[1]">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
          Free Diagnostic Test
        </div>
        <h1 className="font-heading font-bold text-4xl md:text-5xl leading-tight text-center text-foreground">
          See exactly where your child stands
        </h1>
        <p className="text-base md:text-lg text-muted-foreground text-center max-w-xl leading-relaxed">
          A quick, level-appropriate assessment that shows strengths and gaps by topic — plus a free consultation with one of our tutors.
        </p>

        <div className="w-full bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md flex flex-col gap-6">
          <StepBlock title="1. Choose age group" centered>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {AGE_GROUPS.map((g) => (
                <TwoLineButton
                  key={g.id}
                  active={g.id === ageGroup}
                  label={g.label}
                  sub={g.sub}
                  onClick={() => onSelectAge(g.id)}
                />
              ))}
            </div>
          </StepBlock>
          <StepBlock title="2. Choose subject" centered>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {SUBJECTS.map((s) => (
                <PillButton
                  key={s.id}
                  active={s.id === subject}
                  label={s.label}
                  onClick={() => onSelectSubject(s.id)}
                />
              ))}
            </div>
          </StepBlock>
          <StepBlock title="3. Choose length" centered>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {lengthOptions.map((l) => (
                <TwoLineButton
                  key={l.id}
                  active={l.id === length}
                  label={l.label}
                  sub={l.sub}
                  onClick={() => onSelectLength(l.id)}
                />
              ))}
            </div>
          </StepBlock>
          <button
            type="button"
            onClick={onStart}
            className="h-[52px] px-8 rounded-full bg-primary text-primary-foreground font-semibold text-lg shadow-md self-center hover:bg-primary/90 transition-colors"
          >
            Start Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

function StepBlock({
  title,
  centered,
  children,
}: {
  title: string;
  centered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={cn(
          'font-bold text-base md:text-lg text-foreground mb-2.5',
          centered && 'text-center',
        )}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function TwoLineButton({
  active,
  label,
  sub,
  onClick,
}: {
  active: boolean;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-0.5 px-4 py-2.5 rounded-xl border transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:bg-primary/5',
      )}
    >
      <span className="font-semibold text-sm">{label}</span>
      <span className="text-xs opacity-80">{sub}</span>
    </button>
  );
}

function PillButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-5 py-2.5 rounded-full font-semibold text-sm border transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:bg-primary/5',
      )}
    >
      {label}
    </button>
  );
}
