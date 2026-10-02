-- ============================================
-- Correct the site_settings brand-name path.
--
-- The previous migration (20261002000001) looked for the description at
-- value -> 'advanced' ->> 'metaDescription'. site_settings stores one JSONB
-- object per key, so the description actually lives at the top level:
--   key = 'advanced', value = { metaDescription: ... }
-- The nested path never matched, so that migration applied cleanly and changed
-- nothing. This one uses the correct path.
-- ============================================

UPDATE public.site_settings
   SET value = jsonb_set(
         value,
         '{metaDescription}',
         to_jsonb(
           replace(
             replace(
               COALESCE(value ->> 'metaDescription', ''),
               'Atelier Riman', 'Riman Fashion'),
             'atelier riman', 'Riman Fashion')),
         true),
         updated_at = now()
   WHERE key = 'advanced'
     AND value ? 'metaDescription'
     AND lower(COALESCE(value ->> 'metaDescription', '')) LIKE '%atelier riman%';
