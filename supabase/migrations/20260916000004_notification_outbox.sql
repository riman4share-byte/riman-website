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
