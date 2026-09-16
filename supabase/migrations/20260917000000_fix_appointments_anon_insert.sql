-- Fix public appointment booking (prod returned 42501 RLS violation on anon INSERT).
-- The combined deploy SQL missed the appointments policies, so re-assert them here.
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
CREATE POLICY "Anyone can create appointments"
  ON public.appointments FOR INSERT WITH CHECK (true);

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS interested_gowns jsonb;
