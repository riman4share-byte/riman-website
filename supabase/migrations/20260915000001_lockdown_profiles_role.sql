-- P0: Prevent privilege escalation via profiles.role self-write.
-- 1. Tighten UPDATE policy so WITH CHECK forbids role change by non-admins.
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (
      public.is_admin()
      OR role = (SELECT p.role FROM profiles p WHERE p.id = auth.uid())
    )
  );

-- 2. Defense-in-depth trigger: strip role changes from non-admins.
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS prevent_role_escalation ON profiles;
CREATE TRIGGER prevent_role_escalation
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- 3. New profiles default to client; only admins/service_role may set admin.
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'client';
