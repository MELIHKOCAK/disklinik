
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, service_role;

DROP POLICY IF EXISTS "Anyone can create appointment" ON public.appointments;
CREATE POLICY "Anyone can create appointment" ON public.appointments
  FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(full_name) BETWEEN 1 AND 255 AND char_length(phone) BETWEEN 1 AND 50);

DROP POLICY IF EXISTS "Anyone can create message" ON public.contact_messages;
CREATE POLICY "Anyone can create message" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(full_name) BETWEEN 1 AND 255 AND char_length(message) BETWEEN 1 AND 5000);
