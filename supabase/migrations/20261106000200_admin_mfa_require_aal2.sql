-- Require AAL2 (MFA) for admin operations when the admin has MFA enrolled.
-- This ensures stolen passwords alone cannot perform admin actions.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
      AND (
        -- No verified MFA factors enrolled -> password-only is OK
        NOT EXISTS (
          SELECT 1 FROM auth.mfa_factors
          WHERE user_id = auth.uid() AND status = 'verified'
        )
        -- MFA enrolled -> require AAL2 (second factor completed)
        OR (auth.jwt() ->> 'aal') = 'aal2'
      )
  );
$$;