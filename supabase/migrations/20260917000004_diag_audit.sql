-- Temporary diagnostic (removed after use): policies + columns for audit.
DROP FUNCTION IF EXISTS public.diag_audit();
CREATE FUNCTION public.diag_audit()
RETURNS TABLE (k text, v text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY SELECT ('policy:' || schemaname || '.' || tablename || '.' || policyname)::text,
    ('cmd=' || cmd || ' roles=' || roles::text || ' qual=' || COALESCE(qual, '(none)') || ' check=' || COALESCE(with_check, '(none)'))::text
    FROM pg_policies WHERE tablename IN ('contact_submissions', 'reviews', 'rental_bookings', 'products', 'orders', 'appointments');
  RETURN QUERY SELECT ('col:' || table_name || '.' || column_name)::text, data_type::text
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name IN ('reviews', 'contact_submissions', 'rental_bookings', 'appointments');
END;
$$;
GRANT EXECUTE ON FUNCTION public.diag_audit() TO anon, authenticated;
NOTIFY pgrst, 'reload schema';
