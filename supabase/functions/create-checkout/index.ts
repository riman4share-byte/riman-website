// Supabase Edge Function: create-checkout
// Deploy: supabase functions deploy create-checkout --no-verify-jwt
// Secrets: supabase secrets set STRIPE_SECRET_KEY=sk_xxx
//          supabase secrets set RESEND_API_KEY=re_xxx
//          supabase secrets set SITE_URL=https://riman.ae
//          supabase secrets set ALLOWED_SITE_ORIGINS=https://riman.ae,https://staging.riman.ae
//          (optional) supabase secrets set TURNSTILE_SECRET_KEY=0x...  ← server-side captcha
//
// SECURITY MODEL:
//  - The browser sends ONLY product ids, quantities, intents and rental dates.
//  - Names, prices, totals, order type and availability are derived HERE from
//    the database via the service-role client. Client-supplied money is a
//    schema error, not an input.
//  - success_url / cancel_url come only from the SITE_URL / ALLOWED_SITE_ORIGINS
//    allowlist — never from the request body.
//  - Public endpoint ⇒ per-IP rate limit (try_rate_limit RPC) and, when
//    TURNSTILE_SECRET_KEY is set, a server-verified captcha token.
//  - Rental windows are HELD from the moment the order row exists: booking
//    rows are created 'pending_payment' and flipped to 'confirmed' by the
//    webhook (the DB exclusion constraint makes double-selling impossible;
//    checkout.session.expired releases the hold).
//  - Errors returned to clients are generic; details are logged server-side.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  parseCheckoutRequest,
  deriveTrustedLines,
  isAllowedOrigin,
  parseAllowedOrigins,
  rentalPeriodIsFree,
  CURRENCY,
  type ProductRow,
} from '../_shared/checkoutValidation.ts';
import { verifyTurnstileToken } from '../_shared/turnstile.ts';
import { clientIp } from '../_shared/httpGuards.ts';
import { confirmationEmailHtml } from '../_shared/emailTemplates.ts';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const ALLOWED_ORIGINS = parseAllowedOrigins(Deno.env);
const SITE_URL = (Deno.env.get('SITE_URL') || ALLOWED_ORIGINS[0] || '').replace(/\/+$/, '');
const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY') || '';
const RATE_LIMIT_MAX = Number(Deno.env.get('CHECKOUT_RATE_LIMIT_MAX') || 10);
const RATE_LIMIT_WINDOW_S = Number(Deno.env.get('CHECKOUT_RATE_LIMIT_WINDOW_S') || 600);

function corsFor(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowed = isAllowedOrigin(origin, ALLOWED_ORIGINS) ? origin : (ALLOWED_ORIGINS[0] || '');
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Vary': 'Origin',
  };
}

