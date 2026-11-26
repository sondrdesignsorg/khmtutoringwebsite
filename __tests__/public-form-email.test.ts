import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST as submitContact } from '@/app/api/contact/route';
import { POST as submitDiagnostic } from '@/app/api/diagnostic/submit/route';
import { POST as submitGroupSat } from '@/app/api/group-sat/inquiry/route';

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('resend', () => ({ Resend: class { emails = { send }; } }));
vi.mock('@/lib/rate-limit', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/lib/rate-limit')>(),
  checkRateLimit: vi.fn().mockResolvedValue({ ok: true }),
}));
vi.mock('@/lib/diagnostic/leads', () => ({
  createDiagnosticLead: vi.fn().mockResolvedValue('diagnostic-id'),
  markDiagnosticLeadEmailed: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/lib/sat-group/inquiries', () => ({
  createGroupSatInquiry: vi.fn().mockResolvedValue('inquiry-id'),
  markGroupSatInquiryEmails: vi.fn().mockResolvedValue(undefined),
}));

const inbox = 'info@khmtutoring.com';
const parent = 'parent@example.com';
const phone = '(808) 555-0100';
const contact = {
  submissionId: 'ca1dcf8b-26d6-4ef7-98bd-b8baff7efb65',
  name: 'Test Parent', email: parent, phone, subject: 'math', message: '<b>First</b>\nSecond',
};

function request(path: string, data: object): Request {
  return new Request(`https://www.khmtutoring.com/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

describe('public form email routing', () => {
  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubEnv('RESEND_FROM_ADDRESS', 'website@example.com');
    vi.stubEnv('KHM_STAFF_EMAIL', 'staff@example.com');
    vi.stubEnv('FORM_SUBMISSION_EMAIL', 'previous-inbox@example.com');
    send.mockReset().mockResolvedValue({ error: null });
  });

  afterEach(() => vi.unstubAllEnvs());

  it('sends the full Contact inquiry to info and a separate confirmation to the visitor', async () => {
    const response = await submitContact(request('contact', { ...contact, to: 'other@example.com' }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, confirmationSent: true });
    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenNthCalledWith(1, expect.objectContaining({
      to: inbox, replyTo: parent, subject: 'New Website Inquiry: Mathematics',
      html: expect.stringContaining('&lt;b&gt;First&lt;/b&gt;<br>Second'),
    }), { idempotencyKey: `contact-inquiry/${contact.submissionId}` });
    expect(send).toHaveBeenNthCalledWith(2, expect.objectContaining({
      to: parent, replyTo: inbox, subject: 'We received your KHM Tutoring inquiry',
    }), { idempotencyKey: `contact-confirmation/${contact.submissionId}` });
    expect(send.mock.calls[1][0].html).not.toContain('First');
  });

  it('rejects contact spam before sending', async () => {
    const response = await submitContact(request('contact', { ...contact, website: 'https://example.com' }));

    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('sends no confirmation when KHM has not received the inquiry', async () => {
    send.mockResolvedValue({ error: { message: 'Provider rejected the send' } });
    const response = await submitContact(request('contact', contact));

    expect(response.status).toBe(502);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('preserves an accepted inquiry when the visitor confirmation fails', async () => {
    send.mockResolvedValueOnce({ error: null }).mockResolvedValueOnce({ error: { message: 'Provider rejected the send' } });
    const response = await submitContact(request('contact', contact));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, confirmationSent: false });
  });

  it('sends Group SAT staff notifications and parent replies to info', async () => {
    const response = await submitGroupSat(request('group-sat/inquiry', {
      parentName: 'Test Parent', studentName: 'Test Student', email: parent, phone,
      cohort: 'Sunday Strategy Cohort', formStartedAt: Date.now() - 10_000,
    }));

    expect(response.status).toBe(200);
    expect(send.mock.calls.map(([message]) => [message.to, message.replyTo])).toEqual([
      [parent, inbox], [inbox, parent],
    ]);
  });

  it('sends diagnostic staff notifications and parent replies to info', async () => {
    const response = await submitDiagnostic(request('diagnostic/submit', {
      parentName: 'Test Parent', studentName: 'Test Student', email: parent, phone,
      ageGroup: 'middle', subject: 'math', length: 1, score: 100, tier: 'Excelling',
      topicBreakdown: [{ topic: 'Algebra', correct: 1, total: 1, pct: 100, strong: true }],
    }));

    expect(response.status).toBe(200);
    expect(send.mock.calls.map(([message]) => [message.to, message.replyTo])).toEqual([
      [parent, inbox], [inbox, parent],
    ]);
  });
});
