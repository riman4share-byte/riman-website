// Supabase Edge Function: stripe-webhook
// Deploy: supabase functions deploy stripe-webhook --no-verify-jwt
// Secrets: supabase secrets set STRIPE_SECRET_KEY=sk_xxx STRIPE_WEBHOOK_SECRET=whsec_xxx
//          supabase secrets set ADMIN_ALERT_EMAIL=hello@riman.ae
// Stripe webhook endpoint: https://your-project.supabase.co/functions/v1/stripe-webhook
//   Events: checkout.session.completed, checkout.session.expired,
//           charge.refunded, refund.created, charge.dispute.created
//
// SECURITY MODEL:
//  - Signature is verified over the RAW body (WebCrypto HMAC) with a 5-minute
//    replay window. Forged/tampered payloads are rejected with 401.
//  - claim → work → SETTLE via claim_stripe_event / settle_stripe_event RPCs:
//    finished events can never re-fulfill, but FAILED work is reclaimable so
//    Stripe retries actually fix the order (the old insert-only ledger turned
//    a transient DB error into a permanently unfulfilled order).
//  - Fulfillment transitions an order only from 'processing' → 'paid' and
//    only when the (trusted, signature-verified) event metadata references
//    that order. Amounts are never recomputed from webhook metadata.
//  - Amount mismatch against the server snapshot does NOT just log: the
//    order flips to 'needs_review' and an admin alert is queued.
//  - Rental windows paid by card become confirmed bookings here (created as
//    'pending_payment' at checkout). The DB exclusion constraint makes a
//    double-book race impossible; a violation flags 'needs_review', it does
//    not retry-loop.
//  - Refunds and disputes are matched via the PaymentIntent recorded at
//    fulfillment (refund events do not carry session metadata). A FULL refund
//    marks the order refunded and releases the rental window; a partial refund
//    keeps it, because the garment is still out with the customer.
//  - Client-facing responses are generic.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyStripeSignature, processOnce, type WebhookClaimGate } from '../_shared/stripeSignature.ts';
import {
  extractWebhookOrderRef,
  extractChargeRefundRef,
  isChargeRefundEvent,
  parseAllowedOrigins,
} from '../_shared/checkoutValidation.ts';
import { confirmationEmailHtml, adminAlertEmailHtml } from '../_shared/emailTemplates.ts';

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const ADMIN_ALERT_EMAIL = Deno.env.get('ADMIN_ALERT_EMAIL') || 'hello@riman.ae';

const ALLOWED_ORIGINS = parseAllowedOrigins(Deno.env);
const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0] || '',
  'Access-Control-Allow-Headers': 'authorization, content-type, stripe-signature',
  'Vary': 'Origin',
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.text(); // RAW body — required for signature verification
    const signature = req.headers.get('stripe-signature') || '';

    let verified;
    try {
      verified = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch {
      return json({ error: 'Invalid signature' }, 401);
    }

    // Claim/settle ledger, shared by every event type so Stripe retries and
    // duplicate deliveries run the work exactly once.
    const makeGate = (eventType: string): WebhookClaimGate => ({
      claim: async (eventId) => {
        const { data, error } = await supabase.rpc('claim_stripe_event', {
          p_event_id: eventId,
          p_event_type: eventType,
          p_stale_seconds: 300,
        });
        if (error) throw new Error(`claim failed: ${error.message}`);
        return data === 'won' || data === 'reclaimed';
      },
      settle: async (eventId, ok, error) => {
        const { error: settleErr } = await supabase.rpc('settle_stripe_event', {
          p_event_id: eventId,
          p_ok: ok,
          p_error: error ?? null,
        });
        if (settleErr) console.error('settle failed:', settleErr.message);
      },
    });

    const extracted = extractWebhookOrderRef(verified.event);
    if ('ignore' in extracted && extracted.ignore) {
      // Refunds and disputes arrive against the Charge/Refund, not the Session,
      // so they never carry order_id metadata and need their own path.
      const eventType = (verified.event as { type?: unknown })?.type;
      if (typeof eventType === 'string' && isChargeRefundEvent(eventType)) {
        // Parse BEFORE claiming: a permanently malformed payload must return
        // 400 so Stripe stops retrying it, not throw so it retries for days.
        const refundRef = extractChargeRefundRef(verified.event);
        if (!refundRef.ok) {
          console.error('stripe-webhook: malformed refund event', refundRef.error);
          return json({ error: 'Invalid event' }, 400);
        }
        const refundOutcome = await processOnce(
          refundRef.value.eventId,
          makeGate(eventType),
          async () => { await handleChargeRefundEvent(refundRef.value); },
        );
        if (refundOutcome === 'failed') return json({ error: 'Internal error' }, 500);
        return json({ received: true, duplicate: refundOutcome === 'duplicate' }, 200);
      }
      return json({ received: true }, 200);
    }
    if (!extracted.ok) {
      // The result is a union, and the `ignore` variant carries no `error`.
      const reason = 'error' in extracted ? extracted.error : extracted;
      console.error('stripe-webhook: malformed payment event', reason);
      return json({ error: 'Invalid event' }, 400);
    }

    const ev = extracted.value;
    const gate = makeGate(ev.eventType);

    const outcome = await processOnce(ev.eventId, gate, async () => {
      if (ev.eventType === 'checkout.session.completed') {
        await fulfillOrder(ev);
      } else if (ev.eventType === 'checkout.session.expired') {
        await expireOrder(ev);
      }
    });

    if (outcome === 'failed') {
      // 500 → Stripe retries; the released claim makes the retry effective.
      return json({ error: 'Internal error' }, 500);
    }
    return json({ received: true, duplicate: outcome === 'duplicate' }, 200);
  } catch (err) {
    console.error('stripe-webhook error:', err);
    return json({ error: 'Internal error' }, 500);
  }
});

