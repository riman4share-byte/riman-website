-- ============================================
-- Track the PaymentIntent so refunds can be matched back to an order.
--
-- Stripe sends refund/dispute events against the Charge or PaymentIntent, not
-- against the Checkout Session. Session metadata (metadata[order_id]) is not
-- carried there, so before this column a refund could not be attributed to an
-- order at all: the webhook ignored it, the order stayed 'paid' forever, and a
-- refunded rental kept its 'confirmed' booking — which keeps blocking those
-- dates for every other customer.
--
-- Populated on checkout.session.completed, then indexed because every refund
-- lookup goes through it.
-- ============================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

CREATE INDEX IF NOT EXISTS orders_stripe_payment_intent_idx
  ON public.orders (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

COMMENT ON COLUMN public.orders.stripe_payment_intent_id IS
  'Stripe PaymentIntent id captured at fulfillment; the join key for charge.refunded / dispute events.';
