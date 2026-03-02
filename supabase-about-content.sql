-- =============================================================================
-- MARESAL HAKKIMIZDA (ABOUT US) SAYFA İÇERİĞİ
-- Supabase SQL Editor'da çalıştırın: Dashboard → SQL Editor → New query
-- Bu script tabloyu oluşturur (yoksa) ve içeriği ekler/günceller.
-- =============================================================================

-- 1. Tablo yoksa oluştur
create table if not exists about_content (
  id integer primary key default 1 check (id = 1),
  content jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- 2. RLS ve policy (tablo zaten varsa hata vermez)
alter table about_content enable row level security;
drop policy if exists "Public can read about" on about_content;
create policy "Public can read about"
  on about_content for select
  using (true);
drop policy if exists "Admins can manage about" on about_content;
create policy "Admins can manage about"
  on about_content for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- 3. İçerik ekle veya güncelle
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
}'::jsonb)
on conflict (id) do update set content = excluded.content, updated_at = now();
