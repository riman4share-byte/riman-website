// Supabase Edge Function: stripe-webhook
// Deploy: supabase functions deploy stripe-webhook --no-verify-jwt
// Secrets: supabase secrets set STRIPE_SECRET_KEY=sk_xxx STRIPE_WEBHOOK_SECRET=whsec_xxx
//          supabase secrets set ADMIN_ALERT_EMAIL=hello@riman.ae
// Stripe webhook endpoint: https://your-project.supabase.co/functions/v1/stripe-webhook
//   Events: checkout.session.completed, checkout.session.expired
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
//  - Client-facing responses are generic.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyStripeSignature, processOnce, type WebhookClaimGate } from '../_shared/stripeSignature.ts';
import { extractWebhookOrderRef, parseAllowedOrigins } from '../_shared/checkoutValidation.ts';
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

    const extracted = extractWebhookOrderRef(verified.event);
    if ('ignore' in extracted && extracted.ignore) {
      return json({ received: true }, 200);
    }
    if (!extracted.ok) {
      console.error('stripe-webhook: malformed payment event', extracted.error);
      return json({ error: 'Invalid event' }, 400);
    }

    const ev = extracted.value;

    const gate: WebhookClaimGate = {
      claim: async (eventId) => {
        const { data, error } = await supabase.rpc('claim_stripe_event', {
          p_event_id: eventId,
          p_event_type: ev.eventType,
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
    };

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
  paymentStatus: string;
  amountTotalCents: number | null;
  currency: string | null;
};

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
      updated_at: new Date().toISOString(),
    })
    .eq('id', ev.orderId)
    .eq('payment_status', 'processing')
    .select('id, customer_name, subtotal, amount_total_cents, currency, customers(email)');

  if (error) {
    console.error('order update failed:', error);
    throw new Error('database update failed'); // → settle failed → retryable
  }
  if (!data?.length) {
    console.info('order already fulfilled or not found — no transition applied', { orderId: ev.orderId });
    return;
  }
  const order = data[0] as {
    id: string; customer_name?: string | null; subtotal?: number | null;
    amount_total_cents?: number | null; currency?: string | null;
    customers?: { email?: string } | null;
  };

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
  const customerEmail = order.customers?.email;
  if (customerEmail) {
    await enqueue('order_confirmed', customerEmail, `Payment Confirmed — ${ev.orderId.slice(0, 8)} | Atelier Riman`,
      confirmationEmailHtml(order, ev.orderId));
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