type WebhookEvent = {
  orderId: string;
  sessionId: string;
  paymentIntentId: string | null;
  paymentStatus: string;
  amountTotalCents: number | null;
  currency: string | null;
};

type ChargeRefundEvent = {
  eventId: string;
  eventType: string;
  chargeId: string | null;
  paymentIntentId: string | null;
  amountRefundedCents: number | null;
  amountCents: number | null;
  currency: string | null;
};

/**
 * Refund / dispute handling.
 *
 * These events reference the Charge, which does not carry the Checkout
 * Session's metadata, so the order is found via the PaymentIntent recorded at
 * fulfillment. Only a FULL refund releases the rental window: a partial refund
 * means the hire is still going ahead, and freeing those dates would let a
 * second customer book a garment that is physically out.
 */
async function handleChargeRefundEvent(ev: ChargeRefundEvent): Promise<void> {

  if (!ev.paymentIntentId) {
    // Cannot attribute it. Alert rather than guess — silently dropping a refund
    // is how a refunded order stays 'paid' forever.
    console.error('refund event with no payment_intent — cannot attribute', { eventId: ev.eventId, type: ev.eventType });
    await enqueue('refund_unattributed', ADMIN_ALERT_EMAIL,
      `⚠ Unattributable ${ev.eventType} — ${ev.eventId.slice(0, 8)}`,
      adminAlertEmailHtml([
        ['Event', ev.eventId],
        ['Type', ev.eventType],
        ['Charge', ev.chargeId ?? 'unknown'],
        ['Issue', 'No payment_intent on the event, so no order could be matched. Reconcile in Stripe.'],
      ]));
    return;
  }

  const { data: order, error: lookupError } = await supabase
    .from('orders')
    .select('id, amount_total_cents, currency, customers(email, name)')
    .eq('stripe_payment_intent_id', ev.paymentIntentId)
    .maybeSingle();

  if (lookupError) {
    console.error('refund order lookup failed:', lookupError);
    throw new Error('refund order lookup failed'); // retryable
  }
  if (!order) {
    console.error('refund matched no order', { eventId: ev.eventId, paymentIntentId: ev.paymentIntentId });
    await enqueue('refund_unmatched', ADMIN_ALERT_EMAIL,
      `⚠ Refund matched no order — ${ev.eventId.slice(0, 8)}`,
      adminAlertEmailHtml([
        ['Event', ev.eventId],
        ['Type', ev.eventType],
        ['PaymentIntent', ev.paymentIntentId],
        ['Issue', 'No order carries this payment_intent. Reconcile in Stripe.'],
      ]));
    return;
  }

  const isDispute = ev.eventType === 'charge.dispute.created';
  // Compare against the SERVER's total, never a figure from the event.
  const orderCents = (order as { amount_total_cents?: number | null }).amount_total_cents ?? null;
  const refunded = ev.amountRefundedCents;
  const fullyRefunded = isDispute
    || (refunded != null && orderCents != null && refunded >= orderCents);

  const customer = normalizeCustomer((order as { customers?: unknown }).customers);
  const summary: [string, string][] = [
    ['Order', order.id],
    ['Type', ev.eventType],
    ['PaymentIntent', ev.paymentIntentId],
    ['Charge', ev.chargeId ?? 'unknown'],
    ['Refunded (cents)', refunded == null ? 'unknown' : String(refunded)],
    ['Order total (cents)', orderCents == null ? 'unknown' : String(orderCents)],
    ['Currency', String((order as { currency?: string | null }).currency ?? ev.currency ?? 'aed')],
  ];

  if (isDispute) {
    // Money is clawed back by the bank, not by us. Do not silently release the
    // garment — the customer may still have it. Flag for a human.
    await supabase.from('orders').update({ status: 'needs_review' }).eq('id', order.id);
    await enqueue('dispute_opened', ADMIN_ALERT_EMAIL,
      `⚠ Dispute opened — order ${order.id.slice(0, 8)}`, adminAlertEmailHtml(summary));
    return;
  }

  if (!fullyRefunded) {
    // Partial refund: record it, keep the booking. The hire is still on.
    console.info('partial refund — order left paid and rental retained', {
      orderId: order.id, refundedCents: refunded, orderCents,
    });
    await enqueue('refund_partial', ADMIN_ALERT_EMAIL,
      `Partial refund — order ${order.id.slice(0, 8)}`, adminAlertEmailHtml(summary));
    return;
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ payment_status: 'refunded', updated_at: new Date().toISOString() })
    .eq('id', order.id)
    .eq('payment_status', 'paid'); // idempotent: only a paid order flips

  if (updateError) {
    console.error('refund update failed:', updateError);
    throw new Error('refund update failed'); // retryable
  }

  // Release the rental window. 'released' nulls blocking_range, so those dates
  // become bookable again instead of being blocked by a refunded hire.
  const { data: items } = await supabase
    .from('order_items')
    .select('id')
    .eq('order_id', order.id)
    .not('rental_start_date', 'is', null);
  if (items?.length) {
    const { error: bookErr } = await supabase
      .from('rental_bookings')
      .update({ status: 'released', deposit_status: 'refunded', updated_at: new Date().toISOString() })
      .in('order_item_id', items.map((i: { id: string }) => i.id))
      .in('status', ['confirmed', 'active']);
    if (bookErr) {
      // Money is already marked refunded; a failure here leaves dates blocked.
      // Surface it loudly rather than losing it.
      console.error('refund booking release failed:', bookErr);
      await enqueue('refund_release_failed', ADMIN_ALERT_EMAIL,
        `⚠ Refund recorded but dates still held — order ${order.id.slice(0, 8)}`,
        adminAlertEmailHtml([...summary, ['Action', 'Release the rental booking manually.']]));
    }
  }

  await enqueue('refund_processed', ADMIN_ALERT_EMAIL,
    `Refund processed — order ${order.id.slice(0, 8)}`, adminAlertEmailHtml(summary));

}

