-- =============================================================================
-- MARESAL ANA HİZMET: YÜKSEK TEKNOLOJİ ALÜMİNYUM M5 SERİSİ
-- Supabase SQL Editor'da çalıştırın: Dashboard → SQL Editor → New query
-- Bu script is_main_service sütununu ekler ve M5 serisini ana hizmet olarak kaydeder.
-- =============================================================================

-- 1. is_main_service sütununu ekle (yoksa)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'services' and column_name = 'is_main_service'
  ) then
    alter table services add column is_main_service boolean default false;
  end if;
end $$;

-- 2. Mevcut hizmetlerde is_main_service'i false yap (temizlik)
update services set is_main_service = false where is_main_service is null or is_main_service = true;

-- 3. M5 Serisi ana hizmetini ekle veya güncelle
insert into services (
  slug,
  title,
  description,
  detail_description,
  tag,
  hero_image,
  image,
  features,
  specs,
  gallery,
  process,
  sort_order,
  is_main_service
) values (
  'yuksek-teknoloji-aluminyum-m5-serisi',
  'Yüksek Teknoloji Alüminyum M5 Serisi',
  'Havacılık ve savunma sanayiinde 5xxx serisi magnezyum-alüminyum alaşımları ile üstün korozyon direnci, kaynaklanabilirlik ve yorulma dayanımı sunan özel üretim çözümleri.',
  'M5 serisi, havacılık ve savunma sanayiinin kritik uygulamaları için geliştirilmiş yüksek teknoloji alüminyum alaşımlarını kapsar. 5052, 5083, 5086, 5454 ve 5754 gibi magnezyum-alüminyum alaşımlarında CNC tornalama, frezeleme, 5 eksen işleme ve yüzey işlemleri sunuyoruz. Bu alaşımlar, yüksek korozyon direnci, mükemmel kaynaklanabilirlik ve denizcilik ortamlarına uygunluk ile öne çıkar. Uçak gövdesi bileşenleri, yakıt tankları, yapısal elemanlar ve savunma sistemleri için ISO 9001, 14001 ve 45001 sertifikalı üretim garantisi sağlıyoruz. Tam izlenebilirlik, malzeme sertifikasyonu ve PPAP dokümantasyonu ile teslimat yapıyoruz.',
  'Ana Hizmet',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=90',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=90',
  ARRAY[
    '5xxx serisi magnezyum-alüminyum alaşımları (5052, 5083, 5086, 5454, 5754)',
    'Üstün korozyon direnci ve denizcilik uygulamalarına uygunluk',
    'MIG, TIG kaynaklanabilirlik ve yorulma dayanımı',
    '5 eksen CNC frezeleme ve hassas tornalama',
    'ISO 9001, 14001, 45001 sertifikalı üretim süreçleri',
    'Tam izlenebilirlik ve malzeme sertifikasyonu'
  ],
  '[
    {"label": "Alaşım Serisi", "value": "5xxx (M5)"},
    {"label": "Tolerans", "value": "±0.005mm"},
    {"label": "Max Boyut", "value": "2000 x 1000mm"},
    {"label": "Korozyon", "value": "Yüksek direnç"},
    {"label": "Kaynak", "value": "MIG, TIG"},
    {"label": "Sertifika", "value": "AMS, EN, ISO"}
  ]'::jsonb,
  '[
    {"url": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=90", "alt": "M5 serisi alüminyum CNC işleme"},
    {"url": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=90", "alt": "Havacılık alüminyum parça imalatı"},
    {"url": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=90", "alt": "Uçak bileşeni üretimi"}
  ]'::jsonb,
  '[
    {"title": "Teknik Analiz & Malzeme Seçimi", "desc": "Uygulama gereksinimlerine göre 5xxx serisi alaşım seçimi, DFM analizi ve malzeme tedariki."},
    {"title": "CNC Programlama & İşleme", "desc": "CAM optimizasyonu, 5 eksen frezeleme ve hassas tornalama ile parça üretimi."},
    {"title": "Kaynak & Montaj", "desc": "MIG/TIG kaynak, yüzey işleme ve alt montaj operasyonları."},
    {"title": "Kalite Kontrol & Teslimat", "desc": "CMM ölçüm, NDT testleri, PPAP dokümantasyonu ve sertifikalı teslimat."}
  ]'::jsonb,
  0,
  true
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  detail_description = excluded.detail_description,
  tag = excluded.tag,
  hero_image = excluded.hero_image,
  image = excluded.image,
  features = excluded.features,
  specs = excluded.specs,
  gallery = excluded.gallery,
  process = excluded.process,
  sort_order = excluded.sort_order,
  is_main_service = true,
  updated_at = now();
