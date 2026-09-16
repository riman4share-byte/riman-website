-- Cleanup: remove diagnostic test row + temporary diagnostic function.
DELETE FROM public.appointments
  WHERE name = 'DIAGNOSTIC-DELETE-ME' AND email = 'diag@example.com';
DROP FUNCTION IF EXISTS public.diag_appointments_policies();
NOTIFY pgrst, 'reload schema';
