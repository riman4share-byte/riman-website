import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  COOKIE_CONSENT_KEY,
  getCookieConsent,
  hasAnalyticsConsent,
  setCookieConsent,
  subscribeToCookieConsent,
} from './consent';

describe('cookie consent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('treats a missing value as unknown, never as consent', () => {
    expect(getCookieConsent()).toBe('unknown');
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it('grants analytics only on an explicit accept', () => {
    setCookieConsent('accepted');
    expect(getCookieConsent()).toBe('accepted');
    expect(hasAnalyticsConsent()).toBe(true);
  });

  it('refuses analytics after an explicit reject', () => {
    setCookieConsent('rejected');
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it('refuses analytics for any value that is not exactly "accepted"', () => {
    // The old banner test wrote 'true'. A truthy-but-not-'accepted' value must
    // not be treated as consent, or a sloppy write re-opens the tracker.
    for (const value of ['true', 'yes', '1', 'ACCEPTED', '']) {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
      expect(hasAnalyticsConsent()).toBe(false);
    }
  });

  it('notifies subscribers when consent is granted', () => {
    const seen: string[] = [];
    const unsubscribe = subscribeToCookieConsent((s) => seen.push(s));
    setCookieConsent('rejected');
    setCookieConsent('accepted');
    unsubscribe();
    setCookieConsent('rejected');
    expect(seen).toEqual(['rejected', 'accepted']);
  });

  it('survives storage being unavailable', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    // Must not throw: the banner still has to close and the UI must not crash.
    expect(() => setCookieConsent('accepted')).not.toThrow();
    expect(hasAnalyticsConsent()).toBe(false);
    spy.mockRestore();
  });
});
