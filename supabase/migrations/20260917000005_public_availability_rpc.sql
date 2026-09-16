-- Public rental availability (no customer PII — dates only) + drop audit helper.
-- Direct SELECT on rental_bookings is owner/admin-only, so the public
-- calendar saw zero bookings and showed everything as available.
CREATE OR REPLACE FUNCTION public.product_booked_dates(p_product_id text)
RETURNS TABLE (start_date date, end_date date)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT start_date, end_date FROM rental_bookings
  WHERE product_id = p_product_id AND status <> 'cancelled';
$$;
GRANT EXECUTE ON FUNCTION public.product_booked_dates(text) TO anon, authenticated;

DROP FUNCTION IF EXISTS public.diag_audit();
NOTIFY pgrst, 'reload schema';
