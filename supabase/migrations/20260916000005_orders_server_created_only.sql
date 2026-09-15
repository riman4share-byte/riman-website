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
