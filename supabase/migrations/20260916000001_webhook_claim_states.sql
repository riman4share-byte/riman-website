-- ============================================
-- Webhook replay safety: claim → work → settle
-- ============================================
-- The original ledger recorded an event as done BEFORE fulfillment ran; a
-- crash mid-work left the claim behind, Stripe retries returned "duplicate",
-- and the order was never fulfilled. Status-aware claims make failures
-- retryable and crashed workers recoverable after a stale window.

ALTER TABLE stripe_processed_events
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'processed'
    CHECK (status IN ('processing', 'processed', 'failed')),
  ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 1 CHECK (attempts >= 1),
  ADD COLUMN IF NOT EXISTS last_error TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS stripe_processed_events_open_claims
  ON stripe_processed_events (status, updated_at)
  WHERE status <> 'processed';

COMMENT ON COLUMN stripe_processed_events.status IS
  'processing = claimed, work running; processed = finished OK; failed = work threw, reclaimable by Stripe retry.';

-- Atomic claim: win fresh, or RE-win a failed/crashed claim. Single call,
-- no select-then-insert race. 'duplicate' means someone else owns it now.
CREATE OR REPLACE FUNCTION claim_stripe_event(
  p_event_id text,
  p_event_type text,
  p_stale_seconds integer DEFAULT 300
) RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  INSERT INTO stripe_processed_events (event_id, event_type, status, updated_at)
  VALUES (p_event_id, p_event_type, 'processing', now())
  ON CONFLICT (event_id) DO NOTHING;
  IF FOUND THEN RETURN 'won'; END IF;

  UPDATE stripe_processed_events
     SET event_type = p_event_type,
         status = 'processing',
         attempts = attempts + 1,
         updated_at = now()
   WHERE stripe_processed_events.event_id = p_event_id
     AND (
           status = 'failed'
        OR (status = 'processing' AND updated_at < now() - make_interval(secs => p_stale_seconds))
     );
  IF FOUND THEN RETURN 'reclaimed'; END IF;

  RETURN 'duplicate';
END $$;

-- Terminal outcome of a claimed attempt.
CREATE OR REPLACE FUNCTION settle_stripe_event(
  p_event_id text,
  p_ok boolean,
  p_error text DEFAULT NULL
) RETURNS void
LANGUAGE sql
SET search_path = public
AS $$
  UPDATE stripe_processed_events
     SET status = CASE WHEN p_ok THEN 'processed' ELSE 'failed' END,
         last_error = CASE WHEN p_ok THEN NULL ELSE left(coalesce(p_error, 'unknown'), 500) END,
         processed_at = CASE WHEN p_ok THEN now() ELSE processed_at END,
         updated_at = now()
   WHERE event_id = p_event_id
     AND status = 'processing';
$$;

REVOKE ALL ON FUNCTION claim_stripe_event(text, text, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION settle_stripe_event(text, boolean, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION claim_stripe_event(text, text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION settle_stripe_event(text, boolean, text) TO service_role;
