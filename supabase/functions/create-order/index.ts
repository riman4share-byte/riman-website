// Supabase Edge Function: create-order
// Deploy: supabase functions deploy create-order --no-verify-jwt
// Secrets: supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
//
// Server-trusted order creation for the in-atelier / pay-in-person flow.
// The browser sends ONLY product ids, quantities, intents and rental dates.
// Names, prices, subtotal and order type are derived from the database here.
// Unknown fields (including any client-supplied price) are rejected outright.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  parseCheckoutRequest,
  deriveTrustedLines,
  parseAllowedOrigins,
  type ProductRow,
} from '../_shared/checkoutValidation.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const ALLOWED_ORIGINS = parseAllowedOrigins(Deno.env);
const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0] || '',
  'Access-Control-Allow-Headers': 'authorization, content-type',
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
    // --- 1. Strict schema (rejects unknown fields / prices / totals) ---
    let parsed;
    try {
      parsed = parseCheckoutRequest(await req.json());
    } catch {
      return json({ error: 'Invalid request' }, 400);
    }
    if (!parsed.ok) return json({ error: parsed.error }, 400);
    const payload = parsed.value;

    // --- 2. Shipping details (authoritative validation) ---
    if (
      !payload.customerPhone || payload.customerPhone.trim().length < 7 ||
      !payload.customerAddress || !payload.customerAddress.trim() ||
      !payload.customerCity || !payload.customerCity.trim() ||
      !payload.customerCountry || !payload.customerCountry.trim()
    ) {
      return json({ error: 'Invalid or incomplete shipping details' }, 400);
    }

    // --- 3. Authoritative products + trusted pricing ---
    const productIds = [...new Set(payload.lines.map((l) => l.product_id))];
    const { data: dbProducts, error: prodError } = await supabase
      .from('products')
      .select('id, name, product_type, sale_price, rental_price, security_deposit, is_active')
      .in('id', productIds);
    if (prodError) {
      console.error('product fetch failed:', prodError);
      return json({ error: 'Order creation is currently unavailable' }, 500);
    }

    const derived = deriveTrustedLines(payload.lines, (dbProducts ?? []) as ProductRow[]);
    if (!derived.ok) return json({ error: derived.error }, 400);
    const { trusted, subtotalAed, orderType } = derived.value;

    // --- 4. Customer (upsert by email) ---
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', payload.customerEmail)
      .maybeSingle();

    let customerId = existingCustomer?.id;
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

    // --- 5. Order + immutable line snapshot ---
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        status: 'pending',
        type: orderType,
        subtotal: subtotalAed,
        notes: payload.notes,
        payment_method: 'atelier',
        payment_status: 'pending',
      })
      .select()
      .single();
    if (orderError) {
      console.error('order insert failed:', orderError);
      return json({ error: 'Order creation is currently unavailable' }, 500);
    }

    const { data: insertedItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(trusted.map((i) => ({
        order_id: order.id,
        product_id: i.product_id,
        product_name: i.product_name,
        product_type: i.intent === 'rent' ? 'rent' : 'sale',
        size: i.size,
        quantity: i.quantity,
        unit_price: i.unit_price_aed,
        security_deposit: i.security_deposit,
        rental_start_date: i.rental_start_date,
        rental_end_date: i.rental_end_date,
      })))
      .select();
    if (itemsError) {
      console.error('order_items insert failed:', itemsError);
      await supabase.from('orders').delete().eq('id', order.id);
      return json({ error: 'Order creation is currently unavailable' }, 500);
    }

    for (const item of insertedItems ?? []) {
      if (item.rental_start_date && item.rental_end_date) {
        await supabase.from('rental_bookings').insert({
          order_item_id: item.id,
          product_id: item.product_id,
          customer_name: payload.customerName,
          customer_email: payload.customerEmail,
          customer_phone: payload.customerPhone,
          start_date: item.rental_start_date,
          end_date: item.rental_end_date,
          status: 'confirmed',
          deposit_collected: item.security_deposit || 0,
        });
      }
    }

    return json({ orderId: order.id }, 200);
  } catch (err) {
    console.error('create-order error:', err);
    return json({ error: 'Order creation is currently unavailable' }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
