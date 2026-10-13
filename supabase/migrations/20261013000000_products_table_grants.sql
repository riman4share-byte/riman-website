-- ============================================
-- Restore the standard table privileges on public.products
-- ============================================
--
-- WHY: public.products was created in 00001_initial_schema.sql with RLS enabled
-- but was never granted table-level privileges. RLS policies decide WHICH ROWS a
-- role may see; they do not grant the underlying table privilege. Without the
-- GRANT, every read fails before RLS is even consulted:
--
--   permission denied for table products   (SQLSTATE 42501)
--   hint: GRANT SELECT ON public.products TO service_role;
--
-- This is invisible in production because the deployed database predates the
-- gap and already carries the grants, but any database built from these
-- migrations alone cannot read products at all. That breaks the storefront's
-- product queries AND the edge functions that read from the catalogue -
-- create-checkout and virtual-tryon both select from this table.
--
-- The privileges below are the standard Supabase set for a public read table:
-- anon/authenticated read (further narrowed by RLS policies), service_role full
-- access. Idempotent, so re-running is safe.

GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO service_role;
