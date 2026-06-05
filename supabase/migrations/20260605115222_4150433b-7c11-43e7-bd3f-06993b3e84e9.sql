
CREATE POLICY "Public read public-assets" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'public-assets');
CREATE POLICY "Admins upload public-assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'public-assets' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins update public-assets" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'public-assets' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins delete public-assets" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'public-assets' AND public.is_admin(auth.uid()));
