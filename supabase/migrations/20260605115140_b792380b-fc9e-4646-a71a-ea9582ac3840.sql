
-- Helper function: check admin
CREATE TABLE public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = _user_id)
$$;

CREATE POLICY "Admins can view admin list" ON public.admin_users
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- updated_at trigger fn
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  appointment_date TIMESTAMPTZ NOT NULL,
  notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'beklemede' CHECK (status IN ('beklemede','onaylandi','iptal_edildi')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.appointments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create appointment" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage appointments" ON public.appointments FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- contact_messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'okunmadi' CHECK (status IN ('okunmadi','okundu','arsivlendi')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage messages" ON public.contact_messages FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Seed sample services
INSERT INTO public.services (title, description) VALUES
  ('Genel Diş Muayenesi', 'Düzenli ağız ve diş kontrolü ile sorunları erken tespit edin.'),
  ('İmplant Tedavisi', 'Eksik dişleriniz için kalıcı ve doğal görünümlü implant çözümleri.'),
  ('Diş Beyazlatma', 'Profesyonel beyazlatma ile gülüşünüze ışıltı katın.'),
  ('Ortodonti', 'Şeffaf plak ve modern tellerle estetik diş düzeltme tedavileri.'),
  ('Kanal Tedavisi', 'Ağrısız ve hassas yöntemlerle dişinizi kurtaran tedavi.'),
  ('Çocuk Diş Hekimliği', 'Çocuklarınız için güvenli, eğlenceli ve nazik diş bakımı.');
