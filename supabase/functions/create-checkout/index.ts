// Supabase Edge Function: create-checkout
// Deploy: supabase functions deploy create-checkout --no-verify-jwt
// Secrets: supabase secrets set STRIPE_SECRET_KEY=sk_xxx
//          supabase secrets set RESEND_API_KEY=re_xxx
//          supabase secrets set SITE_URL=https://riman.ae
//          supabase secrets set ALLOWED_SITE_ORIGINS=https://riman.ae,https://staging.riman.ae
//
// SECURITY MODEL:
//  - The browser sends ONLY product ids, quantities, intents and rental dates.
//  - Names, prices, totals, order type and availability are derived HERE from
//    the database via the service-role client. Client-supplied money is a
//    schema error, not an input.
//  - success_url / cancel_url come only from the SITE_URL / ALLOWED_SITE_ORIGINS
//    allowlist — never from the request body.
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

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const FROM_EMAIL = 'Atelier Riman <orders@riman.ae>';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const ALLOWED_ORIGINS = parseAllowedOrigins(Deno.env);
const SITE_URL = (Deno.env.get('SITE_URL') || ALLOWED_ORIGINS[0] || '').replace(/\/+$/, '');

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
    // --- 1. Strict schema validation (rejects unknown fields incl. prices) ---
    let parsed;
    try {
      parsed = parseCheckoutRequest(await req.json());
    } catch {
      return json({ error: 'Invalid request' }, 400, req);
    }
    if (!parsed.ok) return json({ error: parsed.error }, 400, req);
    const payload = parsed.value;

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

    // --- 4. Rental availability (date-window overlap) ---
    for (const item of trusted) {
      if (item.intent === 'rent' && item.rental_start_date && item.rental_end_date) {
        const { data: bookings, error: bookErr } = await supabase
          .from('rental_bookings')
          .select('start_date, end_date')
          .eq('product_id', item.product_id)
          .in('status', ['confirmed', 'active', 'overdue'])
          .lt('start_date', item.rental_end_date)
          .gt('end_date', item.rental_start_date);
        if (bookErr) {
          console.error('booking check failed:', bookErr);
          return json({ error: 'Checkout is currently unavailable' }, 500, req);
        }
        if (!rentalPeriodIsFree(bookings ?? [], item.rental_start_date, item.rental_end_date)) {
          return json({ error: `Product "${item.product_name}" is not available for those dates` }, 400, req);
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
    const { error: itemsError } = await supabase.from('order_items').insert(
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
    );
    if (itemsError) {
      console.error('order_items insert failed:', itemsError);
      await supabase.from('orders').delete().eq('id', order.id);
      return json({ error: 'Checkout is currently unavailable' }, 500, req);
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
      await supabase.from('orders').delete().eq('id', order.id);
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
  let orderData = null;

  if (orderId) {
    const { data } = await supabase
      .from('orders')
      .select('*, customers!inner(email)')
      .eq('id', orderId)
      .single();
    orderData = data;

    const sessionEmail = (session.customer_details?.email || '').toLowerCase();
    const orderEmail = (orderData?.customers?.email || '').toLowerCase();
    const belongsToOrder = orderData && (!sessionEmail || !orderEmail || sessionEmail === orderEmail);

    customerEmail = orderEmail || sessionEmail;

    if (paid && orderData?.payment_status !== 'paid' && belongsToOrder) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .eq('payment_status', 'processing'); // idempotent single transition
    } else if (paid && orderData?.payment_status !== 'paid' && !belongsToOrder) {
      console.warn('verify: session/order customer mismatch, not marking paid', { orderId });
    }

    if (paid && orderData && RESEND_API_KEY && orderData.payment_status !== 'paid') {
      await sendConfirmationEmail(orderId, orderData, customerEmail);
    }
  }

  return jsonStatic({ paid, orderId: orderId || undefined, customerEmail }, 200);
}

function jsonStatic(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0] || '', 'Vary': 'Origin' },
  });
}

async function sendConfirmationEmail(orderId: string, orderData: { customer_name?: string; subtotal?: number }, customerEmail: string) {
  try {
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Georgia, serif; color: #1a1a1a; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; padding: 40px;">
          <h1 style="font-size: 20px; letter-spacing: 4px; text-transform: uppercase; color: #b8860b; margin-bottom: 30px; text-align: center;">Atelier Riman</h1>
          <p>Dear ${escapeHtml(orderData.customer_name || 'Valued Client')},</p>
          <p>Thank you for your order. Your payment has been received and your pieces are being prepared at our Sharjah atelier.</p>
          <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
          <p><strong>Total Paid:</strong> AED ${Number(orderData.subtotal || 0).toLocaleString()}</p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
          <p style="font-size: 12px; color: #666; text-align: center;">Al Zahra St, Sharjah, UAE | hello@riman.ae</p>
        </div>
      </body>
      </html>
    `;
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: customerEmail,
        subject: `Payment Confirmed — ${orderId.slice(0, 8)} | Atelier Riman`,
        html: htmlBody,
      }),
    });
  } catch (emailErr) {
    console.error('Failed to send confirmation email:', emailErr);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
