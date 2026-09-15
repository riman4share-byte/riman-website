# Supabase Backend — Deploy & Operations Runbook

## 2026-09-16 hardening — apply in THIS ORDER
1. **Migrations** (5 new files in `supabase/migrations/`, dated 20260916…):
   webhook claim states → rental overlap exclusion → rate limiting → outbox +
   `needs_review` → orders server-created-only.
   Dashboard → SQL Editor, run each file top-to-bottom in filename order.
   (`20260916000002` needs `btree_gist` — Supabase allows enabling it.)
2. **Deploy functions** (Step B below) — `create-checkout` and `stripe-webhook`
   call `try_rate_limit`/`claim_stripe_event`; they fail OPEN with loud logs if
   migrations aren't applied yet, but don't linger in that state.
3. Set new secrets (Step C), then Stripe webhook events (Step D).

> **Orders are now server-created ONLY.** RLS rejects client INSERT on `orders`
> (migration 000005) and the frontend no longer falls back to client-side order
> creation. Before this runbook is complete on a given project, checkout of
> in-atelier-payment orders will ERROR (by design — never silently downgrade).

## A. Architecture (trust model)
| Piece | Who may write | Notes |
|---|---|---|
| `orders`, `order_items` | service_role only (edge functions) | prices derived from DB; browser sends ids/qty/intent/dates only |
| `rental_bookings` | service_role + admins | `rental_bookings_no_overlap` EXCLUDE constraint blocks double-booking at the DB; card checkouts HOLD windows as `pending_payment` (webhook confirms, `checkout.session.expired` releases) |
| `stripe_processed_events` | service_role only | claim → work → settle; failed work is RETRIED by Stripe (reclaimable), stale crashed claims taken over after 5 min |
| `notification_outbox` | service_role only | transactional emails queued durably; drained by `process-outbox` |
| `function_rate_limits` | service_role only | fixed-window per-IP budget for public functions |

## B. Deploy the 5 functions
Folder upload REQUIRED — every function imports `_shared/*` (single-file
dashboard paste no longer works):
```
supabase login
supabase link --project-ref <your-project-ref>
supabase functions deploy create-checkout --no-verify-jwt
supabase functions deploy create-order --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy process-outbox --no-verify-jwt
supabase functions deploy send-notification          # KEEP JWT verification
```

## C. Secrets (Dashboard → Settings → API Keys → Edge Functions secrets)
Required:
- `STRIPE_SECRET_KEY` (sk_live_… / sk_test_…)
- `STRIPE_WEBHOOK_SECRET` (whsec_… — from Step D)
- `RESEND_API_KEY`
- `SITE_URL` = `https://riman.ae` — success/cancel URLs + CORS are built from
  this; it is NEVER taken from the request body.
- `ADMIN_ALERT_EMAIL` (defaults to hello@riman.ae if unset)
- `OUTBOX_WORKER_SECRET` = long random string (cron → process-outbox auth)
Optional hardening:
- `ALLOWED_SITE_ORIGINS` = comma list (staging, www)
- `TURNSTILE_SITE_KEY`/`TURNSTILE_SECRET_KEY` — when the secret is set, BOTH
  public checkout functions require a server-verified captcha token.
- `CHECKOUT_RATE_LIMIT_MAX` / `CHECKOUT_RATE_LIMIT_WINDOW_S` (default 10/600s),
  `ORDER_RATE_LIMIT_MAX` / `ORDER_RATE_LIMIT_WINDOW_S` (default 15/600s)

## D. Stripe webhook
Endpoint: `https://<ref>.supabase.co/functions/v1/stripe-webhook`
Events: `checkout.session.completed`, `checkout.session.expired`
(the expired event is what releases pending_payment rental holds — subscribe).

## E. Outbox drain (cron)
Dashboard → Database → Extensions → enable `pg_cron` + `pg_net`, then:
```sql
SELECT cron.schedule('outbox-drain', '*/5 * * * *', $$
  SELECT net.http_post(
    url := 'https://<ref>.supabase.co/functions/v1/process-outbox',
    headers := '{"Content-Type":"application/json","x-outbox-secret":"<OUTBOX_WORKER_SECRET>"}'::jsonb,
    body := '{}'::jsonb
  );
$$);
```

## F. The frontend needs NO endpoint env vars anymore
`create-checkout` / `create-order` URLs are derived from `VITE_SUPABASE_URL`
(`/functions/v1/...`). Explicit `VITE_STRIPE_CHECKOUT_ENDPOINT` /
`VITE_CREATE_ORDER_ENDPOINT` still win if set.

## G. Verify (after every deploy/config change)
```
npm run verify:env        # URL+anon key are a live matching pair (would have
                          # caught the 2026-09-16 corrupted-.env outage)
```
Then, in the app: place a card order → money derives server-side; return to
Stripe success page → order flips to paid (webhook or verify, exactly once) →
confirmation mail from outbox within ~5 min → rental dates show blocked in
admin; complete a second checkout overlapping the first paid rental → 409.

## Notes
- If the service-role key ever leaks: Dashboard → Settings → API Keys → Roll,
  then re-set `SUPABASE_SERVICE_ROLE_KEY` is NOT needed (auto-injected per
  function), but REDEPLOY nothing persists the old key — it's read at runtime.
- Stripe test mode end-to-end: `stripe listen --forward-to localhost function`
  per Stripe docs, with a test `STRIPE_WEBHOOK_SECRET`.
