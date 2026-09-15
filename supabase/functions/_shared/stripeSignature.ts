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
 * Idempotency gate for webhook processing. Production backs this with the
 * `stripe_processed_events` table (UNIQUE event_id primary key): exactly one
 * concurrent/duplicate delivery wins the claim.
 *
 * CRITICAL (fixed failure mode): the original design recorded the claim
 * BEFORE running work and never revised it — if fulfillment threw, the row
 * stayed, every Stripe retry returned "duplicate", and the order was never
 * fulfilled, silently. Now: claim → work → SETTLE. Failed work releases the
 * claim (status 'failed') so the next retry re-claims and re-runs. A crashed
 * worker's stale 'processing' claim is reclaimable after the takeover window.
 */
export interface WebhookClaimGate {
  /** Win (or re-win after failure) the right to process this event id. */
  claim(eventId: string): Promise<boolean>;
  /** Record the terminal outcome of the claimed attempt. */
  settle(eventId: string, ok: boolean, error?: string): Promise<void>;
}

export type ProcessOutcome = 'processed' | 'duplicate' | 'failed';

export async function processOnce(
  eventId: string,
  gate: WebhookClaimGate,
  work: () => Promise<void>,
): Promise<ProcessOutcome> {
  if (!(await gate.claim(eventId))) return 'duplicate';
  try {
    await work();
  } catch (err) {
    await gate.settle(eventId, false, err instanceof Error ? err.message : String(err));
    return 'failed';
  }
  await gate.settle(eventId, true);
  return 'processed';
}
