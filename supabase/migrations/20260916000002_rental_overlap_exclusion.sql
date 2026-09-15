-- ============================================
-- Rental double-booking: race-safe exclusion constraint
-- ============================================
-- Replaces the 00001 select-then-insert trigger (two concurrent
-- transactions could both pass the EXISTS check, and its closed-interval
-- comparison contradicted the app's half-open [start, end) semantics —
-- adjacent bookings pre-checked OK then failed at INSERT).

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- New lifecycle states: pending_payment (Stripe checkout holds the window
-- until checkout.session.expired) and released (abandoned/failed — free).
ALTER TABLE rental_bookings DROP CONSTRAINT IF EXISTS rental_bookings_status_check;
ALTER TABLE rental_bookings ADD CONSTRAINT rental_bookings_status_check CHECK (
  status IN ('confirmed', 'active', 'returned', 'overdue', 'cancelled', 'pending_payment', 'released')
);

-- NULL ranges are never excluded → inactive statuses fall out automatically.
ALTER TABLE rental_bookings ADD COLUMN IF NOT EXISTS blocking_range daterange
  GENERATED ALWAYS AS (
    CASE WHEN status NOT IN ('cancelled', 'released')
         THEN daterange(start_date, end_date, '[)')
    END
  ) STORED;

DROP TRIGGER IF EXISTS check_double_booking ON rental_bookings;
DROP FUNCTION IF EXISTS prevent_double_booking();

ALTER TABLE rental_bookings DROP CONSTRAINT IF EXISTS rental_bookings_no_overlap;
ALTER TABLE rental_bookings ADD CONSTRAINT rental_bookings_no_overlap
  EXCLUDE USING gist (product_id WITH =, blocking_range WITH &&)
  WHERE (blocking_range IS NOT NULL);

-- One booking row per paid order line — webhook re-flips are updates, never
-- second inserts.
CREATE UNIQUE INDEX IF NOT EXISTS rental_bookings_order_item_key
  ON rental_bookings (order_item_id)
  WHERE order_item_id IS NOT NULL;

-- Payment holds must unwind with their order line. Without CASCADE, deleting
-- an order (failed session / rollback) is BLOCKED by its pending_payment
-- bookings, and a Stripe 'expired' event can never arrive for a session that
-- was never created — leaving the window blocked forever.
ALTER TABLE rental_bookings DROP CONSTRAINT IF EXISTS rental_bookings_order_item_id_fkey;
ALTER TABLE rental_bookings ADD CONSTRAINT rental_bookings_order_item_id_fkey
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE;

COMMENT ON COLUMN rental_bookings.blocking_range IS
  'Half-open [start, end) daterange for active holds; NULL for cancelled/released. Backs the exclusion constraint.';
