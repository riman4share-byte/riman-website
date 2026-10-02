import { describe, it, expect } from 'vitest';
import { clientIp, constantTimeEqual } from '../../supabase/functions/_shared/httpGuards';

const headers = (init: Record<string, string>) => new Headers(init);

describe('clientIp', () => {
  it('prefers cf-connecting-ip, which Cloudflare overwrites at the edge', () => {
    expect(clientIp(headers({ 'cf-connecting-ip': '1.1.1.1', 'x-forwarded-for': '2.2.2.2, 3.3.3.3' }))).toBe('1.1.1.1');
  });

  it('reads the RIGHT-most x-forwarded-for hop, not the client-supplied left-most', () => {
    // Proxies append, so the right-most entry is written by the nearest
    // trusted hop. Reading the left-most (the old behaviour) let a caller mint
    // a fresh rate-limit bucket per request by varying this header.
    expect(clientIp(headers({ 'x-forwarded-for': '4.4.4.4, 5.5.5.5' }))).toBe('5.5.5.5');
    expect(clientIp(headers({ 'x-forwarded-for': ' 6.6.6.6 , 7.7.7.7 ' }))).toBe('7.7.7.7');
  });

  it('cannot be given a fresh bucket by prepending spoofed hops', () => {
    // The realistic bypass: the caller prepends a fresh value and hopes the
    // limiter reads it. The real proxy still appends the true client IP, so
    // right-most reading pins the bucket to the same key every time.
    const real = '203.0.113.7';
    const a = clientIp(headers({ 'x-forwarded-for': `1.2.3.4, ${real}` }));
    const b = clientIp(headers({ 'x-forwarded-for': `9.9.9.9, ${real}` }));
    expect(a).toBe(real);
    expect(b).toBe(real);
  });

  it('accepts a single well-formed hop, which is indistinguishable from a direct request', () => {
    // Documented limitation, not an oversight: with one hop there is no way to
    // tell a genuine direct request from a caller that sent only XFF. The
    // right-most rule is what closes the multi-hop bypass above.
    expect(clientIp(headers({ 'x-forwarded-for': '1.2.3.4' }))).toBe('1.2.3.4');
  });

  it('skips malformed hops rather than falling back to a poisoned left-most', () => {
    expect(clientIp(headers({ 'x-forwarded-for': 'attacker-controlled, 8.8.8.8' }))).toBe('8.8.8.8');
    expect(clientIp(headers({ 'x-forwarded-for': '1.1.1.1, garbage-value!' }))).toBe('1.1.1.1');
  });

  it('returns unknown when there is nothing usable', () => {
    expect(clientIp(headers({}))).toBe('unknown');
  });

  it('rejects absurd header values (never used as a key blob)', () => {
    expect(clientIp(headers({ 'x-forwarded-for': 'x'.repeat(300) }))).toBe('unknown');
    expect(clientIp(headers({ 'cf-connecting-ip': 'x'.repeat(300) }))).toBe('unknown');
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
