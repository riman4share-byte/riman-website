-- COMBINED ONE-SHOT SCRIPT: all 5 migrations of 2026-09-16, already in correct order.
-- Paste this ENTIRE file into Supabase SQL Editor and press Run. Safe to re-run twice.


-- ========== 20260916000001_webhook_claim_states.sql ==========
-- ============================================
-- Webhook replay safety: claim → work → settle
-- ============================================
-- The original ledger recorded an event as done BEFORE fulfillment ran; a
-- crash mid-work left the claim behind, Stripe retries returned "duplicate",
-- and the order was never fulfilled. Status-aware claims make failures
-- retryable and crashed workers recoverable after a stale window.

ALTER TABLE stripe_processed_events
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'processed'
    CHECK (status IN ('processing', 'processed', 'failed')),
  ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 1 CHECK (attempts >= 1),
  ADD COLUMN IF NOT EXISTS last_error TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS stripe_processed_events_open_claims
  ON stripe_processed_events (status, updated_at)
  WHERE status <> 'processed';

COMMENT ON COLUMN stripe_processed_events.status IS
  'processing = claimed, work running; processed = finished OK; failed = work threw, reclaimable by Stripe retry.';

-- Atomic claim: win fresh, or RE-win a failed/crashed claim. Single call,
-- no select-then-insert race. 'duplicate' means someone else owns it now.
CREATE OR REPLACE FUNCTION claim_stripe_event(
  p_event_id text,
  p_event_type text,
  p_stale_seconds integer DEFAULT 300
) RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  INSERT INTO stripe_processed_events (event_id, event_type, status, updated_at)
  VALUES (p_event_id, p_event_type, 'processing', now())
  ON CONFLICT (event_id) DO NOTHING;
  IF FOUND THEN RETURN 'won'; END IF;

  UPDATE stripe_processed_events
     SET event_type = p_event_type,
         status = 'processing',
         attempts = attempts + 1,
         updated_at = now()
   WHERE stripe_processed_events.event_id = p_event_id
     AND (
           status = 'failed'
        OR (status = 'processing' AND updated_at < now() - make_interval(secs => p_stale_seconds))
     );
  IF FOUND THEN RETURN 'reclaimed'; END IF;

  RETURN 'duplicate';
END $$;

-- Terminal outcome of a claimed attempt.
CREATE OR REPLACE FUNCTION settle_stripe_event(
  p_event_id text,
  p_ok boolean,
  p_error text DEFAULT NULL
) RETURNS void
LANGUAGE sql
SET search_path = public
AS $$
  UPDATE stripe_processed_events
     SET status = CASE WHEN p_ok THEN 'processed' ELSE 'failed' END,
         last_error = CASE WHEN p_ok THEN NULL ELSE left(coalesce(p_error, 'unknown'), 500) END,
         processed_at = CASE WHEN p_ok THEN now() ELSE processed_at END,
         updated_at = now()
   WHERE event_id = p_event_id
     AND status = 'processing';
$$;