function json(body: unknown, status: number, req: Request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsFor(req), 'Content-Type': 'application/json' },
  });
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsFor(req) });
  }

  if (req.method === 'GET') {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId || !/^cs_[A-Za-z0-9_-]{10,255}$/.test(sessionId)) {
      return json({ paid: false }, 400, req);
    }
    if (!(await withinRateLimit('checkout_verify', req, 60, 600))) {
      return json({ error: 'Too many requests' }, 429, req);
    }
    try {
      return await handleVerify(sessionId);
    } catch (err) {
      console.error('verify error:', err);
      return json({ paid: false }, 200, req);
    }
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsFor(req) });
  }

  try {
    // --- 0. Abuse gates: per-IP budget + optional server-verified captcha ---
    const origin = req.headers.get('origin');
    if (origin && !isAllowedOrigin(origin, ALLOWED_ORIGINS)) {
      return json({ error: 'Origin not allowed' }, 403, req);
    }
    if (!(await withinRateLimit('create_checkout', req, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_S))) {
      return json({ error: 'Too many requests' }, 429, req);
    }

    // --- 1. Strict schema validation (rejects unknown fields incl. prices) ---
    let parsed;
    try {
      parsed = parseCheckoutRequest(await req.json());
    } catch {
      return json({ error: 'Invalid request' }, 400, req);
    }
    if (!parsed.ok) return json({ error: parsed.error }, 400, req);
    const payload = parsed.value;

    if (TURNSTILE_SECRET_KEY) {
      const captchaOk = await verifyTurnstileToken({
        token: payload.captchaToken,
        secret: TURNSTILE_SECRET_KEY,
        ip: clientIp(req.headers),
      });
      if (!captchaOk) return json({ error: 'Please complete the security check.' }, 400, req);
    }

    if (!STRIPE_SECRET_KEY) {
      return json({ error: 'Checkout is currently unavailable' }, 503, req);
    }

    // --- 2. Return origin allowlist ---
    if (payload.returnOrigin !== undefined && !isAllowedOrigin(payload.returnOrigin, ALLOWED_ORIGINS)) {
      return json({ error: 'Return origin not allowed' }, 400, req);
    }
    const siteOrigin = SITE_URL || payload.returnOrigin || '';
    if (!siteOrigin) {
      console.error('create-checkout: SITE_URL not configured');
      return json({ error: 'Checkout is currently unavailable' }, 503, req);
    }

    // --- 3. Authoritative products from the database ---
    const productIds = [...new Set(payload.lines.map((l) => l.product_id))];
    const { data: dbProducts, error: prodError } = await supabase
      .from('products')
      .select('id, name, product_type, sale_price, rental_price, security_deposit, is_active')
      .in('id', productIds);
    if (prodError) {
      console.error('product fetch failed:', prodError);
      return json({ error: 'Checkout is currently unavailable' }, 500, req);
    }

    const derived = deriveTrustedLines(payload.lines, (dbProducts ?? []) as ProductRow[]);
    if (!derived.ok) return json({ error: derived.error }, 400, req);
    const { trusted, subtotalAed, subtotalCents, orderType } = derived.value;

    // --- 4. Rental availability (pre-check; the DB constraint is the boss) ---
    for (const item of trusted) {
      if (item.intent === 'rent' && item.rental_start_date && item.rental_end_date) {
        const { data: bookings, error: bookErr } = await supabase
          .from('rental_bookings')
          .select('start_date, end_date')
          .eq('product_id', item.product_id)
          .in('status', ['confirmed', 'active', 'overdue', 'pending_payment'])
          .lt('start_date', item.rental_end_date)
          .gt('end_date', item.rental_start_date);
        if (bookErr) {
          console.error('booking check failed:', bookErr);
          return json({ error: 'Checkout is currently unavailable' }, 500, req);
        }
        if (!rentalPeriodIsFree(bookings ?? [], item.rental_start_date, item.rental_end_date)) {
          return json({ error: `Product "${item.product_name}" is not available for those dates` }, 409, req);
        }
      }
    }

    // --- 5. Customer + immutable order snapshot, server-side amounts ---
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', payload.customerEmail)
      .maybeSingle();

    let customerId = customer?.id;
    if (!customerId) {
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({
          name: payload.customerName,
          email: payload.customerEmail,
          phone: payload.customerPhone,
          address: payload.customerAddress,
          city: payload.customerCity,
          country: payload.customerCountry || 'United Arab Emirates',
        })
        .select()
        .single();
      customerId = newCustomer?.id;
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        status: 'pending',
        type: orderType,
        subtotal: subtotalAed,
        amount_total_cents: subtotalCents,
        currency: CURRENCY,
        notes: payload.notes,
        payment_method: 'card',
        payment_status: 'processing',
      })
      .select()
      .single();
    if (orderError) {
      console.error('order insert failed:', orderError);
      return json({ error: 'Checkout is currently unavailable' }, 500, req);
    }

    // Line snapshot from trusted rows only (names/prices frozen at order time).
    const { data: insertedItems, error: itemsError } = await supabase.from('order_items').insert(
      trusted.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price_aed,
        product_type: item.intent === 'rent' ? 'rent' : 'sale',
        size: item.size,
        security_deposit: item.security_deposit,
        rental_start_date: item.rental_start_date,
        rental_end_date: item.rental_end_date,
      })),
    ).select('id, product_id, product_name, quantity, security_deposit, rental_start_date, rental_end_date');
    if (itemsError) {
      console.error('order_items insert failed:', itemsError);
      await supabase.from('orders').delete().eq('id', order.id);
      return json({ error: 'Checkout is currently unavailable' }, 500, req);
    }

    // --- 5b. HOLD rental windows (pending payment) ---
    const holdFailed = await holdRentWindows(
      insertedItems ?? [],
      { name: payload.customerName, email: payload.customerEmail },
    );
    if (holdFailed) {
      await rollbackOrder(order.id);
      return json({ error: 'One of the selected pieces just became unavailable for those dates' }, 409, req);
    }

    // --- 6. Stripe session from trusted values; integer cents amounts ---
    const form = new URLSearchParams({
      'mode': 'payment',
      'success_url': `${siteOrigin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${siteOrigin}/payment/cancel`,
      'customer_email': payload.customerEmail,
      'metadata[order_id]': order.id,
    });
    trusted.forEach((item, i) => {
      form.set(`line_items[${i}][price_data][currency]`, CURRENCY);
      form.set(`line_items[${i}][price_data][product_data][name]`, item.product_name);
      form.set(`line_items[${i}][price_data][unit_amount]`, String(item.line_total_cents / item.quantity)); // exact integer cents
      form.set(`line_items[${i}][quantity]`, String(item.quantity));
    });

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });
    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('stripe session failed:', session?.error?.message);
      await rollbackOrder(order.id);
      return json({ error: 'Checkout is currently unavailable' }, 502, req);
    }

    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    return json({ url: session.url, orderId: order.id }, 200, req);
  } catch (err) {
    console.error('create-checkout error:', err);
    return json({ error: 'Checkout is currently unavailable' }, 500, req);
  }
});

