/**
 * Stripe webhook signature verification — pure WebCrypto implementation.
 * Runs identically in Deno (edge) and Node (vitest): no runtime-specific APIs.
 *
 * Verifies `Stripe-Signature` header (t=...,v1=...) against the RAW request
 * body using HMAC-SHA256 with the webhook secret. Constant-time compare.
 */

const DEFAULT_TOLERANCE_SECONDS = 300;

export interface VerifiedEvent {
  event: Record<string, unknown>;
  timestamp: number;
}

function timingSafeEqualHex(hexA: string, hexB: string): boolean {
  const a = hexA.toLowerCase();
  const b = hexB.toLowerCase();
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    // compare char codes of lowercase hex — constant-time-ish over fixed length
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string,
  opts: { nowSeconds?: number; toleranceSeconds?: number } = {},
): Promise<VerifiedEvent> {
  const nowSeconds = opts.nowSeconds ?? Math.floor(Date.now() / 1000);
  const tolerance = opts.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;

  if (!webhookSecret) throw new Error('Webhook secret not configured');
  if (!signatureHeader) throw new Error('Missing signature header');

  let timestamp: string | null = null;
  const candidates: string[] = [];
  for (const part of signatureHeader.split(',')) {
    const piece = part.trim();
    if (piece.startsWith('t=')) timestamp = piece.slice(2);
    else if (piece.startsWith('v1=')) candidates.push(piece.slice(3));
  }
  if (!timestamp || candidates.length === 0) throw new Error('Invalid signature format');
  if (!/^\d+$/.test(timestamp)) throw new Error('Invalid timestamp');

  // Replay protection: refuse stale signatures.
  if (Math.abs(nowSeconds - Number(timestamp)) > tolerance) throw new Error('Timestamp too old');

  const encoder = new TextEncoder();
  const cryptoObj = globalThis.crypto as Crypto | undefined;
  if (!cryptoObj?.subtle) throw new Error('WebCrypto unavailable');

  const key = await cryptoObj.subtle.importKey(
    'raw',
    encoder.encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const payload = `${timestamp}.${rawBody}`;
  const mac = new Uint8Array(await cryptoObj.subtle.sign('HMAC', key, encoder.encode(payload)));
  const expectedHex = Array.from(mac, (b) => b.toString(16).padStart(2, '0')).join('');

  const verified = candidates.some((candidate) => timingSafeEqualHex(candidate, expectedHex));
  if (!verified) throw new Error('Invalid signature');

  const event = JSON.parse(rawBody) as Record<string, unknown>;
  return { event, timestamp: Number(timestamp) };
}

/**
 * Idempotency gate for webhook processing. Production passes a `claim` backed
 * by a UNIQUE primary-key insert (stripe_processed_events); exactly one
 * concurrent/duplicate delivery wins.
 */
export async function processOnce(
  eventId: string,
  claim: (eventId: string) => Promise<boolean>,
  work: () => Promise<void>,
): Promise<'processed' | 'duplicate'> {
  const won = await claim(eventId);
  if (!won) return 'duplicate';
  await work();
  return 'processed';
}
