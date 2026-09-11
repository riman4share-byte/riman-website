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
