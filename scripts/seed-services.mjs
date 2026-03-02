import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jskfbzrsynfomnbbydie.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impza2ZienJzeW5mb21uYmJ5ZGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE4ODc1MCwiZXhwIjoyMDg3NzY0NzUwfQ.AAyRPEOwDctNEpXSBy6gCSKLEzAcDsqjWWz02f6Gn-g",
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const services = [
  // ═══════════════════════════════════════════════════════════
  // 1. Mareşal Mühendislik
  // ═══════════════════════════════════════════════════════════
  {
    slug: "muhendislik",
    title: "Mareşal Mühendislik",
    tag: "Mühendislik",
    description:
      "Havacılık, savunma ve ağır sanayi sektörlerine yönelik fikstür, montaj kalıpları, depolama raf sistemleri ve taşıma ataşmanlarının tasarımı ve üretimi.",
    detail_description:
      "Mareşal Mühendislik, havacılık, savunma ve ağır sanayi sektörlerine yönelik entegre mühendislik çözümleri sunar. Fikstür ve montaj kalıplarının tasarım ve üretimlerini gerçekleştirir; geliştirilen çözümler üretim süreçlerinde hassasiyet, tekrarlanabilirlik ve operasyonel verimliliği hedefler. Hammaddelerin kontrollü, düzenli ve alan tasarrufu sağlayacak şekilde stoklanabilmesi amacıyla depolama raf sistemleri tasarlar ve üretir. Hammadde, yarı mamül ve projeye özel ürünlerin güvenli taşınması için taşıma ve kaldırma ataşmanları geliştirir. Tüm çözümler saha koşulları ve kullanım senaryoları dikkate alınarak hesaplanır. Maliyetlendirme ve tasarruf odaklı mühendislik çözümleri ile kaynakların verimli kullanılmasını destekler.",
    hero_image:
      "https://images.pexels.com/photos/1145434/pexels-photo-1145434.jpeg?auto=compress&cs=tinysrgb&w=1920&q=90",
    image:
      "https://images.pexels.com/photos/1145434/pexels-photo-1145434.jpeg?auto=compress&cs=tinysrgb&w=800&q=85",
    features: [
      "Fikstür ve montaj kalıplarının tasarımı ve üretimi",
      "Depolama raf sistemleri tasarımı ve imalatı",
      "Taşıma ve kaldırma ataşmanları geliştirme",
      "Hassasiyet, tekrarlanabilirlik ve operasyonel verimlilik odaklı çözümler",
      "Saha koşullarına uygun mühendislik hesaplamaları",
      "Maliyetlendirme ve tasarruf odaklı danışmanlık",
      "Akıllı sistemler ve entegre mühendislik yaklaşımları",
      "AS9100 uyumlu üretim süreçleri",
    ],
    specs: [
      { label: "Tolerans", value: "±0.01mm" },
      { label: "Max Parça Boyutu", value: "3000mm" },
      { label: "Raf Yük Kapasitesi", value: "5000 kg" },
      { label: "Kaldırma Kapasitesi", value: "50.000 kg" },
      { label: "Sertifikasyon", value: "AS9100D" },
      { label: "Sektör", value: "Havacılık & Savunma" },
    ],
    gallery: [
      { url: "https://images.pexels.com/photos/1145434/pexels-photo-1145434.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Metal kesim ve CNC işleme - mühendislik üretimi" },
      { url: "https://images.pexels.com/photos/5532658/pexels-photo-5532658.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Endüstriyel CNC tezgahı ve metal işleme" },
      { url: "https://images.pexels.com/photos/5279399/pexels-photo-5279399.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Metal fabrikasyon ve fikstür imalatı" },
      { url: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&q=90", alt: "Hassas mühendislik ve montaj kalıbı üretimi" },
      { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=90", alt: "Ağır sanayi üretim tesisi" },
    ],
    process: [
      { title: "İhtiyaç Analizi & Teknik Değerlendirme", desc: "Projenin geometrik, mekanik ve operasyonel gereksinimlerinin detaylı incelenmesi; kullanım senaryolarının belirlenmesi." },
      { title: "3D Tasarım & Mühendislik Simülasyonu", desc: "CAD/CAM ortamında tasarım, FEA analizi ile yapısal doğrulama ve üretilebilirlik değerlendirmesi." },
      { title: "Üretim & Kalite Kontrol", desc: "CNC işleme, kaynak ve montaj süreçleri; CMM ölçüm raporlaması ve sertifikasyon uyumluluğu." },
      { title: "Teslimat & Teknik Destek", desc: "Ürünlerin güvenli teslimi ve kullanım süresince teknik danışmanlık hizmeti." },
    ],
    is_active: true,
    sort_order: 1,
  },

  // ═══════════════════════════════════════════════════════════
  // 2. Mareşal Alüminyum
  // ═══════════════════════════════════════════════════════════
  {
    slug: "aluminyum",
    title: "Mareşal Alüminyum",
    tag: "Alüminyum",
    description:
      "Savunma ve havacılık sanayinin gerektirdiği yüksek standartlarda, sertifikalı ve izlenebilir alüminyum hammadde tedariği.",
    detail_description:
      "Mareşal Alüminyum, savunma ve havacılık sanayinin gerektirdiği yüksek standartlarda, sertifikalı ve kaliteli alüminyum hammadde tedariği sağlar. Tüm ürünler kalite sürekliliği ve izlenebilirlik esas alınarak yönetilir. Projeye özel ihtiyaçlar doğrultusunda doğru hammadde seçimi, kullanım amacı ve teknik gereksinimler dikkate alınarak gerçekleştirilir. Talep edilen uygulamalar için özel tasarım ve projeye uyarlanmış hammadde çözümleri sunar. İleri havacılık ve yüksek teknoloji uygulamaları için 8xxx serisi alüminyum dahil, 1xxx, 3xxx, 5xxx, 6xxx, 7xxx serisi alüminyum tedarik eder. Mareşal Alüminyum, savunma ve havacılık projelerinde doğru malzeme, yüksek kalite ve güvenilir tedarik anlayışıyla konumlanır.",
    hero_image:
      "https://images.pexels.com/photos/1381938/pexels-photo-1381938.jpeg?auto=compress&cs=tinysrgb&w=1920&q=90",
    image:
      "https://images.pexels.com/photos/1381938/pexels-photo-1381938.jpeg?auto=compress&cs=tinysrgb&w=800&q=85",
    features: [
      "1xxx, 3xxx, 5xxx, 6xxx, 7xxx ve 8xxx serisi alüminyum alaşımları",
      "AMS, ASTM ve EN standartlarına uygun sertifikalı malzeme",
      "Mill test raporu ve tam izlenebilirlik zinciri",
      "Levha, blok, çubuk, profil ve özel kesim formatları",
      "Havacılık kalitesinde (aerospace grade) malzeme garantisi",
      "Projeye özel alaşım ve temper seçim danışmanlığı",
      "Stoktan hızlı teslimat ve proje bazlı planlama",
      "Teknik danışmanlık ve malzeme seçim desteği",
    ],
    specs: [
      { label: "Alaşım Serisi", value: "1xxx – 8xxx" },
      { label: "Sertifika", value: "AMS / ASTM / EN" },
      { label: "Format", value: "Levha / Blok / Çubuk / Profil" },
      { label: "Kalite", value: "Aerospace Grade" },
      { label: "İzlenebilirlik", value: "Mill Test Raporu" },
      { label: "Teslimat", value: "3–15 İş Günü" },
    ],
    gallery: [
      { url: "https://images.pexels.com/photos/1381938/pexels-photo-1381938.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Alüminyum levha ve metal stok alanı" },
      { url: "https://images.pexels.com/photos/3612930/pexels-photo-3612930.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Endüstriyel alüminyum depolama ve tedarik" },
      { url: "https://images.pexels.com/photos/2271100/pexels-photo-2271100.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Alüminyum profil ve metal işleme" },
      { url: "https://images.pexels.com/photos/434205/pexels-photo-434205.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Havacılık kalitesinde alüminyum hammadde" },
      { url: "https://images.pexels.com/photos/10221748/pexels-photo-10221748.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Alüminyum blok ve levha ürünleri" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=90", alt: "Sertifikalı alüminyum tedarik stoku" },
    ],
    process: [
      { title: "Teknik Gereksinim Belirleme", desc: "Projenin malzeme ihtiyaçlarının analizi; alaşım tipi, temper, boyut ve tolerans gereksinimlerinin netleştirilmesi." },
      { title: "Tedarik Planlama & Fiyatlama", desc: "Stok durumu kontrolü, tedarik kaynağı seçimi ve rekabetçi fiyat teklifinin hazırlanması." },
      { title: "Kalite Kontrol & Sertifikalandırma", desc: "Gelen malzemenin mill test raporu doğrulaması, boyutsal kontrol ve sertifika eşleştirmesi." },
      { title: "Paketleme & Teslimat", desc: "Malzemelerin hasar görmeyecek şekilde paketlenmesi ve anlaşılan sürede güvenli teslimatı." },
    ],
    is_active: true,
    sort_order: 2,
  },

  // ═══════════════════════════════════════════════════════════
  // 3. Mareşal Geri Dönüşüm
  // ═══════════════════════════════════════════════════════════
  {
    slug: "geri-donusum",
    title: "Mareşal Geri Dönüşüm",
    tag: "Geri Dönüşüm",
    description:
      "Çevre Bakanlığı onaylı yetkiler kapsamında alüminyum ve çelik geri dönüşüm ürünlerinin alım, satım ve sürdürülebilir yönetimi.",
    detail_description:
      "Mareşal Geri Dönüşüm, Çevre, Şehircilik ve İklim Değişikliği Bakanlığı tarafından onaylı yetkiler kapsamında metal geri dönüşüm faaliyetleri yürütmektedir. Tüm süreçler ilgili mevzuat ve sektör gerekliliklerine uygun şekilde planlanır. Faaliyetlerimiz kapsamında alüminyum ve çelik geri dönüşüm ürünlerinin alım ve satımı gerçekleştirilir. Geri dönüşüm süreçleri, metalin değerinin korunması ve yeniden kullanım zincirinde sağlıklı kazandırılması hedefiyle yürütülür. Mareşal geri dönüşüm alanında düzenli, sürdürülebilir ve güvenilir iş modeliyle sanayiye katkı sağlar. Tam izlenebilirlik ve yasal uyumluluk güvencesi ile çevresel ayak izinin azaltılmasına destek oluyoruz.",
    hero_image:
      "https://images.pexels.com/photos/20423571/pexels-photo-20423571.jpeg?auto=compress&cs=tinysrgb&w=1920&q=90",
    image:
      "https://images.pexels.com/photos/20423571/pexels-photo-20423571.jpeg?auto=compress&cs=tinysrgb&w=800&q=85",
    features: [
      "Çevre Bakanlığı onaylı lisanslı geri dönüşüm faaliyeti",
      "Alüminyum ve çelik hurda alım-satım hizmeti",
      "Malzeme sınıflandırma ve kalite ayrıştırma",
      "Tam izlenebilirlik ve yasal uyumluluk güvencesi",
      "Çevresel ayak izi azaltma ve karbon tasarrufu",
      "Düzenli toplama ve lojistik planlama",
      "Sanayiye yönelik ikincil hammadde tedariki",
      "Sürdürülebilir döngüsel ekonomi modeli",
    ],
    specs: [
      { label: "Lisans", value: "Bakanlık Onaylı" },
      { label: "Malzeme Türü", value: "Alüminyum & Çelik" },
      { label: "Min Alım", value: "500 kg" },
      { label: "Sınıflandırma", value: "Alaşım Bazlı" },
      { label: "Lojistik", value: "Tesis Teslim" },
      { label: "Raporlama", value: "Ağırlık & Analiz" },
    ],
    gallery: [
      { url: "https://images.pexels.com/photos/20423571/pexels-photo-20423571.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Metal hurda geri dönüşüm tesisi" },
      { url: "https://images.pexels.com/photos/10628555/pexels-photo-10628555.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Scrap metal ve alüminyum geri dönüşüm" },
      { url: "https://images.pexels.com/photos/27312813/pexels-photo-27312813.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Sınıflandırılmış metal hurda" },
      { url: "https://images.pexels.com/photos/5279399/pexels-photo-5279399.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Metal geri dönüşüm ve ayrıştırma" },
      { url: "https://images.pexels.com/photos/5846145/pexels-photo-5846145.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90", alt: "Geri dönüşüm tesisi operasyonu" },
    ],
    process: [
      { title: "Talep & Miktar Belirleme", desc: "Geri dönüşüme yönlendirilecek malzeme türü, tahmini miktarı ve toplama lokasyonunun belirlenmesi." },
      { title: "Toplama & Nakliye", desc: "Planlanan takvime göre malzemenin toplanması ve lisanslı tesise güvenli şekilde nakledilmesi." },
      { title: "Sınıflandırma & Tartım", desc: "Malzemenin alaşım bazında ayrıştırılması, tartılması ve kalite değerlendirmesinin yapılması." },
      { title: "Değerlendirme & Ödeme", desc: "Piyasa koşullarına göre fiyatlandırma, resmi belgelerin düzenlenmesi ve ödemenin gerçekleştirilmesi." },
    ],
    is_active: true,
    sort_order: 3,
  },
];

async function seed() {
  console.log("Deleting existing services...");
  const { error: delError } = await supabase
    .from("services")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (delError) {
    console.error("Delete error:", delError.message);
    return;
  }
  console.log("Existing services deleted.");

  console.log(`Inserting ${services.length} services...`);
  const { data, error } = await supabase
    .from("services")
    .insert(services)
    .select("id, title, slug");

  if (error) {
    console.error("Insert error:", error.message);
    return;
  }

  console.log("Successfully inserted:");
  data.forEach((s, i) => console.log(`  ${i + 1}. ${s.title} (/${s.slug})`));
  console.log("\nDone!");
}

seed();
