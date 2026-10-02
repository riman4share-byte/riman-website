/**
 * Cookie consent, as a single observable source of truth.
 *
 * The banner in GlobalFeatures wrote `riman_cookie_consent` to localStorage,
 * and SEOHead injected GA / Plausible / Fathom with no reference to it at all.
 * A visitor who clicked "reject" was tracked anyway — which is the exact thing
 * GDPR and UAE PDPL consent is supposed to prevent, and it only becomes
 * visible the moment someone pastes a real GA id into Admin Settings.
 *
 * This module owns the flag. Non-essential analytics reads it before loading;
 * the banner writes it through `setCookieConsent`, which notifies subscribers
 * so an already-open tab starts tracking the moment consent is granted instead
 * of requiring a refresh.
 *
 * `storage` events cover the other-tab case; a same-tab `CustomEvent` covers
 * the user clicking "accept" right here.
 */

export const COOKIE_CONSENT_KEY = 'riman_cookie_consent';

export type ConsentState = 'accepted' | 'rejected' | 'unknown';

const EVENT_NAME = 'riman:cookie-consent';

function read(): ConsentState {
  try {
    const value = localStorage.getItem(COOKIE_CONSENT_KEY);
    return value === 'accepted' || value === 'rejected' ? value : 'unknown';
  } catch {
    // Private mode / storage disabled. Treat as "not yet chosen" so the banner
    // still appears; never default to granted.
    return 'unknown';
  }
}

export function getCookieConsent(): ConsentState {
  if (typeof window === 'undefined') return 'unknown';
  return read();
}

/**
 * Has the visitor already been asked and answered?
 *
 * Deliberately looser than `getCookieConsent`: any stored value counts as a
 * decision, including the bare 'true' written by older builds. Otherwise every
 * returning visitor from a previous version would be shown the banner again.
 */
export function hasCookieDecision(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(localStorage.getItem(COOKIE_CONSENT_KEY));
  } catch {
    return false;
  }
}

/** True only on an explicit "accept". Unknown and rejected are both false. */
export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === 'accepted';
}

export function setCookieConsent(state: 'accepted' | 'rejected'): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, state);
  } catch {
    // Nothing to do: the in-memory subscribers still update below.
  }
  if (typeof window === 'undefined') return;
  // Only the same-tab event is dispatched here. Browsers fire a real
  // `storage` event in *other* tabs automatically; synthesising one in this
  // tab as well would deliver every change twice to every subscriber.
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: state }));
}

/** Subscribe to consent changes from this tab and from other tabs. */
export function subscribeToCookieConsent(onChange: (state: ConsentState) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => onChange(read());
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
