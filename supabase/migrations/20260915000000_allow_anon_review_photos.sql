-- Allow anonymous review-photo uploads (5MB limit enforced client-side in upload.ts).
-- Scoped to review-photos bucket only; public read already enabled.
-- Re-runnable: the live database already carries this policy because it was
-- created by pasting schema.sql, and a bare CREATE POLICY aborts the push.
DROP POLICY IF EXISTS "Anon upload review-photos" ON storage.objects;
CREATE POLICY "Anon upload review-photos"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'review-photos');
