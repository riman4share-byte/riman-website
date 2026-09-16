-- Cleanup diagnostic rows from fix verification.
DELETE FROM public.contact_submissions WHERE email = 'diag@example.com';
DELETE FROM public.reviews WHERE comment = 'diagnostic row delete me';
