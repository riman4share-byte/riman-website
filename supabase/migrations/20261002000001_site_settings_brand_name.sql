-- ============================================
-- Finish the brand rename in live data.
--
-- The July rebrand renamed the customer-facing copy in code, but the row in
-- site_settings was edited before that rename and still shipped the old name
-- in the site's <meta name="description"> and every social share preview.
-- Code defaults and schema already say "Riman Fashion", so the live row was
-- the last place the old brand survived.
--
-- Patched in place (jsonb_set on the single key) rather than replacing the
-- object, so any other settings the owner has since edited are preserved.
-- Idempotent: once the old string is gone there is nothing left to match.
-- ============================================

UPDATE public.site_settings
   SET value = jsonb_set(
         value,
         '{metaDescription}',
         to_jsonb(
           replace(
             replace(
               COALESCE(value -> 'advanced' ->> 'metaDescription', ''),
               'Atelier Riman', 'Riman Fashion'),
             'atelier riman', 'Riman Fashion')),
         true),
         updated_at = now()
   WHERE key = 'advanced'
     AND value ? 'metaDescription'
     AND lower(COALESCE(value -> 'advanced' ->> 'metaDescription', '')) LIKE '%atelier riman%';
