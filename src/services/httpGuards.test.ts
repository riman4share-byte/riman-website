import { describe, it, expect } from 'vitest';
import { clientIp, constantTimeEqual } from '../../supabase/functions/_shared/httpGuards';

const headers = (init: Record<string, string>) => new Headers(init);

describe('clientIp', () => {
  it('prefers cf-connecting-ip, then first x-forwarded-for hop, else unknown', () => {
    expect(clientIp(headers({ 'cf-connecting-ip': '1.1.1.1', 'x-forwarded-for': '2.2.2.2, 3.3.3.3' }))).toBe('1.1.1.1');
    expect(clientIp(headers({ 'x-forwarded-for': ' 4.4.4.4 , 5.5.5.5 ' }))).toBe('4.4.4.4');
    expect(clientIp(headers({}))).toBe('unknown');
  });

  it('rejects absurd header values (never used as a key blob)', () => {
    expect(clientIp(headers({ 'x-forwarded-for': 'x'.repeat(300) }))).toBe('unknown');
  });
});

describe('constantTimeEqual', () => {
  it('compares strings without early-exit on length-equal inputs', () => {
    expect(constantTimeEqual('abc123', 'abc123')).toBe(true);
    expect(constantTimeEqual('abc123', 'abc124')).toBe(false);
    expect(constantTimeEqual('abc', 'abcd')).toBe(false);
    expect(constantTimeEqual('', '')).toBe(false); // empty secrets never match
  });
});
