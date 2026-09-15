/**
 * Cloudflare Turnstile server-side verification (shared, dependency-free).
 *
 * Security contract: captcha is only a gate if the TOKEN IS VERIFIED BY THE
 * SERVER. `verifyTurnstileToken` fails CLOSED: missing inputs, non-success
 * responses or network errors all return false.
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Pure interpretation of a siteverify JSON body. */
export function parseTurnstileResult(body: unknown): boolean {
  if (!isPlainObject(body)) return false;
  return body.success === true && !Array.isArray(body['error-codes']) && !('error-codes' in body);
}

export async function verifyTurnstileToken(input: {
  token: string | undefined | null;
  secret: string;
  ip: string;
  fetchImpl?: typeof fetch;
}): Promise<boolean> {
  const { token, secret, ip } = input;
  if (!secret || !token || typeof token !== 'string' || token.length > 4096) return false;
  const doFetch = input.fetchImpl ?? fetch;
  try {
    const form = new URLSearchParams({ secret, response: token });
    if (ip && ip !== 'unknown') form.set('remoteip', ip);
    const res = await doFetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    if (!res.ok) return false;
    return parseTurnstileResult(await res.json());
  } catch {
    return false;
  }
}