/** PostgREST returns an embed as an object or a one-element array. */
function normalizeCustomer(embed: unknown): { email?: string; name?: string | null } | null {
  const value = Array.isArray(embed) ? embed[0] : embed;
  if (!value || typeof value !== 'object') return null;
  const rec = value as { email?: string; name?: string | null };
  return { email: rec.email, name: rec.name ?? null };
}

async function fulfillOrder(ev: WebhookEvent) {
  if (ev.paymentStatus !== 'paid') {
    console.info('webhook completed session not paid, skipping', { sessionId: ev.sessionId, status: ev.paymentStatus });
    return;
  }

  // Guarded transition: only a pending-payment order flips. If this races the
  // verification endpoint, the second writer matches zero rows.
  const { data, error } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      payment_method: 'card',
      status: 'confirmed',
      stripe_session_id: ev.sessionId,
      // Recorded so a later charge.refunded can be matched back to this order:
      // refund events do not carry the session's metadata.
      ...(ev.paymentIntentId ? { stripe_payment_intent_id: ev.paymentIntentId } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', ev.orderId)
    .eq('payment_status', 'processing')
    // customer_name was selected from `orders`, but that column only ever
    // existed on rental_bookings. PostgREST rejects an unknown select column
    // with a 400 for the WHOLE request, so this update threw, the order never
    // flipped to paid, and Stripe retried for days: every card payment was
    // charged and never fulfilled. The customer's name lives on `customers`.
    .select('id, subtotal, amount_total_cents, currency, customers(email, name)');

  if (error) {
    console.error('order update failed:', error);
    throw new Error('database update failed'); // → settle failed → retryable
  }
  if (!data?.length) {
    console.info('order already fulfilled or not found — no transition applied', { orderId: ev.orderId });
    return;
  }
  const order = data[0] as {
    id: string; subtotal?: number | null;
    amount_total_cents?: number | null; currency?: string | null;
    customers?: { email?: string; name?: string | null } | { email?: string; name?: string | null }[] | null;
  };
  // PostgREST returns an embed as an object or a one-element array depending on
  // how it infers the relationship; normalise before use.
  const customer = Array.isArray(order.customers) ? order.customers[0] : order.customers;
  const customerName = customer?.name ?? null;

  // --- Cross-check charged amount against the server snapshot ---
  // Mismatch is a FINANCIAL REVIEW EVENT, not a log line. Deterministic —
  // flag and finish (retries would flag identically).
  if (order.amount_total_cents != null && ev.amountTotalCents != null && order.amount_total_cents !== ev.amountTotalCents) {
    console.error('AMOUNT MISMATCH — flagging order for review', {
      orderId: ev.orderId,
      expectedCents: order.amount_total_cents,
      chargedCents: ev.amountTotalCents,
    });
    await supabase.from('orders').update({ status: 'needs_review' }).eq('id', ev.orderId);
    await enqueue('amount_mismatch', ADMIN_ALERT_EMAIL, `⚠ Amount mismatch — order ${ev.orderId.slice(0, 8)}`,
      adminAlertEmailHtml([
        ['Order', ev.orderId],
        ['Expected (server snapshot, cents)', String(order.amount_total_cents)],
        ['Charged (Stripe, cents)', String(ev.amountTotalCents)],
        ['Currency', String(order.currency ?? ev.currency ?? 'aed')],
        ['Session', ev.sessionId],
      ]));
  }

  // --- Card-rental windows become confirmed bookings here ---
  const conflict = await promoteRentBookings(ev.orderId);
  if (conflict) {
    await supabase.from('orders').update({ status: 'needs_review' }).eq('id', ev.orderId);
    await enqueue('booking_conflict', ADMIN_ALERT_EMAIL, `⚠ Rental date conflict — order ${ev.orderId.slice(0, 8)}`,
      adminAlertEmailHtml([
        ['Order', ev.orderId],
        ['Issue', 'Paid order overlaps an existing confirmed rental (double-book race or admin-side change). Refund or reschedule required.'],
        ['Session', ev.sessionId],
      ]));
  }

  // --- Confirmation email (durable queue) ---
  const customerEmail = customer?.email;
  if (customerEmail) {
    await enqueue('order_confirmed', customerEmail, `Payment Confirmed — ${ev.orderId.slice(0, 8)} | Riman Fashion`,
      confirmationEmailHtml({ customer_name: customerName, subtotal: order.subtotal }, ev.orderId));
  }
}

/** Flip this order's pending_payment bookings to confirmed. Returns true if
 * the DB exclusion constraint rejected a flip (date conflict, deterministic). */
async function promoteRentBookings(orderId: string): Promise<boolean> {
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('id')
    .eq('order_id', orderId)
    .not('rental_start_date', 'is', null)
    .not('rental_end_date', 'is', null);
  if (itemsError) {
    console.error('rental item lookup failed:', itemsError);
    throw new Error('database read failed'); // transient → retry
  }
  if (!items?.length) return false;

  const { error } = await supabase
    .from('rental_bookings')
    .update({ status: 'confirmed', updated_at: new Date().toISOString() })
    .in('order_item_id', items.map((i: { id: string }) => i.id))
    .eq('status', 'pending_payment');

  if (!error) return false;
  if (error.code === '23P01') return true; // exclusion_violation → needs_review
  console.error('booking promotion failed:', error);
  throw new Error('database update failed');
}

async function expireOrder(ev: WebhookEvent) {
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: 'failed',
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', ev.orderId)
    .eq('payment_status', 'processing'); // never clobber a paid order
  if (error) {
    console.error('expire update failed:', error);
    throw new Error('database update failed');
  }

  // Free any rental windows this abandoned checkout was holding.
  const { data: items } = await supabase
    .from('order_items')
    .select('id')
    .eq('order_id', ev.orderId)
    .not('rental_start_date', 'is', null);
  if (items?.length) {
    const { error: bookErr } = await supabase
      .from('rental_bookings')
      .update({ status: 'released', updated_at: new Date().toISOString() })
      .in('order_item_id', items.map((i: { id: string }) => i.id))
      .eq('status', 'pending_payment');
    if (bookErr) console.error('booking release failed:', bookErr);
  }
}

async function enqueue(kind: string, to: string, subject: string, html: string) {
  try {
    await supabase.from('notification_outbox').insert({ kind, to_email: to, subject, html });
  } catch (err) {
    console.error('outbox enqueue failed:', err);
  }
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
