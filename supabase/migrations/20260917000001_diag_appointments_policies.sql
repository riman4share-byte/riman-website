-- Temporary diagnostic: expose appointments RLS policies to anon so we can
-- confirm via REST what the API actually sees. Removed in a later migration.
CREATE OR REPLACE FUNCTION public.diag_appointments_policies()
RETURNS TABLE (policyname text, cmd text, roles text, qual text, with_check text)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT policyname::text, cmd::text, roles::text, qual::text, with_check::text
  FROM pg_policies WHERE schemaname = 'public' AND tablename = 'appointments';
$$;
GRANT EXECUTE ON FUNCTION public.diag_appointments_policies() TO anon, authenticated;
NOTIFY pgrst, 'reload schema';
