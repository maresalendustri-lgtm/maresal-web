# Supabase Kurulum Rehberi

## 1. Ortam Değişkenleri

`.env.local` dosyanıza ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- **NEXT_PUBLIC_SUPABASE_URL**: Supabase proje URL'iniz (Dashboard → Settings → API)
- **SUPABASE_SERVICE_ROLE_KEY**: Service role key (Dashboard → Settings → API → service_role)

## 2. SQL Şemasını Çalıştırma

1. Supabase Dashboard'a gidin
2. **SQL Editor** → **New query**
3. `supabase-schema.sql` dosyasının içeriğini yapıştırın
4. **Run** ile çalıştırın

Bu işlem şunları oluşturur:

- **services** – Hizmetler (Alüminyum İşleme, Metal Mühendisliği, Kalite Kontrol)
- **gallery_images** – Galeri görselleri
- **about_content** – Hakkımızda sayfası içeriği
- **messages** – İletişim formu mesajları
- **site_settings** – Site ayarları (iletişim bilgileri)
- **site-content** storage bucket – Hakkımızda görselleri için

## 3. Storage Bucket (Alternatif)

SQL ile bucket oluşturulmazsa, Supabase Dashboard üzerinden:

1. **Storage** → **New bucket**
2. İsim: `site-content`
3. **Public bucket** işaretleyin
4. **Create bucket**

## 4. Hakkımızda İçeriği (Opsiyonel)

`supabase-schema.sql` zaten varsayılan Hakkımızda içeriğini ekler. Daha zengin veya güncel içerik için `supabase-about-content.sql` dosyasını Supabase SQL Editor'da çalıştırabilirsiniz. Bu dosya:

- Hero başlık ve alt metin
- Şirket açıklaması
- Misyon ve vizyon
- İstatistikler (6+ yıl, 200+ proje, 50+ müşteri, vb.)
- Değerlerimiz (6 madde)
- Kilometre taşları (2019–2024)
- Sertifikalar (ISO 9001, 14001, 45001)

içerir.

## 5. Sonuç

- **Admin** (`/admin`): Hizmetler, Galeri, Hakkımızda, Mesajlar, Ayarlar düzenlenebilir
- **Public**: Tüm içerik veritabanından okunur ve gösterilir
