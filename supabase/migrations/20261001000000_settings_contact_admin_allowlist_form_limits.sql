-- ============================================
-- Correct seeded contact details, hide the admin allowlist, and
-- rate-limit the two anonymous public forms.
--
-- WHY
--  1. The seed shipped placeholder contact values (+971 50 123 4567 for both
--     the phone and WhatsApp). SettingsContext merges the DB block OVER its
--     own defaults, so the placeholder won at runtime and the live WhatsApp
--     float button pointed at a number that is not the atelier's. A bridal
--     site with a wrong contact number loses enquiries.
--  2. `admin_emails` lived in site_settings, whose SELECT policy is
--     "USING (true)" -- publicly readable. Anyone could enumerate the owner's
--     address, and handle_new_user() granted role='admin' to any signup
--     matching that publicly readable list. Moved to a table with no anon
--     policy at all.
--  3. appointments and contact_submissions accept anonymous INSERTs straight
--     through PostgREST, bypassing the per-IP limiting that protects the
--     checkout functions. Added a BEFORE INSERT trigger that reuses
--     try_rate_limit().
--
-- Safe to run more than once.
-- ============================================

-- ── 1. Correct the seeded settings ────────────────────────────────
-- jsonb_set keeps any other key an admin has since added to the block.
-- Only the two phone numbers are corrected here. The live contact email
-- (info@riman.ae) is a deliberate business value and is deliberately left
-- untouched: this migration must not decide which address the atelier wants.
UPDATE site_settings
   SET value = jsonb_set(value, '{phone}', '"+971 55 373 0792"'::jsonb)
 WHERE key = 'contact';

UPDATE site_settings
   SET value = jsonb_set(value, '{whatsapp}', '"+971553730792"'::jsonb)
 WHERE key = 'social';

-- Policy copy shown to clients at checkout. The old wording still said
-- "No online payment" while Stripe card payment is live.
UPDATE site_settings
   SET value = jsonb_set(
         value,
         '{lateReturnFee}',
         '"AED 500 per day after the hire period ends."'::jsonb)
 WHERE key = 'policies';

UPDATE site_settings
   SET value = jsonb_set(
         value,
         '{shippingInfo}',
         '"Worldwide delivery - arranged and confirmed by the atelier owner via WhatsApp."'::jsonb)
 WHERE key = 'policies';

-- ── 2. Admin allowlist: out of the public settings table ──────────
CREATE TABLE IF NOT EXISTS admin_allowlist (
  email TEXT PRIMARY KEY CHECK (position('@' in email) > 1)
);

ALTER TABLE admin_allowlist ENABLE ROW LEVEL SECURITY;
-- Deliberately no policies: anon and authenticated get nothing. Only the
-- service role (edge functions, admin tooling) can read this table.
REVOKE ALL ON admin_allowlist FROM anon, authenticated;
GRANT ALL ON admin_allowlist TO service_role;

-- Carry any existing list across, then drop it from the public table.
INSERT INTO admin_allowlist (email)
SELECT lower(trim(value_element))
  FROM site_settings,
       LATERAL jsonb_array_elements_text(value) AS value_element
 WHERE key = 'admin_emails'
ON CONFLICT (email) DO NOTHING;

DELETE FROM site_settings WHERE key = 'admin_emails';

-- Point the signup trigger at the private table. SECURITY DEFINER (as before)
-- so the role check can read a table the caller cannot.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE
      WHEN EXISTS (SELECT 1 FROM admin_allowlist WHERE email = lower(NEW.email))
      THEN 'admin'
      ELSE 'client'
    END
  );
  RETURN NEW;
END;
$$;

-- ── 3. Rate-limit the anonymous public forms ─────────────────────
CREATE OR REPLACE FUNCTION public.guard_public_form_insert()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hdrs   TEXT;
  ip     TEXT;
  bucket TEXT := TG_TABLE_NAME;
  budget INT;
BEGIN
  hdrs := current_setting('request.headers', true);
  IF hdrs IS NULL OR hdrs = '' THEN
    RETURN NEW;  -- no proxy headers (direct SQL, local): cannot rate limit
  END IF;

  BEGIN
    ip := split_part(hdrs::jsonb ->> 'x-forwarded-for', ',', 1);
  EXCEPTION WHEN OTHERS THEN
    RETURN NEW;  -- unparseable header: fail open rather than block bookings
  END;

  ip := btrim(coalesce(ip, ''));
  IF ip = '' THEN
    RETURN NEW;
  END IF;

  -- A couple of genuine enquiries per hour from one address; a shared office
  -- or hotel network can still reach a person.
  budget := CASE bucket
              WHEN 'appointments' THEN 10
              ELSE 5
            END;

  IF NOT public.try_rate_limit(bucket, ip, budget, 3600) THEN
    RAISE EXCEPTION
      'Too many submissions from this connection. Please try again later, or message the atelier on WhatsApp.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_appointments ON public.appointments;
CREATE TRIGGER trg_guard_appointments
  BEFORE INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.guard_public_form_insert();

DROP TRIGGER IF EXISTS trg_guard_contact_submissions ON public.contact_submissions;
CREATE TRIGGER trg_guard_contact_submissions
  BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.guard_public_form_insert();