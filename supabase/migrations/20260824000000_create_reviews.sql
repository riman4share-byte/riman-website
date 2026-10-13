-- Customer reviews with admin moderation
-- Public: read approved reviews, submit pending reviews
-- Admin: full control

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- The CREATE TABLE above is a no-op on databases where 00001_initial_schema.sql
-- already created `reviews` - and that older table has `is_approved` but neither
-- `status` nor `photo_url`. Without these, the index and the RLS policies below
-- fail with "column status does not exist" (SQLSTATE 42703) on a fresh database,
-- because 20260824100000_repair_reviews_columns.sql (which adds them) has not
-- run yet. Adding them here makes this migration self-sufficient. Same
-- idempotent technique the repair migration uses.
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved'));

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews (status);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved" ON reviews;
CREATE POLICY "Public read approved" ON reviews
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Public submit pending" ON reviews;
CREATE POLICY "Public submit pending" ON reviews
  FOR INSERT WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Admin read all" ON reviews;
CREATE POLICY "Admin read all" ON reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admin update" ON reviews;
CREATE POLICY "Admin update" ON reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admin delete" ON reviews;
CREATE POLICY "Admin delete" ON reviews
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
