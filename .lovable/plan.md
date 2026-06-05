
# Diş Kliniği Web Sitesi + Admin Paneli

Sade modern, mavi/beyaz paletli, Türkçe bir diş kliniği sitesi. Public tanıtım sayfaları + Supabase Auth korumalı admin paneli.

## 1. Backend (Lovable Cloud / Supabase)

Lovable Cloud etkinleştirilir. Migration ile şu yapı kurulur:

**Tablolar**
- `admin_users` (user_id PK → auth.users, created_at)
- `services` (id, title, description, image_url, created_at, updated_at)
- `appointments` (id, full_name, email, phone, appointment_date, status `beklemede|onaylandı|iptal_edildi`, created_at)
- `contact_messages` (id, full_name, email, message, status `okunmadı|okundu|arsivlendi`, created_at)

**Güvenlik**
- `has_admin(uid)` security definer fonksiyonu (`admin_users` lookup).
- RLS:
  - `services`: anon+authenticated SELECT, admin ALL.
  - `appointments`: anon INSERT, admin SELECT/UPDATE.
  - `contact_messages`: anon INSERT, admin SELECT/UPDATE.
  - `admin_users`: sadece admin SELECT.
- GRANT'lar her tablo için açıkça verilir.

**Storage**
- `public-assets` bucket (public). Admin upload/delete policy'leri.

**Admin seed**: Kullanıcı /login üzerinden hesap açtıktan sonra `admin_users` tablosuna user_id elle (insert tool ile) eklenir. Açık signup yok.

## 2. Routing (TanStack Start)

Public (SSR):
- `/` – Landing (Hero, Hizmetler önizleme, Hakkında, İletişim formu)
- `/randevu` – Tam randevu formu
- `/login` – Admin girişi (email/password)

Korumalı (`_authenticated/` layout, ssr:false):
- `/_authenticated/admin` – Dashboard özet
- `/_authenticated/admin/randevular`
- `/_authenticated/admin/mesajlar`
- `/_authenticated/admin/hizmetler`

`_authenticated/route.tsx` gate: oturum yoksa `/login`'e redirect; oturum varsa `has_admin` server fn ile doğrulama, admin değilse logout + redirect.

## 3. Public Site

**Navbar** – Sticky, sol logo, sağ menü (Anasayfa, Hizmetler, Hakkında, İletişim) + "Randevu Al" CTA → `/randevu`. Hash anchorlar landing içi scroll için.

**Hero** – Sola yaslı H1 (Poppins, bold), alt açıklama (Inter), iki CTA (Randevu Al / Hizmetlerimiz). Arkada hafif gradient + blur glassmorphism.

**Hizmetler** – `services` tablosundan TanStack Query ile çekilir, masaüstü 3 kolon / mobil 1 kolon kart grid; ikon + başlık + açıklama + opsiyonel görsel.

**Hakkında** – Asimetrik split: sol metin (klinik hikayesi, değerler), sağ klinik fotoğrafı (generate edilecek).

**İletişim** – İki sütun: sol form (ad, e-posta, mesaj — zod validation), sağ adres/telefon/harita placeholder. Submit → `contact_messages` insert + toast.

**Footer** – 3 sütun (iletişim, hızlı linkler, sosyal). Koyu mavi arka plan.

**/randevu sayfası** – Tam form: ad, telefon (zorunlu), e-posta, hizmet seçimi (services'tan), tarih (shadcn DatePicker) + saat. Zod ile validate, `appointments` insert, başarı ekranı.

## 4. Admin Panel

**Layout** – `Sidebar` (shadcn sidebar, collapsible icon) + Top Header (avatar, çıkış).
- Sidebar: Dashboard, Randevular, Mesajlar, Hizmetler.
- Header: oturum sahibi e-postası + Çıkış Yap (signOut + cache clear + replace `/login`).

**Dashboard** – İstatistik kartları: Bugünkü randevular, Bekleyen randevular, Okunmamış mesajlar, Toplam hizmet. TanStack Query, staleTime 60s.

**Randevular** – shadcn Data Table: arama (ad/telefon), durum filtresi, tarih sıralama, sayfalama. Satır aksiyonu: durumu Onayla/İptal/Beklemede (optimistic update).

**Mesajlar** – Master-detail: sol liste (okunmamış vurgulu), sağ detay paneli. Aksiyonlar: Okundu işaretle, Arşivle.

**Hizmetler** – CRUD: liste tablosu + "Yeni Hizmet" dialog. Form (shadcn Form + zod): başlık, açıklama, görsel upload (Supabase Storage `public-assets`). Düzenle/Sil aksiyonları.

## 5. Tasarım Sistemi

`src/styles.css` içinde oklch tokenları:
- Primary: dental blue (~oklch(0.55 0.15 240))
- Accent: lighter cyan
- Background: white / very light blue-grey
- Foreground: deep navy
- Dark mode tanımlı ama default light
- Fontlar: Poppins (başlık), Inter (gövde) — Google Fonts link
- 8px spacing grid, geniş whitespace
- Border radius: yumuşak (0.75rem)

Tüm renkler semantic token üzerinden; component'larda hardcoded renk yok.

## 6. Veri Erişimi

- Public okumalar (services) → loader + `useSuspenseQuery` (ssr ok, RLS anon select).
- Public yazmalar (appointments/contact_messages insert) → browser supabase client + RLS anon insert.
- Admin operasyonları → `createServerFn` + `requireSupabaseAuth` + `has_admin` kontrolü, sonra context.supabase ile sorgu.
- Storage upload → admin paneli içinde browser client.
- `attachSupabaseAuth` middleware'inin `src/start.ts`'de kayıtlı olduğu doğrulanır.
- Root'ta tek `onAuthStateChange` listener (SIGNED_IN/OUT/USER_UPDATED).

## 7. Görseller

generate_image ile üretilecek:
- Hero arka plan / yan görsel (modern klinik ambians)
- Hakkında bölümü klinik iç mekan fotoğrafı
- 4-6 hizmet için ikon yerine görsel placeholder (opsiyonel; ikonlar Lucide ile başlangıçta)

## Teknik Notlar

- TanStack Start v1, Vite, React 19, Tailwind v4 (`@theme` + `oklch`).
- TanStack Query default read shape (ensureQueryData + useSuspenseQuery).
- Form validation: zod + react-hook-form.
- Toast: shadcn sonner.
- `_authenticated/route.tsx` Lovable Cloud entegrasyonunca yönetilen şablonla uyumlu (`ssr:false`).
- Admin doğrulaması için ek server fn `requireAdmin` middleware (auth + has_admin RPC).
- routeTree.gen.ts manuel düzenlenmez.

## Implementasyon Sırası

1. Lovable Cloud aktifle, migration (tablolar + RLS + grants + storage bucket + has_admin).
2. Design tokens + fontlar.
3. Public layout, Navbar, Footer, Hero, Hizmetler, Hakkında, İletişim landing.
4. `/randevu` sayfası.
5. `/login` + admin gate route.
6. Admin sidebar layout + Dashboard.
7. Randevular, Mesajlar, Hizmetler modülleri (server fn'ler dahil).
8. Görsel generasyonu ve son rötuşlar.
