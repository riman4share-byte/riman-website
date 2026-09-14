-- ============================================
-- Checkout integrity & webhook idempotency
-- ============================================

-- Server-calculated payment snapshot (integer minor units — AED cents).
ALTER TABLE orders ADD COLUMN IF NOT EXISTS amount_total_cents INTEGER CHECK (amount_total_cents IS NULL OR amount_total_cents >= 0);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency TEXT CHECK (currency IS NULL OR lower(currency) = 'aed');

COMMENT ON COLUMN orders.amount_total_cents IS 'Server-derived total in AED minor units (cents). Never set from browser input.';
COMMENT ON COLUMN orders.currency IS 'ISO currency code for amount_total_cents. Only AED is supported.';

-- One order per Stripe session / payment intent.
CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_session_id_key
  ON orders (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_payment_intent_key
  ON orders (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

-- Webhook idempotency ledger: the UNIQUE event_id primary key guarantees a
-- given Stripe event can only be claimed (and therefore fulfilled) once.
CREATE TABLE IF NOT EXISTS stripe_processed_events (
  event_id   TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE stripe_processed_events ENABLE ROW LEVEL SECURITY;
-- Intentionally NO policies: RLS denies all anon/authenticated access.
-- Only the service-role key (edge functions) can read/write this table.
REVOKE ALL ON stripe_processed_events FROM anon, authenticated;
GRANT ALL ON stripe_processed_events TO service_role;

COMMENT ON TABLE stripe_processed_events IS 'Stripe webhook replay/duplicate protection. Service-role only.';

-- Line-item snapshots are immutable to non-admins: ensure there is no
-- user-facing UPDATE/DELETE policy (admins keep FOR ALL management).
DROP POLICY IF EXISTS "Users can update their order items" ON order_items;
DROP POLICY IF EXISTS "Users can delete their order items" ON order_items;
