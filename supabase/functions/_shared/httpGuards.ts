/**
 * Pure request-hardening helpers shared by checkout edge functions (Deno)
 * and vitest (Node). No runtime APIs beyond the Web `Headers` standard.
 */

const IP_MAX_LEN = 64;
const IP_SHAPE = /^[0-9a-fA-F:.]+$/;

/**
 * Best-effort client IP for rate-limit bucketing on the Supabase edge
 * (Fly.io sets x-forwarded-for; Cloudflare proxy sets cf-connecting-ip).
 * Never throws, never returns long attacker-controlled blobs: anything
 * malformed is collapsed to "unknown" (a shared bucket, which is SAFER —
 * garbage keys don't get unlimited individual budgets).
 */
export function clientIp(headers: Headers): string {
  const candidate =
    headers.get('cf-connecting-ip') ??
    (headers.get('x-forwarded-for') || '').split(',')[0]?.trim();
  if (!candidate || candidate.length > IP_MAX_LEN || !IP_SHAPE.test(candidate)) return 'unknown';
  return candidate;
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