REVOKE ALL ON FUNCTION claim_stripe_event(text, text, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION settle_stripe_event(text, boolean, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION claim_stripe_event(text, text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION settle_stripe_event(text, boolean, text) TO service_role;


-- ========== 20260916000002_rental_overlap_exclusion.sql ==========
-- ============================================
-- Rental double-booking: race-safe exclusion constraint
-- ============================================
-- Replaces the 00001 select-then-insert trigger (two concurrent
-- transactions could both pass the EXISTS check, and its closed-interval
-- comparison contradicted the app's half-open [start, end) semantics —
-- adjacent bookings pre-checked OK then failed at INSERT).

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- New lifecycle states: pending_payment (Stripe checkout holds the window
-- until checkout.session.expired) and released (abandoned/failed — free).
ALTER TABLE rental_bookings DROP CONSTRAINT IF EXISTS rental_bookings_status_check;
ALTER TABLE rental_bookings ADD CONSTRAINT rental_bookings_status_check CHECK (
  status IN ('confirmed', 'active', 'returned', 'overdue', 'cancelled', 'pending_payment', 'released')
);

-- NULL ranges are never excluded → inactive statuses fall out automatically.
ALTER TABLE rental_bookings ADD COLUMN IF NOT EXISTS blocking_range daterange
  GENERATED ALWAYS AS (
    CASE WHEN status NOT IN ('cancelled', 'released')
         THEN daterange(start_date, end_date, '[)')
    END
  ) STORED;

DROP TRIGGER IF EXISTS check_double_booking ON rental_bookings;
DROP FUNCTION IF EXISTS prevent_double_booking();

ALTER TABLE rental_bookings DROP CONSTRAINT IF EXISTS rental_bookings_no_overlap;
ALTER TABLE rental_bookings ADD CONSTRAINT rental_bookings_no_overlap
  EXCLUDE USING gist (product_id WITH =, blocking_range WITH &&)
  WHERE (blocking_range IS NOT NULL);

-- One booking row per paid order line — webhook re-flips are updates, never
-- second inserts.
CREATE UNIQUE INDEX IF NOT EXISTS rental_bookings_order_item_key
  ON rental_bookings (order_item_id)
  WHERE order_item_id IS NOT NULL;

-- Payment holds must unwind with their order line. Without CASCADE, deleting
-- an order (failed session / rollback) is BLOCKED by its pending_payment
-- bookings, and a Stripe 'expired' event can never arrive for a session that
-- was never created — leaving the window blocked forever.
ALTER TABLE rental_bookings DROP CONSTRAINT IF EXISTS rental_bookings_order_item_id_fkey;
ALTER TABLE rental_bookings ADD CONSTRAINT rental_bookings_order_item_id_fkey
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE;

COMMENT ON COLUMN rental_bookings.blocking_range IS
  'Half-open [start, end) daterange for active holds; NULL for cancelled/released. Backs the exclusion constraint.';


-- ========== 20260916000003_rate_limiting.sql ==========
-- ============================================
-- Per-IP rate limiting for the public checkout edge functions
-- ============================================
-- create-order and create-checkout are deployed --no-verify-jwt (guest
-- checkout). CORS is not a boundary — curl ignores it. This gives each
-- function a fixed atomic budget per IP per window.

CREATE TABLE IF NOT EXISTS function_rate_limits (
  bucket       TEXT        NOT NULL,
  scope_key    TEXT        NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  hits         INTEGER     NOT NULL DEFAULT 1 CHECK (hits >= 1),
  PRIMARY KEY (bucket, scope_key, window_start)
);

ALTER TABLE function_rate_limits ENABLE ROW LEVEL SECURITY;
-- Intentionally NO policies: service-role only (edge functions).
REVOKE ALL ON function_rate_limits FROM anon, authenticated;
GRANT ALL ON function_rate_limits TO service_role;

-- Fixed-window counter, one atomic statement. TRUE = within budget.
CREATE OR REPLACE FUNCTION try_rate_limit(
  p_bucket TEXT,
  p_scope_key TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
) RETURNS BOOLEAN
LANGUAGE sql
SET search_path = public
AS $$
  INSERT INTO function_rate_limits (bucket, scope_key, window_start, hits)
  VALUES (
    p_bucket,
    p_scope_key,
    to_timestamp(floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds),
    1
  )
  ON CONFLICT (bucket, scope_key, window_start)
  DO UPDATE SET hits = function_rate_limits.hits + 1
  RETURNING (hits <= p_limit);
$$;

REVOKE ALL ON FUNCTION try_rate_limit(TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION try_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO service_role;

COMMENT ON TABLE function_rate_limits IS
  'Fixed-window per-IP counters for public edge functions. Rows age out by window; purge periodically if desired.';


-- ========== 20260916000004_notification_outbox.sql ==========
-- ============================================
-- Notification outbox + needs_review order state
-- ============================================
-- Durably record transactional emails before attempting them, so a flaky
-- mail provider can never silently lose an order confirmation or an admin
-- alert. A worker (process-outbox function) retries what is still pending.

-- Amount-mismatch and double-booking conflicts must be VISIBLE, not log lines.
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (
  status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'needs_review')
);

CREATE TABLE IF NOT EXISTS notification_outbox (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind            TEXT NOT NULL,               -- order_confirmed | admin_order_alert | amount_mismatch | booking_conflict
  to_email        TEXT NOT NULL,
  subject         TEXT NOT NULL,
  html            TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts        INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_error      TEXT,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS notification_outbox_pending_due
  ON notification_outbox (next_attempt_at)
  WHERE status = 'pending';

ALTER TABLE notification_outbox ENABLE ROW LEVEL SECURITY;
-- Service-role only: contents include PII (customer emails, order data).
REVOKE ALL ON notification_outbox FROM anon, authenticated;
GRANT ALL ON notification_outbox TO service_role;

COMMENT ON TABLE notification_outbox IS
  'Transactional email queue. Enqueued by checkout/webhook functions; drained by the process-outbox edge function (cron backstop).';

-- Atomic batch claim for the drain worker: concurrent runs can never grab
-- the same row twice (FOR UPDATE SKIP LOCKED), and claiming bumps attempts.
CREATE OR REPLACE FUNCTION claim_pending_notifications(p_limit INTEGER DEFAULT 5)
RETURNS SETOF notification_outbox
LANGUAGE sql
SET search_path = public
AS $$
  UPDATE notification_outbox
     SET attempts = attempts + 1
   WHERE id IN (
     SELECT id FROM notification_outbox
      WHERE status = 'pending' AND next_attempt_at <= now()
      ORDER BY next_attempt_at
      FOR UPDATE SKIP LOCKED
      LIMIT p_limit
   )
  RETURNING *;
$$;

REVOKE ALL ON FUNCTION claim_pending_notifications(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION claim_pending_notifications(INTEGER) TO service_role;


-- ========== 20260916000005_orders_server_created_only.sql ==========
-- ============================================
-- Checkout trust boundary: orders are server-created, only
-- ============================================
-- The browser must not be able to INSERT an order at all. Pricing was
-- already server-derived in the create-order / create-checkout functions;
-- this closes the side door where RLS let a logged-in user insert orders
-- with an arbitrary subtotal ("Users can create orders", 00001:157) —
-- the only consumer of that policy was the (silent, and for guests
-- already non-functional) client-side checkout fallback, which is being
-- removed alongside this migration.
--
-- Admin flows are untouched: they act through "Admins can manage orders"
-- (UPDATE) / FOR ALL policies on related tables, and the edge functions
-- use the service role.

DROP POLICY IF EXISTS "Users can create orders" ON orders;

COMMENT ON TABLE orders IS
  'INSERT only via service_role (create-order / create-checkout edge functions). Users may only SELECT their own orders; admins may UPDATE.';

