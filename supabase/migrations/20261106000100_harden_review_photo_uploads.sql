-- ============================================
-- Stop direct anonymous/authenticated writes to the public review-photos
-- bucket and enforce server-side bucket limits.
--
-- Review photos are uploaded through the upload-review-photo edge function,
-- which validates the file signature, enforces 5 MB, rate-limits the caller,
-- and writes with the service role. Anonymous/authenticated users can no
-- longer write review photos directly.
--
-- Admin product images still use a direct Storage upload, so keep a narrow
-- INSERT policy limited to admins and the products/ prefix.
-- ============================================

DROP POLICY IF EXISTS "Anon upload review-photos" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload review-photos" ON storage.objects;

DROP POLICY IF EXISTS "Admin upload review-photos" ON storage.objects;
CREATE POLICY "Admin upload review-photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'review-photos'
    AND public.is_admin()
    AND (storage.foldername(name))[1] = 'products'
  );

UPDATE storage.buckets
   SET file_size_limit = 5242880,
       allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
 WHERE id = 'review-photos';
