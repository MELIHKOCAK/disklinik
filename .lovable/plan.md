## Yapılacaklar

### 1. Yeni admin ekleme
- `admin_users` tablosuna `xx24melih24xx@gmail.com` hesabının `user_id`'sini ekle (insert tool ile, `auth.users`'tan e-posta üzerinden lookup).
- Bu kullanıcının önceden `/auth` üzerinden kayıt olmuş olması gerekir; kayıt yoksa kullanıcıya kaydolmasını söyleyeceğim, sonra ekleyeceğim.

### 2. Instagram bölümünü düzelt
Mevcut durum: `InstagramFeed.tsx` içine gömülü token geçersiz → Graph API 400 → bölüm hiç render edilmiyor (`error` true ise `return null`).

Yapılacak:
- **Token'ı güvenli sakla**: `INSTAGRAM_ACCESS_TOKEN` adıyla runtime secret olarak ekle (`add_secret` ile kullanıcıdan yeni token alınacak). Token bir daha kodda tutulmayacak.
- **Sunucu tarafına taşı**: Yeni `src/lib/instagram.functions.ts` içinde `getInstagramPosts` adlı `createServerFn` oluştur. Bu fonksiyon `process.env.INSTAGRAM_ACCESS_TOKEN` ile `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=8` çağrısı yapacak. Hata/timeout durumunda `{ items: [], error: "..." }` döner — exception fırlatmaz, böylece site render'ı bozulmaz.
- **InstagramFeed.tsx'i güncelle**:
  - Sabit token değişkenini ve direkt `fetch` çağrısını kaldır.
  - TanStack Query (`useQuery` + `useServerFn`) ile server function'ı çağır.
  - Yükleniyor: mevcut skeleton grid göster.
  - Hata: console'a yazdır, zarif fallback (başlık + "Gönderiler şu an yüklenemiyor" mesajı) — bölümü tamamen gizlemek yerine kullanıcı talebine göre **her zaman göster**.
  - Boş veri: aynı fallback mesajı.
  - Başarı: mevcut 1/2/4 kolon grid, hover overlay korunur.
- **Konumu**: Şu an `index.tsx`'de `About` → `InstagramFeed` → `Contact` sırası var; kullanıcı "iletişim üzerinde" görünmediğinden bahsediyor — sıralama değişmeyecek, sadece artık her zaman görünecek.

### Teknik notlar
- Server function `requireSupabaseAuth` kullanmaz (public endpoint).
- Token Instagram Basic Display / Graph API long-lived token olmalı (60 gün geçerli). Yenileme şimdilik manuel.
- Mevcut `routes/index.tsx`, `routes/__root.tsx` ve route tree değişmiyor.

### Dosya değişiklikleri
- yeni: `src/lib/instagram.functions.ts`
- güncellenecek: `src/components/site/InstagramFeed.tsx`
- secret eklenecek: `INSTAGRAM_ACCESS_TOKEN`
- veritabanı insert: `admin_users` (yeni e-posta)
