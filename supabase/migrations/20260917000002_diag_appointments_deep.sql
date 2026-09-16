-- Deepen diagnostic: who am I, which schemas hold an appointments table.
DROP FUNCTION IF EXISTS public.diag_appointments_policies();
CREATE OR REPLACE FUNCTION public.diag_appointments_policies()
RETURNS TABLE (k text, v text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY SELECT 'current_user'::text, current_user::text;
  RETURN QUERY SELECT 'session_role'::text, current_setting('role', true)::text;
  RETURN QUERY SELECT 'jwt_role'::text, COALESCE(auth.jwt() ->> 'role', '(none)')::text;
  RETURN QUERY SELECT ('table:' || table_schema)::text, table_schema::text
    FROM information_schema.tables WHERE table_name = 'appointments';
  RETURN QUERY SELECT ('policy:' || schemaname || '.' || policyname)::text,
    ('cmd=' || cmd || ' roles=' || roles::text || ' check=' || COALESCE(with_check, '(none)'))::text
    FROM pg_policies WHERE tablename = 'appointments';
END;
$$;
GRANT EXECUTE ON FUNCTION public.diag_appointments_policies() TO anon, authenticated;
NOTIFY pgrst, 'reload schema';
