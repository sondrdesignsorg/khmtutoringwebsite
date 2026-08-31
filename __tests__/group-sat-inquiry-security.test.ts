import { describe, expect, it } from 'vitest';
import {
  escapeHtml,
  GroupSatInquirySchema,
  hasGeneratedTextSpam,
  isPlausibleInquiryTiming,
  safeEmailSubject,
} from '@/lib/sat-group/inquiry-security';

const validInquiry = {
  parentName: 'Keoni Smith',
  studentName: 'Malia Smith',
  email: 'parent@example.com',
  phone: '(808) 555-1234',
  grade: '11',
  cohort: 'Sunday Strategy Cohort',
  satDate: '2026-10-03',
  currentScore: '1180',
  goals: 'Improve math pacing',
  notes: '',
  website: '',
  formStartedAt: Date.now() - 10_000,
};

describe('group SAT inquiry validation', () => {
  it('accepts a normal inquiry', () => {
    expect(GroupSatInquirySchema.safeParse(validInquiry).success).toBe(true);
  });

  it('rejects the random-string spam pattern received in production', () => {
    const spam = {
      ...validInquiry,
      parentName: 'jPDAJFTMBzTGXDAFNA',
      studentName: 'nnXNDXLCIeLBNczUnDbSVQiW',
      phone: 'OXunGqAlUqOKvsIubaP',
      grade: 'pqRkGXZZpirviOplvlCLX',
      satDate: 'exfFJiGjPMBqbqUOVFrZXK',
    };
    expect(GroupSatInquirySchema.safeParse(spam).success).toBe(false);
    expect(hasGeneratedTextSpam(spam)).toBe(true);
  });

  it('does not flag ordinary names and prose as generated spam', () => {
    expect(hasGeneratedTextSpam(validInquiry)).toBe(false);
  });

  it('rejects a populated honeypot and unexpected fields', () => {
    expect(GroupSatInquirySchema.safeParse({ ...validInquiry, website: 'spam.example' }).success).toBe(false);
    expect(GroupSatInquirySchema.safeParse({ ...validInquiry, botField: 'value' }).success).toBe(false);
  });

  it('rejects submissions that are too fast or stale', () => {
    const now = 2_000_000_000_000;
    expect(isPlausibleInquiryTiming(now - 2_999, now)).toBe(false);
    expect(isPlausibleInquiryTiming(now - 3_000, now)).toBe(true);
    expect(isPlausibleInquiryTiming(now - 24 * 60 * 60 * 1_000 - 1, now)).toBe(false);
  });
});

describe('group SAT email safety', () => {
  it('escapes untrusted HTML fields', () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe(
      '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;',
    );
  });

  it('removes header-breaking newlines from subjects', () => {
    expect(safeEmailSubject('Student\r\nBcc: attacker@example.com')).toBe(
      'Student Bcc: attacker@example.com',
    );
  });
});
