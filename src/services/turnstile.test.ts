import { describe, it, expect, vi } from 'vitest';
import { verifyTurnstileToken, parseTurnstileResult } from '../../supabase/functions/_shared/turnstile';

describe('parseTurnstileResult (pure)', () => {
  it('passes only when success=true and no error-codes', () => {
    expect(parseTurnstileResult({ success: true })).toBe(true);
    expect(parseTurnstileResult({ success: false, 'error-codes': ['invalid-input-response'] })).toBe(false);
    expect(parseTurnstileResult({ success: 'yes' })).toBe(false);
    expect(parseTurnstileResult(null)).toBe(false);
    expect(parseTurnstileResult('str')).toBe(false);
  });
});

describe('verifyTurnstileToken', () => {
  const okFetch = vi.fn(async () => ({
    ok: true,
    json: async () => ({ success: true }),
  })) as unknown as typeof fetch;

  it('returns false when secret or token missing (fail closed)', async () => {
    expect(await verifyTurnstileToken({ token: '', secret: 's', ip: '1.2.3.4', fetchImpl: okFetch })).toBe(false);
    expect(await verifyTurnstileToken({ token: 't', secret: '', ip: '1.2.3.4', fetchImpl: okFetch })).toBe(false);
  });

  it('posts token+secret+ip to siteverify and passes on success', async () => {
    const calls: Array<{ url: string; body: string }> = [];
    const fetchImpl = (async (url: string, init: RequestInit) => {
      calls.push({ url: String(url), body: String(init.body) });
      return { ok: true, json: async () => ({ success: true }) };
    }) as unknown as typeof fetch;

    expect(await verifyTurnstileToken({ token: 'tok', secret: 'sec', ip: '9.9.9.9', fetchImpl })).toBe(true);
    expect(calls[0].url).toContain('siteverify');
    expect(calls[0].body).toContain('secret=sec');
    expect(calls[0].body).toContain('response=tok');
    expect(calls[0].body).toContain('remoteip=9.9.9.9');
  });

  it('returns false on rejection, bad HTTP status, or network throw', async () => {
    const reject = (async () => ({ ok: true, json: async () => ({ success: false, 'error-codes': ['bad'] }) })) as unknown as typeof fetch;
    expect(await verifyTurnstileToken({ token: 't', secret: 's', ip: '', fetchImpl: reject })).toBe(false);

    const http500 = (async () => ({ ok: false, json: async () => ({}) })) as unknown as typeof fetch;
    expect(await verifyTurnstileToken({ token: 't', secret: 's', ip: '', fetchImpl: http500 })).toBe(false);

    const boom = (async () => { throw new Error('network'); }) as unknown as typeof fetch;
    expect(await verifyTurnstileToken({ token: 't', secret: 's', ip: '', fetchImpl: boom })).toBe(false);
  });
});
