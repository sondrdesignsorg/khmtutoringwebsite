'use client';

import { useState } from 'react';
import { GraduationCap, Mail, UserRound } from 'lucide-react';
import type { Student } from '@/lib/staff/types';
import { StaffSelect } from './StaffSelect';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface Recipient {
  studentId?: string;
  email?: string;
}

/**
 * Choose who receives a worksheet or packet: a saved student from the roster
 * or a one-off email address. Fully controlled through `onChange`.
 */
export function RecipientPicker({
  students,
  onChange,
}: {
  students: Student[];
  onChange: (recipient: Recipient | null) => void;
}) {
  const [mode, setMode] = useState<'student' | 'custom'>(students.length ? 'student' : 'custom');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');

  function pickStudent(id: string) {
    setStudentId(id);
    onChange(id ? { studentId: id } : null);
  }

  function typeEmail(value: string) {
    setEmail(value);
    onChange(value.trim() ? { email: value.trim() } : null);
  }

  function studentMode() {
    setMode('student');
    onChange(studentId ? { studentId } : null);
  }

  function customMode() {
    setMode('custom');
    onChange(email.trim() ? { email: email.trim() } : null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <ModeButton
          active={mode === 'student'}
          disabled={students.length === 0}
          onClick={studentMode}
          icon={<GraduationCap className="size-4" />}
          title="Saved student"
        />
        <ModeButton
          active={mode === 'custom'}
          onClick={customMode}
          icon={<Mail className="size-4" />}
          title="One-off email"
        />
      </div>

      {mode === 'student' ? (
        students.length > 0 ? (
          <StaffSelect
            value={studentId}
            onChange={pickStudent}
            options={[
              { value: '', label: 'Select a student…' },
              ...students.map((s) => ({
                value: s.id,
                label: s.email ? `${s.name} — ${s.email}` : `${s.name} (no email)`,
              })),
            ]}
            className="[&>select]:h-10"
          />
        ) : (
          <p className="rounded-md border border-dashed border-border px-3 py-2.5 text-xs text-muted-foreground">
            No students saved yet. Add them under <strong>Students</strong>, or send to a one-off email.
          </p>
        )
      ) : (
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            value={email}
            onChange={(e) => typeEmail(e.target.value)}
            placeholder="student@example.com"
            className="h-10 pl-9"
          />
        </div>
      )}
    </div>
  );
}

function ModeButton({
  active, disabled, onClick, icon, title,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40',
        active ? 'border-primary bg-primary/[0.06] text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/40',
      )}
    >
      {icon}{title}
    </button>
  );
}
