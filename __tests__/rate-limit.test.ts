import { describe, it, expect } from 'vitest';
import { clientIp } from '@/lib/rate-limit';

function reqWith(headers: Record<string, string>): Request {
  return new Request('https://example.com/', { headers });
}

describe('clientIp', () => {
  it('takes the first hop from x-forwarded-for', () => {
    expect(clientIp(reqWith({ 'x-forwarded-for': '203.0.113.5, 10.0.0.1' }))).toBe('203.0.113.5');
  });

  it('falls back to x-real-ip', () => {
    expect(clientIp(reqWith({ 'x-real-ip': '198.51.100.7' }))).toBe('198.51.100.7');
  });

  it('returns unknown when no proxy headers are present', () => {
    expect(clientIp(reqWith({}))).toBe('unknown');
  });
});
