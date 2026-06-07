## Canlıya Almadan Önce Tespit Edilen Sorunlar

Projeyi inceledim. Build (TypeScript) temiz, ancak canlıya almadan önce düzeltilmesi gereken **2 gerçek sorun** ve **1 küçük güvenlik uyarısı** var.

---

### 1. Instagram feed çalışmıyor (KRİTİK — kullanıcıya görünür)

Sunucu loglarında her istekte şu hata var:
```
[Instagram] HTTP 400 "Invalid OAuth access token - Cannot parse access token"
```
`INSTAGRAM_ACCESS_TOKEN` secret'ı tanımlı ama Facebook Graph API tarafından geçersiz olarak reddediliyor. Bu yüzden Anasayfa > "Bizi Takip Edin" bölümü her zaman "Gönderiler şu an yüklenemiyor" mesajını gösteriyor.

**Sebep:** Verilen token muhtemelen:
- Kısa ömürlü bir token olup süresi dolmuş, veya
- Instagram Basic Display tokeni olup Graph API (`graph.facebook.com`) endpoint'imize uymuyor, veya
- Yanlış Business Account ID ile eşleşmiyor.

**Çözüm:** Geçerli bir **uzun ömürlü (60 günlük) Instagram Graph API Page Access Token** ile `INSTAGRAM_ACCESS_TOKEN` secret'ını güncellemen gerekiyor. Bu adımı senin yapman gerek — token'ı Facebook Developers > Graph API Explorer üzerinden alıp bana iletirsen güncellerim. **Token sağlanana kadar bu bölümü görsel akışı bozmayacak şekilde bırakıyorum** (zaten hata fallback'i var, kullanıcı boş bir grid görmüyor).

> Alternatif (önerilen): Token geçersizken bölüm hiç render edilmesin — fallback kutusunu da gizleyip section'ı tamamen atlayalım. Aşağıda bunu uyguluyorum.

---

### 2. `is_admin` SECURITY DEFINER yetki sıkılaştırma (DÜŞÜK)

Supabase linter uyarısı: `public.is_admin(uuid)` fonksiyonu `authenticated` rolüne `EXECUTE` izniyle açık. Doğru kullanım örüntüsü bu olsa da en iyi pratik, fonksiyona açık `GRANT/REVOKE` uygulayıp yalnızca ihtiyaç duyan rollere izin vermektir. Şu an `PUBLIC`'e de açık olabilir.

**Çözüm — migration:**
```sql
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;
```

---

### 3. Genel kontrol (TEMİZ ✅)

- `bunx tsc --noEmit` → 0 hata
- Server fn'leri (`createServerFn`) yapısı doğru, `attachSupabaseAuth` ve `requireSupabaseAuth` kullanım kuralları uygun
- `admin_users` tablosunda her iki admin kayıtlı
- Google Calendar entegrasyonu çalışıyor (loglarda 200)
- RLS politikaları aktif

---

### Uygulayacağım Değişiklikler

1. **`src/components/site/InstagramFeed.tsx`** — Hata/boş durumda section'ı tamamen render etmeyecek şekilde güncelle (kullanıcıya bozuk hissi vermesin). Token geçerli olduğunda otomatik gözükecek.
2. **Yeni migration** — `is_admin` fonksiyonunun yetkilerini sıkılaştır.
3. **Bilgi:** Instagram token'ını yenilemen için adımları açıklayacağım; token'ı bana iletmen yeterli, secret'ı güncelleyeceğim.

Onayladığında uygularım.