-- ============================================
-- Per-IP rate limiting for the public checkout edge functions
-- ============================================
-- create-order and create-checkout are deployed --no-verify-jwt (guest
-- checkout). CORS is not a boundary — curl ignores it. This gives each
-- function a fixed atomic budget per IP per window.

CREATE TABLE IF NOT EXISTS function_rate_limits (
  bucket       TEXT        NOT NULL,
  scope_key    TEXT        NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  hits         INTEGER     NOT NULL DEFAULT 1 CHECK (hits >= 1),
  PRIMARY KEY (bucket, scope_key, window_start)
);

ALTER TABLE function_rate_limits ENABLE ROW LEVEL SECURITY;
-- Intentionally NO policies: service-role only (edge functions).
REVOKE ALL ON function_rate_limits FROM anon, authenticated;
GRANT ALL ON function_rate_limits TO service_role;

-- Fixed-window counter, one atomic statement. TRUE = within budget.
CREATE OR REPLACE FUNCTION try_rate_limit(
  p_bucket TEXT,
  p_scope_key TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
) RETURNS BOOLEAN
LANGUAGE sql
SET search_path = public
AS $$
  INSERT INTO function_rate_limits (bucket, scope_key, window_start, hits)
  VALUES (
    p_bucket,
    p_scope_key,
    to_timestamp(floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds),
    1
  )
  ON CONFLICT (bucket, scope_key, window_start)
  DO UPDATE SET hits = function_rate_limits.hits + 1
  RETURNING (hits <= p_limit);
$$;

REVOKE ALL ON FUNCTION try_rate_limit(TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION try_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO service_role;

COMMENT ON TABLE function_rate_limits IS
  'Fixed-window per-IP counters for public edge functions. Rows age out by window; purge periodically if desired.';
