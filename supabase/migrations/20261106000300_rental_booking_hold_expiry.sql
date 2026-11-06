-- Add hold expiry tracking for rental bookings created via create-order (pay-at-atelier).
-- Admin must confirm the booking before the hold expires, otherwise a cleanup job should release it.

ALTER TABLE rental_bookings
  ADD COLUMN IF NOT EXISTS hold_expires_at timestamptz;

COMMENT ON COLUMN rental_bookings.hold_expires_at IS
  'For bookings created via create-order (status=pending), the timestamp when the hold expires if not confirmed by admin.';

-- Add index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_rental_bookings_hold_expires
  ON rental_bookings (hold_expires_at)
  WHERE status = 'pending' AND hold_expires_at IS NOT NULL;