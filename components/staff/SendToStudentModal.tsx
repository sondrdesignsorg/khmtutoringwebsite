'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import type { Student } from '@/lib/staff/types';
import { Modal, ModalCloseButton } from './Modal';
import { RecipientPicker, type Recipient } from './RecipientPicker';

/**
 * Shared "send this resource to a student" dialog. Fetches the roster, lets
 * staff pick a saved student or a one-off email, and reports the result.
 */
export function SendToStudentModal({
  heading,
  subheading,
  onClose,
  onSend,
}: {
  heading: string;
  subheading: string;
  onClose: () => void;
  onSend: (recipient: Recipient) => Promise<{ recipient: string }>;
}) {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/staff/students')
      .then((res) => (res.ok ? res.json() : { students: [] }))
      .then((body: { students?: Student[] }) => { if (active) setStudents(body.students ?? []); })
      .catch(() => { if (active) setStudents([]); });
    return () => { active = false; };
  }, []);

  async function send() {
    if (!recipient) return;
    setSending(true);
    setError(null);
    try {
      const result = await onSend(recipient);
      setSentTo(result.recipient);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the email');
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal onClose={onClose} className="flex max-w-[440px] flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-[18px]">
        <div>
          <h3 className="font-heading text-2xl font-bold">{heading}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>
        </div>
        <ModalCloseButton onClose={onClose} />
      </div>

      <div className="px-6 py-5">
        {sentTo ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="flex size-[52px] items-center justify-center rounded-full bg-[hsl(160_60%_40%/0.12)] text-[hsl(160_60%_32%)]">
              <CheckCircle2 className="size-7" />
            </span>
            <p className="text-sm text-foreground">
              Sent to <strong>{sentTo}</strong>.
            </p>
          </div>
        ) : students === null ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : (
          <RecipientPicker students={students} onChange={setRecipient} />
        )}
        {error && <p className="mt-3 text-center text-xs text-destructive">{error}</p>}
      </div>

      <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
        <button onClick={onClose} className="inline-flex h-9 items-center rounded-md px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10">
          {sentTo ? 'Done' : 'Cancel'}
        </button>
        {!sentTo && (
          <button
            onClick={() => void send()}
            disabled={!recipient || sending || students === null}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {sending ? 'Sending…' : 'Send'}
          </button>
        )}
      </div>
    </Modal>
  );
}
