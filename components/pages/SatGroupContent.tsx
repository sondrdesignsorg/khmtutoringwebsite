'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Brain,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Mail,
  ShieldCheck,
  Target,
  TimerReset,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TARGET_START = 'September 6, 2026';
const TOTAL_HOURS = 20;

const schedules = [
  {
    name: 'Sunday Strategy Cohort',
    days: 'Sundays',
    time: '10:00 AM - 12:00 PM HST',
    enrolled: 3,
    capacity: 8,
  },
  {
    name: 'Weekday After-School Cohort',
    days: 'Tuesday & Thursday',
    time: '4:30 PM - 5:30 PM HST',
    enrolled: 4,
    capacity: 8,
  },
  {
    name: 'Evening Practice Cohort',
    days: 'Monday & Wednesday',
    time: '6:30 PM - 7:30 PM HST',
    enrolled: 2,
    capacity: 8,
  },
];

const pillars = [
  {
    icon: TimerReset,
    title: 'Real Test Rhythm',
    desc: 'Timed sets, pacing decisions, and pressure practice help students feel less surprised when test day arrives.',
  },
  {
    icon: Target,
    title: 'Strategy First',
    desc: 'Students learn when to skip, eliminate, estimate, backsolve, and protect time instead of treating every question the same way.',
  },
  {
    icon: Brain,
    title: 'Hidden SAT Patterns',
    desc: 'Instruction explores the traps, shortcuts, and question designs students usually do not notice on their own.',
  },
  {
    icon: Users,
    title: 'Cohort Fit',
    desc: 'KHM forms groups with attention to current level, goals, work habits, and classroom harmony.',
  },
  {
    icon: ShieldCheck,
    title: 'Calmer Test Day',
    desc: 'Students rehearse the decisions that create nerves: timing, uncertainty, endurance, and recovery after a hard question.',
  },
  {
    icon: Award,
    title: '20 Hours Total',
    desc: 'Families pay for the full session: a complete 20-hour block of live instruction and guided SAT practice.',
  },
];

const flow = [
  {
    step: '01',
    title: 'Submit the fit form',
    desc: 'Tell us the student\'s grade, current level, goals, and schedule preferences.',
  },
  {
    step: '02',
    title: 'KHM builds cohorts',
    desc: 'Groups are organized around level, readiness, schedule, and the students who will work well together.',
  },
  {
    step: '03',
    title: 'Start the 20-hour session',
    desc: `Target start date: ${TARGET_START}. Final cohort details are coordinated by email.`,
  },
];

const faqs = [
  {
    q: 'How many students are in a cohort?',
    a: 'Each cohort is planned for 6-8 students. That size gives students enough peer energy to simulate a testing environment while staying small enough for the instructor to adjust pacing and examples.',
  },
  {
    q: 'How are students placed into cohorts?',
    a: 'KHM looks at schedule, current score or diagnostic level, grade, goals, and group fit. The goal is not just to fill seats; it is to create a cohort where students can move at a productive pace together.',
  },
  {
    q: 'What does the full session include?',
    a: 'The session is 20 total hours of live SAT instruction. It includes content review, timed practice, test-taking strategy, question pattern recognition, and discussion of the SAT topics students often do not know to study.',
  },
  {
    q: 'Is this mostly content review or strategy?',
    a: 'Both. Students still need math, grammar, reading, and data-analysis skills, but the program also emphasizes the decisions that affect scores under time pressure: pacing, elimination, guessing, section management, and recovery after difficult questions.',
  },
  {
    q: 'Will there be weekday morning sessions?',
    a: 'No. Weekday cohorts are scheduled after school or in the evening. Weekend cohorts may include morning or midday options.',
  },
  {
    q: 'What happens after I submit the form?',
    a: 'Submitting the form sends a confirmation to your email and notifies KHM. Final cohort placement and scheduling details will be coordinated by email once KHM has reviewed the fit.',
  },
];

const initialForm = {
  parentName: '',
  studentName: '',
  email: '',
  phone: '',
  grade: '',
  cohort: schedules[0].name,
  satDate: '',
  currentScore: '',
  goals: '',
  notes: '',
};

type FormState = typeof initialForm;

function CohortProgress({ enrolled, capacity }: { enrolled: number; capacity: number }) {
  const pct = Math.round((enrolled / capacity) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span>{enrolled} students matched</span>
        <span>{capacity - enrolled} seats open</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-muted-foreground">Cohorts are built for 6-8 students.</p>
    </div>
  );
}

