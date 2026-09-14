-- Allow anonymous review-photo uploads (5MB limit enforced client-side in upload.ts).
-- Scoped to review-photos bucket only; public read already enabled.
CREATE POLICY "Anon upload review-photos"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'review-photos');
