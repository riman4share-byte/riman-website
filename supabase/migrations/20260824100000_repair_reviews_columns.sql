-- Repair: the deployed reviews table predates 20260824000000_create_reviews.sql
-- and is missing photo_url/status. Add them idempotently and align RLS.

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
