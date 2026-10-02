/**
 * Pure request-hardening helpers shared by checkout edge functions (Deno)
 * and vitest (Node). No runtime APIs beyond the Web `Headers` standard.
 */

const IP_MAX_LEN = 64;
const IP_SHAPE = /^[0-9a-fA-F:.]+$/;

function isIpShaped(value: string): boolean {
  return Boolean(value) && value.length <= IP_MAX_LEN && IP_SHAPE.test(value);
}

/**
 * Best-effort client IP for rate-limit bucketing.
 *
 * `x-forwarded-for` is a client-settable request header. A naive read of its
 * FIRST entry — the conventional "left-most = original client" assumption —
 * is therefore attacker-controlled: sending a different `X-Forwarded-For` on
 * each request gives every request its own rate-limit bucket, so the limiter
 * can be bypassed with a one-line curl loop. That is the opposite of what a
 * rate limiter is for.
 *
 * Proxies APPEND to the header, so the RIGHT-most entry is the one written by
 * the closest trusted hop and cannot be overridden by the caller. That is what
 * we read here.
 *
 * `cf-connecting-ip` is preferred when present: behind Cloudflare it is
 * overwritten by the edge and is not client-forgeable.
 *
 * Never throws and never returns long attacker-controlled blobs. Anything
 * malformed collapses to "unknown" — a single shared bucket, which is the safe
 * direction: junk keys must not each get an unlimited personal budget.
 */
export function clientIp(headers: Headers): string {
  const cf = (headers.get('cf-connecting-ip') || '').trim();
  if (isIpShaped(cf)) return cf;

  const chain = (headers.get('x-forwarded-for') || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  // Right-most first: the entry appended by the nearest trusted proxy.
  for (let i = chain.length - 1; i >= 0; i--) {
    if (isIpShaped(chain[i])) return chain[i];
  }
  return 'unknown';
}

/** Length-hiding constant-time string comparison for shared secrets. */
export function constantTimeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const encoder = new TextEncoder();
  const ba = encoder.encode(a);
  const bb = encoder.encode(b);
  const len = Math.max(ba.length, bb.length);
  let diff = ba.length ^ bb.length;
  for (let i = 0; i < len; i++) {
    diff |= (ba[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}
