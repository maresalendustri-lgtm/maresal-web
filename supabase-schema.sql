-- =============================================================================
-- MARESAL SUPABASE SCHEMA
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SERVICES (Hizmetler)
-- -----------------------------------------------------------------------------
create table if not exists services (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  detail_description text,
  tag text not null,
  hero_image text,
  image text,
  features text[] default '{}',
  specs jsonb default '[]',
  gallery jsonb default '[]',
  process jsonb default '[]',
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists services_updated_at on services;
create trigger services_updated_at
  before update on services
  for each row
  execute function update_updated_at();

alter table services enable row level security;
drop policy if exists "Public can read active services" on services;
create policy "Public can read active services"
  on services for select
  using (is_active = true);
drop policy if exists "Admins can manage services" on services;
create policy "Admins can manage services"
  on services for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- Services seed (skip if already exists)
insert into services (slug, title, description, detail_description, tag, hero_image, image, features, specs, gallery, process, sort_order) values
('aluminyum-isleme', 'Alüminyum İşleme', 'Havacılık sınıfı alüminyum alaşımları ile hassas parça imalatı ve yüzey işlemleri.', 'Havacılık ve savunma sanayiinde kullanılan 2xxx, 6xxx ve 7xxx serisi alüminyum alaşımlarında CNC tornalama, frezeleme ve yüzey işlemleri sunuyoruz. Parçalarınız ISO standartlarına ve müşteri spesifikasyonlarına uygun üretilir.', 'CNC & Yüzey', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=90', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=90', ARRAY['ISO 9001, 14001 ve 45001 uyumlu üretim süreçleri', 'CNC tornalama ve frezeleme', 'Yüzey anodizasyonu ve kaplama', 'Malzeme sertifikasyonu ve raporlama', 'Prototipten seri üretime', 'Tam izlenebilirlik'], '[{"label":"Tolerans","value":"±0.005mm"},{"label":"Max Boyut","value":"2000 x 1000mm"},{"label":"Alaşımlar","value":"2xxx, 6xxx, 7xxx"},{"label":"Yüzey Ra","value":"0.4μm"}]', '[{"url":"https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=90","alt":"Alüminyum CNC frezeleme"},{"url":"https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=90","alt":"Hassas parça üretimi"}]', '[{"title":"Teknik Çizim Analizi","desc":"Müşteri çizimlerinin incelenmesi ve üretilebilirlik değerlendirmesi."},{"title":"Malzeme Seçimi","desc":"Sertifikalı alüminyum alaşım temini ve malzeme testi."},{"title":"CNC Programlama","desc":"CAM yazılımı ile optimum takım yolu programlama."},{"title":"İşleme & Yüzey","desc":"Hassas CNC işleme ve yüzey bitirme operasyonları."}]', 1),
('metal-muhendisligi', 'Metal Mühendisliği', 'Çelik, titanyum ve diğer metallerde tasarım, prototip ve seri üretim.', 'Çelik, paslanmaz çelik, titanyum ve nikel alaşımlarında tasarımdan seri üretime kadar tam hizmet.', 'Tasarım & Üretim', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=90', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=90', ARRAY['Tasarım ve mühendislik desteği', 'Prototip ve seri üretim', 'Titanyum ve nikel alaşım işleme', 'Kaynak ve montaj hizmetleri', 'DFM analizi', 'Tersine mühendislik'], '[{"label":"Malzemeler","value":"Ti, Ni, SS, Çelik"},{"label":"Kaynak","value":"TIG, MIG, Elektron"},{"label":"Prototip","value":"3-5 iş günü"},{"label":"Seri Üretim","value":"10,000+ adet/ay"}]', '[{"url":"https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=90","alt":"Metal işleme atölyesi"},{"url":"https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=90","alt":"CNC torna operasyonu"}]', '[{"title":"Mühendislik Analizi","desc":"DFM analizi, malzeme seçimi ve tasarım optimizasyonu."},{"title":"Prototip Üretim","desc":"Hızlı prototipleme ile tasarım doğrulama."},{"title":"Seri Üretim","desc":"Optimize edilmiş süreçlerle yüksek hacimli üretim."},{"title":"Montaj & Test","desc":"Alt montaj, kaynak ve fonksiyonel test."}]', 2),
('kalite-kontrol', 'Kalite Kontrol', 'Uluslararası standartlara uygun test, ölçüm ve dokümantasyon.', 'Tüm üretim süreçlerimizde CMM, yüzey pürüzlülüğü, sertlik ve NDT testleri yapıyoruz. Tam dokümantasyon ve izlenebilirlik sağlıyoruz.', 'Test & Sertifikasyon', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&q=90', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=90', ARRAY['CMM ve koordinat ölçüm', 'Yüzey ve sertlik testleri', 'NDT (tahribatsız muayene)', 'Tam dokümantasyon ve PPAP', 'İlk parça onay raporu (FAIR)', 'İstatistiksel süreç kontrol'], '[{"label":"CMM","value":"0.001mm hassasiyet"},{"label":"NDT","value":"UT, PT, MT, RT"},{"label":"Dokümantasyon","value":"PPAP Level 3"},{"label":"Sertifika","value":"ISO 9001, 14001, 45001"}]', '[{"url":"https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=90","alt":"CMM ölçüm"},{"url":"https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=1200&q=90","alt":"Hassas ölçüm cihazı"}]', '[{"title":"Giriş Kontrolü","desc":"Hammadde sertifikası doğrulama ve giriş ölçümü."},{"title":"Proses Kontrolü","desc":"Üretim sırasında anlık ölçüm ve SPC takibi."},{"title":"Final Ölçüm","desc":"CMM, yüzey, sertlik ve NDT testleri."},{"title":"Dokümantasyon","desc":"FAIR, PPAP ve sertifika hazırlığı."}]', 3)
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- 2. GALLERY_IMAGES (Galeri)
-- -----------------------------------------------------------------------------
create table if not exists gallery_images (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  alt text not null,
  cat text not null,
  span text default 'normal' check (span in ('normal', 'wide', 'tall')),
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table gallery_images enable row level security;
drop policy if exists "Public can read gallery" on gallery_images;
create policy "Public can read gallery"
  on gallery_images for select
  using (true);
drop policy if exists "Admins can manage gallery" on gallery_images;
create policy "Admins can manage gallery"
  on gallery_images for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- Gallery seed (only if empty)
do $$
begin
  if (select count(*) from gallery_images) = 0 then
    insert into gallery_images (url, alt, cat, span, sort_order) values
    ('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=90', 'Uçak kanadı detayı', 'Havacılık', 'wide', 1),
    ('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=90', 'Metal işleme atölyesi', 'Metal', 'normal', 2),
    ('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=90', 'Alüminyum parça imalatı', 'Alüminyum', 'tall', 3),
    ('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=90', 'CNC torna üretimi', 'Metal', 'normal', 4),
    ('https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=90', 'Kalite kontrol laboratuvarı', 'Kalite', 'wide', 5),
    ('https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=90', 'Havacılık bileşenleri', 'Havacılık', 'normal', 6),
    ('https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=1200&q=90', 'Hassas CMM ölçüm', 'Kalite', 'normal', 7),
    ('https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=1200&q=90', 'Montaj süreçleri', 'Metal', 'tall', 8),
    ('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=90', '5 Eksen CNC frezeleme', 'Metal', 'normal', 9),
    ('https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=90', 'Türbin parçası üretimi', 'Havacılık', 'wide', 10),
    ('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=90', 'Anodize yüzey işlemi', 'Alüminyum', 'normal', 11),
    ('https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=90', 'NDT tahribatsız muayene', 'Kalite', 'normal', 12);
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 3. ABOUT_CONTENT (Hakkımızda - single row)
-- -----------------------------------------------------------------------------
create table if not exists about_content (
  id integer primary key default 1 check (id = 1),
  content jsonb not null default '{}',
  updated_at timestamptz default now()
);

alter table about_content enable row level security;
drop policy if exists "Public can read about" on about_content;
create policy "Public can read about"
  on about_content for select
  using (true);
drop policy if exists "Admins can manage about" on about_content;
create policy "Admins can manage about"
  on about_content for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- About seed (only if empty)
do $$
begin
  if not exists (select 1 from about_content where id = 1) then
    insert into about_content (id, content) values (1, '{
      "hero_title": "Mareşal",
      "hero_subtitle": "2019''dan bu yana havacılık, savunma ve metal işleme sektöründe güvenilir çözüm ortağınız.",
      "hero_image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=85",
      "company_description": "Mareşal Mühendislik Danışmanlık Yazılım İthalat Ve İhracat Sanayi Ticaret Limited Şirketi olarak, savunma, havacılık ve ağır sanayi sektörlerinde entegre mühendislik çözümleri sunuyoruz. ISO 9001, 14001 ve 45001 sertifikalı üretim süreçlerimizle alüminyum, titanyum ve çelik malzemelerde hassas parça imalatı, CNC tornalama, frezeleme ve kalite kontrol hizmetleri veriyoruz. 6 yılı aşkın deneyimimiz ve 200''den fazla tamamlanan projemizle müşterilerimize güvenilir, zamanında ve sertifikalı üretim garantisi sağlıyoruz.",
      "mission": "Havacılık ve savunma sanayiinde en yüksek kalite standartlarında üretim yaparak, müşterilerimizin projelerini güvenle hayata geçirmelerine destek olmak. ISO standartlarına tam uyum, sürekli iyileştirme ve müşteri odaklı yaklaşımla sektörde referans firma olmak.",
      "vision": "Türkiye''nin havacılık ve savunma sanayiinde öncü metal işleme ve mühendislik çözüm ortağı olmak. Yurt içi ve yurt dışı pazar genişlemesi ile bölgesel güç haline gelmek.",
      "stats": [
        {"label": "Yıllık Deneyim", "value": "6+"},
        {"label": "Tamamlanan Proje", "value": "200+"},
        {"label": "Mutlu Müşteri", "value": "50+"},
        {"label": "Kalite Odaklı", "value": "%100"},
        {"label": "Uzmanlık Alanı", "value": "5"},
        {"label": "ISO Sertifikası", "value": "3"}
      ],
      "values_list": [
        {"title": "ISO Sertifikasyonları", "description": "ISO 9001, 14001 ve 45001 standartlarına tam uyum. Kalite, çevre ve iş güvenliği yönetim sistemlerimizle güvenilir üretim."},
        {"title": "Hassas İmalat", "description": "Mikron toleranslarda CNC işleme, 5 eksen frezeleme ve gelişmiş kalite kontrol ile eksiksiz hassasiyet."},
        {"title": "Hızlı Teslimat", "description": "Prototipten seri üretime, zamanında teslimat garantisi. Acil projeler için hızlandırılmış süreçler."},
        {"title": "Güvenilirlik", "description": "Her projede tekrarlanabilir kalite ve izlenebilirlik. Tam dokümantasyon ve sertifikasyon desteği."},
        {"title": "Müşteri Odaklılık", "description": "Teknik danışmanlık, özel çözümler ve proje bazlı yaklaşımla müşteri ihtiyaçlarına tam uyum."},
        {"title": "Sürdürülebilirlik", "description": "Çevre yönetim sistemi ve geri dönüşüm odaklı üretim ile sürdürülebilir imalat prensipleri."}
      ],
      "milestones": [
        {"year": "2019", "title": "Kuruluş", "description": "Mareşal, İstanbul''da havacılık ve savunma sanayi için alüminyum ve metal işleme hizmetleri sunmak üzere kuruldu."},
        {"year": "2021", "title": "ISO Sertifikasyonları", "description": "ISO 9001, 14001 ve 45001 kalite, çevre ve iş güvenliği yönetim sistemleri sertifikalarını aldık."},
        {"year": "2023", "title": "Kapasite Artışı", "description": "Üretim ve teslimat kapasitesini artırarak daha geniş müşteri portföyüne hizmet vermeye başladık."},
        {"year": "2024", "title": "Pazar Genişlemesi", "description": "Yurt içi ve yurt dışı müşteri ağımızı genişleterek sektördeki konumumuzu güçlendirdik."}
      ],
      "certifications": [
        {"name": "ISO 9001:2015", "description": "Kalite yönetim sistemi standardı. Müşteri memnuniyeti, sürekli iyileştirme ve süreç odaklı yaklaşım ile üretim kalitemizi garanti altına alıyoruz."},
        {"name": "ISO 14001:2015", "description": "Çevre yönetim sistemi standardı. Üretim süreçlerimizde çevresel etkiyi minimize ederek sürdürülebilir imalat prensiplerini uyguluyoruz."},
        {"name": "ISO 45001:2018", "description": "İş sağlığı ve güvenliği yönetim sistemi standardı. Çalışanlarımızın güvenliği ve sağlığı için risk yönetimi ve sürekli iyileştirme uyguluyoruz."}
      ],
      "team_members": []
    }'::jsonb);
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 4. MESSAGES (İletişim formu mesajları)
-- -----------------------------------------------------------------------------
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter table messages enable row level security;
drop policy if exists "Anyone can insert messages" on messages;
create policy "Anyone can insert messages"
  on messages for insert
  with check (true);
drop policy if exists "Admins can manage messages" on messages;
create policy "Admins can manage messages"
  on messages for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- 5. SITE_SETTINGS (İletişim bilgileri - admin ayarlardan düzenlenebilir)
-- -----------------------------------------------------------------------------
create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;
drop policy if exists "Public can read settings" on site_settings;
create policy "Public can read settings"
  on site_settings for select
  using (true);
drop policy if exists "Admins can manage settings" on site_settings;
create policy "Admins can manage settings"
  on site_settings for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- Site settings seed (contact info)
insert into site_settings (key, value) values
('contact', '{"email":"info@maresal.com.tr","phone":"+90 312 000 00 00","phoneDisplay":"+90 (312) 000 00 00","address":{"streetAddress":"","addressLocality":"Ankara","addressRegion":"","postalCode":"","addressCountry":"TR"},"googleMapsUrl":""}'::jsonb)
on conflict (key) do nothing;

-- -----------------------------------------------------------------------------
-- 6. STORAGE BUCKET (site-content for about image uploads)
-- Run in SQL Editor - creates bucket if not exists
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('site-content', 'site-content', true, 10485760)
on conflict (id) do update set public = true, file_size_limit = 10485760;
