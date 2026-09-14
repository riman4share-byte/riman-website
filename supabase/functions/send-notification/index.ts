// Supabase Edge Function: send-notification
// Deploy WITH JWT verification: supabase functions deploy send-notification
// (do NOT use --no-verify-jwt — this was previously an open mail relay).
// Set secrets: supabase secrets set RESEND_API_KEY=re_xxx

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const FROM_EMAIL = 'Riman Fashion <orders@riman.ae>';
const APP_URL = Deno.env.get('APP_URL') || 'https://riman.ae';

const corsHeaders = {
  'Access-Control-Allow-Origin': APP_URL,
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Vary': 'Origin',
};

interface NotificationPayload {
  type: 'order_confirmed' | 'appointment_booked' | 'contact_submitted';
  to: string;
  subject: string;
  data: Record<string, any>;
}

const ALLOWED_TYPES = new Set(['order_confirmed', 'appointment_booked', 'contact_submitted']);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    // Require authenticated caller (Supabase JWT). Service-role callers
    // (stripe-webhook, create-checkout) bypass via service key.
    const authHeader = req.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: NotificationPayload = await req.json();

    if (!payload.to || !payload.subject) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!ALLOWED_TYPES.has(payload.type)) {
      return new Response(JSON.stringify({ error: 'Invalid type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    // Recipient must be the caller — no arbitrary `to` (prevents open relay).
    // Admin alerts (contact/appointment) are sent server-side by other
    // functions with service_role, not via this user-facing path.
    if (payload.to.toLowerCase() !== user.email!.toLowerCase()) {
      return new Response(JSON.stringify({ error: 'Recipient mismatch' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const htmlBody = buildHtml(payload);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: payload.to,
        subject: payload.subject,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend API error:', err);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildHtml(payload: NotificationPayload): string {
  const { type, data } = payload;

  const orderRows = type === 'order_confirmed'
    ? `<p><strong>Order ID:</strong> ${data.order_id}</p>
       <p><strong>Customer:</strong> ${data.customer_name}</p>
       <p><strong>Total:</strong> AED ${data.total?.toLocaleString()}</p>
       <p><strong>Type:</strong> ${data.type}</p>`
    : '';

  const appointmentRows = type === 'appointment_booked'
    ? `<p><strong>Name:</strong> ${data.name}</p>
       <p><strong>Date:</strong> ${data.date}</p>
       <p><strong>Time:</strong> ${data.time}</p>
       <p><strong>Service:</strong> ${data.service}</p>`
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Georgia, serif; color: #1a1a1a; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; padding: 40px;">
        <h1 style="font-size: 20px; letter-spacing: 4px; text-transform: uppercase; color: #b8860b; margin-bottom: 30px; text-align: center;">Atelier Riman</h1>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
        ${orderRows}
        ${appointmentRows}
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">Al Zahra St, Sharjah, UAE | hello@riman.ae</p>
      </div>
    </body>
    </html>
  `;
}
