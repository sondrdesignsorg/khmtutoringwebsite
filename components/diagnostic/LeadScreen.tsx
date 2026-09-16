'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface Props {
  parentName: string;
  studentName: string;
  studentGrade: string;
  email: string;
  phone: string;
  error: string;
  emailFieldError?: boolean;
  summary: string;
  onChangeField: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function LeadScreen({
  parentName,
  studentName,
  email,
  phone,
  error,
  emailFieldError,
  summary,
  onChangeField,
  onSubmit,
  onBack,
}: Props) {
  return (
    <div className="w-full flex items-center justify-center py-12 px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="w-full max-w-[480px] bg-card border border-border rounded-3xl shadow-md p-8 md:p-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
          {summary}
        </div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
          Almost there
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-7">
          Tell us a bit about your child so we can send you the full results, including a topic-by-topic breakdown.
        </p>

        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="parentName" className="text-sm">
              Parent / Guardian Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="parentName"
              type="text"
              value={parentName}
              onChange={(e) => onChangeField('parentName', e.target.value)}
              placeholder="Jane Kim"
              className="h-11"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="studentName" className="text-sm">
              Student Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="studentName"
              type="text"
              value={studentName}
              onChange={(e) => onChangeField('studentName', e.target.value)}
              placeholder="Kai Kim"
              className="h-11"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onChangeField('email', e.target.value)}
              placeholder="jane@email.com"
              className="h-11"
              required
              aria-required="true"
              aria-invalid={emailFieldError || undefined}
            />
            {emailFieldError && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                Email is required to receive your results.
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm">
              Phone (optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => onChangeField('phone', e.target.value)}
              placeholder="(808) 555-0100"
              className="h-11"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="h-12 px-5 rounded-full bg-transparent text-foreground font-semibold text-base border border-border hover:bg-primary/5 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 h-12 px-5 rounded-full bg-primary text-primary-foreground font-semibold text-base shadow-md hover:bg-primary/90 transition-colors"
          >
            Begin Test
          </button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground text-center">
          We&apos;ll never share your information. Used only to send test results and tutoring guidance.
        </p>
      </form>
    </div>
  );
}