export function SatGroupContent() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'sent' | 'pending'>('pending');
  const [error, setError] = useState('');

  const selectedCohort = useMemo(
    () => schedules.find((cohort) => cohort.name === form.cohort) ?? schedules[0],
    [form.cohort],
  );

  function updateField(field: keyof FormState, value: string) {
    setError('');
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/group-sat/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: form.phone || null,
          grade: form.grade || null,
          satDate: form.satDate || null,
          currentScore: form.currentScore || null,
          goals: form.goals || null,
          notes: form.notes || null,
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || 'Could not submit the form.');
      }

      const body = (await res.json()) as { emailed?: boolean };
      setEmailStatus(body.emailed ? 'sent' : 'pending');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit the form.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="pt-20">
      <section className="bg-gradient-to-b from-primary/5 via-background to-background py-14 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700">
            <Zap className="h-3.5 w-3.5" />
            Target Start: {TARGET_START}
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            SAT Prep That Feels Like the Test
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Small cohorts work through SAT content, timing, and decision-making in a live setting so students build the habits they need before test day.
          </p>
          <div className="mb-10 flex flex-wrap justify-center gap-6">
            {[
              { icon: Users, label: '6-8 Students', sub: 'matched by fit' },
              { icon: Clock, label: `${TOTAL_HOURS} Hours`, sub: 'full session' },
              { icon: Target, label: 'Strategy Heavy', sub: 'timing and traps' },
              { icon: Calendar, label: 'Evenings & Weekends', sub: '3 windows available' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">{sub}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="px-8 text-base">
              <Link href="#apply">
                Submit Fit Form
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 text-base">
              <Link href="#schedule">View Cohorts</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Program Focus</p>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Built Around What Changes SAT Scores</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              The class environment is intentional: students practice content and strategy with enough structure to reduce nerves and enough flexibility to meet the cohort where it is.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/30 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-14 md:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">How Placement Works</p>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Cohorts Are Organized, Not Just Filled</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {flow.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                  {step}
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="schedule" className="bg-white py-14 md:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Available Cohorts</p>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Tentative Session Windows</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Final cohorts will be coordinated by email after KHM reviews level, goals, and group fit. Weekday morning sessions are not offered.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {schedules.map((cohort) => (
              <div key={cohort.name} className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6">
                <h3 className="text-lg font-bold leading-tight text-foreground">{cohort.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="font-medium">{cohort.days}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{cohort.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{TOTAL_HOURS} total hours</span>
                  </div>
                </div>
                <CohortProgress enrolled={cohort.enrolled} capacity={cohort.capacity} />
                <Button asChild variant="outline" className="mt-auto w-full">
                  <Link href="#apply" onClick={() => updateField('cohort', cohort.name)}>
                    Choose This Window
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="bg-gradient-to-b from-primary/5 to-background py-14 md:py-20">
        <div className="container mx-auto grid max-w-5xl gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Fit Form</p>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Tell Us Where Your Student Is Starting</h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              This form gives KHM enough context to place students thoughtfully. Submit it and KHM will follow up by email once cohorts are organized.
            </p>
            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                Current selection
              </div>
              <p className="font-bold text-foreground">{selectedCohort.name}</p>
              <p className="text-sm text-muted-foreground">{selectedCohort.days} at {selectedCohort.time}</p>
            </div>
          </div>

          <form onSubmit={submitInquiry} className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-7">
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-foreground">Form received</h3>
                <p className="max-w-md text-muted-foreground">
                  {emailStatus === 'sent'
                    ? 'KHM has the cohort-fit details. A confirmation was sent to your email and KHM has been notified.'
                    : 'KHM has the cohort-fit details. KHM will follow up by email to coordinate final scheduling.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Parent name" value={form.parentName} onChange={(value) => updateField('parentName', value)} required />
                  <Field label="Student name" value={form.studentName} onChange={(value) => updateField('studentName', value)} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} required />
                  <Field label="Phone" value={form.phone} onChange={(value) => updateField('phone', value)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Grade" value={form.grade} onChange={(value) => updateField('grade', value)} />
                  <Field label="Target SAT date" value={form.satDate} onChange={(value) => updateField('satDate', value)} />
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-foreground">Preferred cohort</span>
                  <select
                    value={form.cohort}
                    onChange={(event) => updateField('cohort', event.target.value)}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                  >
                    {schedules.map((cohort) => (
                      <option key={cohort.name} value={cohort.name}>{cohort.name}</option>
                    ))}
                  </select>
                </label>
                <Field label="Current score or diagnostic level" value={form.currentScore} onChange={(value) => updateField('currentScore', value)} placeholder="Example: PSAT 1180, no score yet, math stronger than reading" />
                <Textarea label="SAT goals" value={form.goals} onChange={(value) => updateField('goals', value)} placeholder="Score goal, target colleges, sections that feel hardest..." />
                <Textarea label="Anything KHM should know for cohort fit?" value={form.notes} onChange={(value) => updateField('notes', value)} placeholder="Schedule constraints, learning style, friend requests, nerves around testing..." />
                {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{error}</p>}
                <Button type="submit" size="lg" className="w-full text-base" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Fit Form'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">FAQs</p>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Questions Parents Ask First</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group overflow-hidden rounded-2xl border border-border bg-background">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-foreground transition-colors hover:bg-muted/30">
                  <span>{q}</span>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <div className="border-t border-border px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-14 text-primary-foreground md:py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-5 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">A More Practical Way to Prepare</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-white/80">
            The goal is not just more SAT practice. It is a student who knows what to do when the clock is running and the question is unfamiliar.
          </p>
          <Button asChild size="lg" className="bg-white px-8 text-base font-semibold text-primary hover:bg-white/90">
            <Link href="#apply">
              Start the Fit Form
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}{required ? ' *' : ''}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      />
    </label>
  );
}
