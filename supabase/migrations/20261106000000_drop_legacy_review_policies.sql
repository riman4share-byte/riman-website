-- ============================================
-- Close the legacy review moderation bypass.
--
-- 00001_initial_schema.sql created:
--   "Authenticated users can create reviews" (WITH CHECK auth.uid() = user_id)
--   "Approved reviews are viewable by everyone" (USING is_approved = true)
--
-- Later review migrations added status/photo_url and new policy names, but
-- never dropped those two legacy policies. Permissive RLS policies are OR-ed,
-- so an authenticated user could insert a row with status='approved' and
-- is_approved=true and bypass moderation.
--
-- This migration removes both legacy policies and makes the public submission
-- path explicitly pending-only. Admin policies remain the only way to approve.
-- ============================================

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE public.reviews
  ALTER COLUMN is_approved SET DEFAULT false;

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Approved reviews are viewable by everyone" ON public.reviews;

DROP POLICY IF EXISTS "Public submit pending" ON public.reviews;
CREATE POLICY "Public submit pending" ON public.reviews
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending' AND is_approved = false);

-- The newer SELECT policy is status-based and already approval-gated.
DROP POLICY IF EXISTS "Public read approved" ON public.reviews;
CREATE POLICY "Public read approved" ON public.reviews
  FOR SELECT TO anon, authenticated
  USING (status = 'approved');
