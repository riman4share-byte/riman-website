// Supabase Edge Function: process-outbox
// Deploy: supabase functions deploy process-outbox --no-verify-jwt
//   (a cron caller has no user JWT; access is gated by a static secret below)
// Secrets: supabase secrets set RESEND_API_KEY=re_xxx
//          supabase secrets set OUTBOX_WORKER_SECRET=<long-random-string>
//
// Drains notification_outbox: claims due rows atomically (FOR UPDATE SKIP
// LOCKED — safe against overlapping runs), sends via Resend, and reschedules
// failures with exponential backoff. Rows that exhaust attempts become
// 'failed' and stay visible for forensics.
//
// Trigger: pg_cron every 5 minutes (see supabase/DEPLOY_RUNBOOK.md), plus
// best-effort invocation from enqueuing functions so confirmations are not
// delayed until the next tick.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { constantTimeEqual } from '../_shared/httpGuards.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const OUTBOX_WORKER_SECRET = Deno.env.get('OUTBOX_WORKER_SECRET') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const FROM_EMAIL = 'Atelier Riman <orders@riman.ae>';
const MAX_ATTEMPTS = 6;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface OutboxRow {
  id: string;
  to_email: string;
  subject: string;
  html: string;
  attempts: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok');
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  if (!OUTBOX_WORKER_SECRET) {
    return json({ error: 'Outbox worker not configured' }, 503);
  }
  if (!constantTimeEqual(req.headers.get('x-outbox-secret') || '', OUTBOX_WORKER_SECRET)) {
    return json({ error: 'Unauthorized' }, 401);
  }
  if (!RESEND_API_KEY) {
    return json({ error: 'Outbox worker not configured' }, 503);
  }

  try {
    const { data, error } = await supabase.rpc('claim_pending_notifications', { p_limit: 5 });
    if (error) {
      console.error('claim failed:', error.message);
      return json({ error: 'Outbox drain unavailable' }, 500);
    }

    const rows = (data ?? []) as OutboxRow[];
    let sent = 0;
    let failed = 0;

    for (const row of rows) {
      const result = await sendViaResend(row);
      if (result.ok) {
        sent += 1;
        await supabase.from('notification_outbox')
          .update({ status: 'sent', sent_at: new Date().toISOString(), last_error: null })
          .eq('id', row.id);
      } else {
        const exhausted = row.attempts >= MAX_ATTEMPTS;
        if (exhausted) failed += 1;
        await supabase.from('notification_outbox')
          .update({
            status: exhausted ? 'failed' : 'pending',
            last_error: result.error.slice(0, 500),
            // Exponential backoff: 2,4,8,16,32 minutes…
            next_attempt_at: new Date(Date.now() + Math.min(2 ** row.attempts, 32) * 60_000).toISOString(),
          })
          .eq('id', row.id);
      }
    }

    return json({ processed: rows.length, sent, failed }, 200);
  } catch (err) {
    console.error('process-outbox error:', err);
    return json({ error: 'Outbox drain unavailable' }, 500);
  }
});

async function sendViaResend(row: OutboxRow): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: row.to_email,
        subject: row.subject,
        html: row.html,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { ok: false, error: `resend ${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
