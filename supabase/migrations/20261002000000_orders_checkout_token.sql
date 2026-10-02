-- ============================================
-- Idempotency for order creation.
--
-- A retry, a double-click on "confirm order", or a dropped response previously
-- created a second order AND a second live Stripe session for the same cart.
-- Rental lines self-heal (the first order's date hold blocks the second), but
-- a SALE cart does not: the customer could pay both sessions and one order would
-- be orphaned.
--
-- The browser generates one checkout_token per checkout attempt and sends it
-- with every retry. The unique index turns a replay into a lookup of the
-- original order, and the same value is passed to Stripe as Idempotency-Key so
-- Stripe also collapses the duplicate session.
--
-- Existing orders get a distinct token so the index applies cleanly.
-- ============================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS checkout_token TEXT;

UPDATE public.orders
   SET checkout_token = 'legacy-' || id::text
 WHERE checkout_token IS NULL;

ALTER TABLE public.orders
  ALTER COLUMN checkout_token SET NOT NULL;

-- Partial unique index: only client-generated tokens must be unique, and the
-- legacy backfill above is already unique by construction.
CREATE UNIQUE INDEX IF NOT EXISTS orders_checkout_token_key
  ON public.orders (checkout_token);

COMMENT ON COLUMN public.orders.checkout_token IS
  'Client-generated idempotency key for one checkout attempt. Unique; replaying it returns the original order instead of creating a second one.';