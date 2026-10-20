-- ============================================
-- STORAGE - Buckets & policies for imagery
-- (idempotent: safe to re-run)
-- ============================================

-- public.is_admin() is otherwise first defined in
-- 20260728010000_fix_profiles_rls_recursion.sql - 24 migrations AFTER this file,
-- which is why a from-scratch `supabase start` failed here with
-- "function public.is_admin() does not exist (SQLSTATE 42883)".
--
-- The predicate is defined here too, so this file is self-contained. It is the
-- same definition, and the later migration still CREATE OR REPLACEs it, so the
-- end state is identical. `supabase migration up` orders by version, so a new
-- file cannot be inserted before this one; defining it here is the only way to
-- make fresh databases build. Already-migrated databases are unaffected - this
-- version is recorded as applied and will not re-run.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- Buckets: product imagery + gallery + customer review photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true),
       ('gallery', 'gallery', true),
       ('review-photos', 'review-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Public read of uploaded objects
DROP POLICY IF EXISTS "Public read product-images" ON storage.objects;
CREATE POLICY "Public read product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;
CREATE POLICY "Public read gallery"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

-- Admin-only upload / update / delete (authenticated clients must NOT write)
DROP POLICY IF EXISTS "Auth upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload product-images" ON storage.objects;
CREATE POLICY "Admin upload product-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Auth update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update product-images" ON storage.objects;
CREATE POLICY "Admin update product-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Auth delete product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete product-images" ON storage.objects;
CREATE POLICY "Admin delete product-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Auth upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload gallery" ON storage.objects;
CREATE POLICY "Admin upload gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

DROP POLICY IF EXISTS "Auth update gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admin update gallery" ON storage.objects;
CREATE POLICY "Admin update gallery"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery' AND public.is_admin());

DROP POLICY IF EXISTS "Auth delete gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete gallery" ON storage.objects;
CREATE POLICY "Admin delete gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND public.is_admin());

-- Public read of review photos
DROP POLICY IF EXISTS "Public read review-photos" ON storage.objects;
CREATE POLICY "Public read review-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-photos');

-- Review photos: customers may upload, only admins can overwrite/delete
DROP POLICY IF EXISTS "Auth upload review-photos" ON storage.objects;
CREATE POLICY "Auth upload review-photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-photos');

DROP POLICY IF EXISTS "Admin update review-photos" ON storage.objects;
CREATE POLICY "Admin update review-photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'review-photos' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete review-photos" ON storage.objects;
CREATE POLICY "Admin delete review-photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'review-photos' AND public.is_admin());
