// Supabase Edge Function: stripe-webhook
// Deploy: supabase functions deploy stripe-webhook --no-verify-jwt
// Secrets: supabase secrets set STRIPE_SECRET_KEY=sk_xxx STRIPE_WEBHOOK_SECRET=whsec_xxx
// Stripe webhook endpoint: https://your-project.supabase.co/functions/v1/stripe-webhook
//   Events: checkout.session.completed, checkout.session.expired
//
// SECURITY MODEL:
//  - Signature is verified over the RAW body (WebCrypto HMAC) with a 5-minute
//    replay window. Forged/ tampered payloads are rejected with 401.
//  - Every event id is recorded in `stripe_processed_events` (UNIQUE PK)
//    BEFORE fulfillment, so replays/duplicate deliveries can never fulfill
//    an order twice.
//  - Fulfillment transitions an order only from 'processing' → 'paid' and
//    only when the (trusted, signature-verified) event metadata references
//    that order. Amounts are never recomputed from webhook metadata.
//  - Client-facing responses are generic.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyStripeSignature, processOnce } from '../_shared/stripeSignature.ts';
import { extractWebhookOrderRef, parseAllowedOrigins } from '../_shared/checkoutValidation.ts';

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const extracted = extractWebhookOrderRef(verified.event);
    if ('ignore' in extracted && extracted.ignore) {
      return new Response(JSON.stringify({ received: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!extracted.ok) {
      console.error('stripe-webhook: malformed payment event', extracted.error);
      return new Response(JSON.stringify({ error: 'Invalid event' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ev = extracted.value;

    // Idempotency: claim the event id (UNIQUE PK). Duplicates return 200 with
    // no side effects — Stripe stops retrying, fulfillment runs exactly once.
    const claim = async (eventId: string): Promise<boolean> => {
      const { error } = await supabase
        .from('stripe_processed_events')
        .insert({ event_id: eventId, event_type: ev.eventType });
      if (!error) return true;
      if (error.code === '23505') return false; // unique_violation → duplicate
      throw new Error(`claim failed: ${error.message}`);
    };

    const outcome = await processOnce(ev.eventId, claim, async () => {
      if (ev.eventType === 'checkout.session.completed') {
        await fulfillOrder(ev);
      } else if (ev.eventType === 'checkout.session.expired') {
        await expireOrder(ev);
      }
    });

    return new Response(JSON.stringify({ received: true, duplicate: outcome === 'duplicate' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('stripe-webhook error:', err);
    // 500 → Stripe will retry; the unique claim above makes retries safe.
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fulfillOrder(ev: { orderId: string; sessionId: string; paymentStatus: string; amountTotalCents: number | null; currency: string | null }) {
  if (ev.paymentStatus !== 'paid') {
    console.info('webhook completed session not paid, skipping', { sessionId: ev.sessionId, status: ev.paymentStatus });
    return;
  }

  // Guarded transition: only a pending-payment order flips. If this races the
  // verification endpoint, the second writer matches zero rows.
  const updates: Record<string, unknown> = {
    payment_status: 'paid',
    payment_method: 'card',
    status: 'confirmed',
    stripe_session_id: ev.sessionId,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', ev.orderId)
    .eq('payment_status', 'processing')
    .select('id');

  if (error) {
    console.error('order update failed:', error);
    throw new Error('database update failed');
  }
  if (!data?.length) {
    console.info('order already fulfilled or not found — no transition applied', { orderId: ev.orderId });
    return;
  }

  // Cross-check the amount Stripe charged against the server-computed order
  // snapshot (never used to price anything — detection only).
  const { data: order } = await supabase
    .from('orders')
    .select('amount_total_cents, currency')
    .eq('id', ev.orderId)
    .single();
  if (order?.amount_total_cents != null && ev.amountTotalCents != null && order.amount_total_cents !== ev.amountTotalCents) {
    console.error('AMOUNT MISMATCH — investigate', {
      orderId: ev.orderId,
      expectedCents: order.amount_total_cents,
      chargedCents: ev.amountTotalCents,
    });
  }
}

async function expireOrder(ev: { orderId: string; sessionId: string }) {
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: 'failed',
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', ev.orderId)
    .eq('payment_status', 'processing') // never clobber a paid order
    .neq('payment_status', 'paid');
  if (error) {
    console.error('expire update failed:', error);
    throw new Error('database update failed');
  }
}