interface InsertedItemRow {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  security_deposit: number | null;
  rental_start_date: string | null;
  rental_end_date: string | null;
}

/** Create pending_payment booking rows for rental lines. Returns true on a
 * date-conflict (exclusion violation) or transient DB failure. */
async function holdRentWindows(
  rows: InsertedItemRow[],
  customer: { name: string; email: string },
): Promise<boolean> {
  const holds = rows.filter((r) => r.rental_start_date && r.rental_end_date);
  for (const r of holds) {
    const { error } = await supabase.from('rental_bookings').insert({
      order_item_id: r.id,
      product_id: r.product_id,
      customer_name: customer.name,
      customer_email: customer.email,
      start_date: r.rental_start_date,
      end_date: r.rental_end_date,
      status: 'pending_payment',
      deposit_collected: r.security_deposit || 0,
    });
    if (error) {
      console.error('rent hold failed:', error.code === '23P01' ? 'date conflict' : error.message);
      return true;
    }
  }
  return false;
}

async function rollbackOrder(orderId: string) {
  // Bookings/order_items cascade from the order; deleting the order unwinds
  // the whole snapshot including any holds that were just placed.
  const { error } = await supabase.from('orders').delete().eq('id', orderId);
  if (error) console.error('order rollback failed (manual cleanup needed):', error);
}

// ─── Verification (GET) ─────────────────────────────────────────────
// Session state is read back FROM STRIPE. An order is only marked paid when
// Stripe confirms payment_status === 'paid' AND the session's order_id
// metadata resolves to that order AND the customer email matches.
async function handleVerify(sessionId: string) {
  const sessionRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` } },
  );
  const session = await sessionRes.json();
  if (!sessionRes.ok) {
    return jsonStatic({ paid: false }, 200);
  }

  const paid = session.payment_status === 'paid';
  const orderId = session.metadata?.order_id;

  let customerEmail = session.customer_details?.email || '';

  if (orderId) {
    const { data: orderData } = await supabase
      .from('orders')
      .select('id, payment_status, customer_name, subtotal, customers!inner(email)')
      .eq('id', orderId)
      .single();

    const sessionEmail = (session.customer_details?.email || '').toLowerCase();
    const orderEmail = ((orderData as { customers?: { email?: string } } | null)?.customers?.email || '').toLowerCase();
    const belongsToOrder = orderData && (!sessionEmail || !orderEmail || sessionEmail === orderEmail);

    customerEmail = orderEmail || sessionEmail;

    if (paid && orderData && belongsToOrder) {
      // Guarded flip: exactly ONE of (webhook, verify) wins this transition,
      // and only the winner queues the confirmation email.
      const { data: flipped } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .eq('payment_status', 'processing')
        .select('id');

      if (flipped?.length) {
        await supabase
          .from('rental_bookings')
          .update({ status: 'confirmed', updated_at: new Date().toISOString() })
          .in('order_item_id', await rentalItemIds(orderId))
          .eq('status', 'pending_payment');

        const o = orderData as { customer_name?: string | null; subtotal?: number | null };
        if (orderEmail) {
          await enqueue(
            'order_confirmed',
            orderEmail,
            `Payment Confirmed — ${String(orderId).slice(0, 8)} | Atelier Riman`,
            confirmationEmailHtml(o, String(orderId)),
          );
        }
      }
    } else if (paid && orderData && !belongsToOrder) {
      console.warn('verify: session/order customer mismatch, not marking paid', { orderId });
    }
  }

  return jsonStatic({ paid, orderId: orderId || undefined, customerEmail }, 200);
}

async function rentalItemIds(orderId: string): Promise<string[]> {
  const { data } = await supabase
    .from('order_items')
    .select('id')
    .eq('order_id', orderId)
    .not('rental_start_date', 'is', null);
  return (data ?? []).map((i: { id: string }) => i.id);
}

async function withinRateLimit(bucket: string, req: Request, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('try_rate_limit', {
      p_bucket: bucket,
      p_scope_key: clientIp(req.headers),
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      // Fail open but LOUD: a missing migration must not take checkout down;
      // the log line is the alarm.
      console.error('rate limit rpc failed (failing open):', error.message);
      return true;
    }
    return data === true;
  } catch (err) {
    console.error('rate limit check threw (failing open):', err);
    return true;
  }
}

async function enqueue(kind: string, to: string, subject: string, html: string) {
  try {
    await supabase.from('notification_outbox').insert({ kind, to_email: to, subject, html });
  } catch (err) {
    console.error('outbox enqueue failed:', err);
  }
}

function jsonStatic(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0] || '', 'Vary': 'Origin' },
  });
}
