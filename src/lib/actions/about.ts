"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { AboutContent } from "@/types/about";

const DEFAULT_MILESTONES = [
  { year: "2019", title: "Kuruluş", description: "Mareşal, İstanbul'da havacılık ve savunma sanayi için alüminyum ve metal işleme hizmetleri sunmak üzere kuruldu." },
  { year: "2021", title: "ISO Sertifikasyonları", description: "ISO 9001, 14001 ve 45001 kalite, çevre ve iş güvenliği yönetim sistemleri sertifikalarını aldık." },
  { year: "2023", title: "Kapasite Artışı", description: "Üretim ve teslimat kapasitesini artırarak daha geniş müşteri portföyüne hizmet vermeye başladık." },
  { year: "2024", title: "Pazar Genişlemesi", description: "Yurt içi ve yurt dışı müşteri ağımızı genişleterek sektördeki konumumuzu güçlendirdik." },
];

const DEFAULT_CONTENT: AboutContent = {
  hero_title: "Mareşal",
  hero_subtitle: "2019'dan bu yana havacılık, savunma ve metal işleme sektöründe güvenilir çözüm ortağınız.",
  hero_image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=85",
  company_description:
    "Mareşal Mühendislik Danışmanlık Yazılım İthalat Ve İhracat Sanayi Ticaret Limited Şirketi olarak, savunma, havacılık ve ağır sanayi sektörlerinde entegre mühendislik çözümleri sunuyoruz. ISO 9001, 14001 ve 45001 sertifikalı üretim süreçlerimizle alüminyum, titanyum ve çelik malzemelerde hassas parça imalatı, CNC tornalama, frezeleme ve kalite kontrol hizmetleri veriyoruz. 6 yılı aşkın deneyimimiz ve 200'den fazla tamamlanan projemizle müşterilerimize güvenilir, zamanında ve sertifikalı üretim garantisi sağlıyoruz.",
  mission:
    "Havacılık ve savunma sanayiinde en yüksek kalite standartlarında üretim yaparak, müşterilerimizin projelerini güvenle hayata geçirmelerine destek olmak. ISO standartlarına tam uyum, sürekli iyileştirme ve müşteri odaklı yaklaşımla sektörde referans firma olmak.",
  vision:
    "Türkiye'nin havacılık ve savunma sanayiinde öncü metal işleme ve mühendislik çözüm ortağı olmak. Yurt içi ve yurt dışı pazar genişlemesi ile bölgesel güç haline gelmek.",
  stats: [
    { label: "Yıllık Deneyim", value: "6+" },
    { label: "Tamamlanan Proje", value: "200+" },
    { label: "Mutlu Müşteri", value: "50+" },
    { label: "Kalite Odaklı", value: "%100" },
    { label: "Uzmanlık Alanı", value: "5" },
    { label: "ISO Sertifikası", value: "3" },
  ],
  values_list: [
    {
      title: "ISO Sertifikasyonları",
      description:
        "ISO 9001, 14001 ve 45001 standartlarına tam uyum. Kalite, çevre ve iş güvenliği yönetim sistemlerimizle güvenilir üretim.",
    },
    {
      title: "Hassas İmalat",
      description:
        "Mikron toleranslarda CNC işleme, 5 eksen frezeleme ve gelişmiş kalite kontrol ile eksiksiz hassasiyet.",
    },
    {
      title: "Hızlı Teslimat",
      description:
        "Prototipten seri üretime, zamanında teslimat garantisi. Acil projeler için hızlandırılmış süreçler.",
    },
    {
      title: "Güvenilirlik",
      description:
        "Her projede tekrarlanabilir kalite ve izlenebilirlik. Tam dokümantasyon ve sertifikasyon desteği.",
    },
    {
      title: "Müşteri Odaklılık",
      description:
        "Teknik danışmanlık, özel çözümler ve proje bazlı yaklaşımla müşteri ihtiyaçlarına tam uyum.",
    },
    {
      title: "Sürdürülebilirlik",
      description:
        "Çevre yönetim sistemi ve geri dönüşüm odaklı üretim ile sürdürülebilir imalat prensipleri.",
    },
  ],
  milestones: DEFAULT_MILESTONES,
  certifications: [
    {
      name: "ISO 9001:2015",
      description:
        "Kalite yönetim sistemi standardı. Müşteri memnuniyeti, sürekli iyileştirme ve süreç odaklı yaklaşım ile üretim kalitemizi garanti altına alıyoruz.",
    },
    {
      name: "ISO 14001:2015",
      description:
        "Çevre yönetim sistemi standardı. Üretim süreçlerimizde çevresel etkiyi minimize ederek sürdürülebilir imalat prensiplerini uyguluyoruz.",
    },
    {
      name: "ISO 45001:2018",
      description:
        "İş sağlığı ve güvenliği yönetim sistemi standardı. Çalışanlarımızın güvenliği ve sağlığı için risk yönetimi ve sürekli iyileştirme uyguluyoruz.",
    },
  ],
  team_members: [],
};

export async function getAboutContent(): Promise<AboutContent> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("about_content")
    .select("content")
    .eq("id", 1)
    .single();

  if (error || !data?.content) return DEFAULT_CONTENT;

  const parsed = data.content as Partial<AboutContent>;
  const merged = { ...DEFAULT_CONTENT, ...parsed };
  if (!merged.milestones?.length) merged.milestones = DEFAULT_MILESTONES;
  return merged;
}

export async function updateAboutContent(
  content: AboutContent
): Promise<void> {
  const supabase = createAdminSupabase();

  const { error } = await supabase
    .from("about_content")
    .upsert(
      { id: 1, content },
      { onConflict: "id" }
    );

  if (error) throw new Error(`Kaydetme hatası: ${error.message}`);

  revalidatePath("/hakkimizda");
  revalidatePath("/admin/hakkimizda");
}

const BUCKET = "site-content";

async function ensureBucket() {
  const supabase = createAdminSupabase();
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) {
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
    });
  }
}

export async function uploadAboutImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Dosya seçilmedi.");

  if (file.size > 5 * 1024 * 1024)
    throw new Error("Dosya boyutu 5MB'dan büyük olamaz.");

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type))
    throw new Error("Sadece JPEG, PNG, WebP ve GIF formatları desteklenir.");

  const supabase = createAdminSupabase();
  await ensureBucket();

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `about/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Yükleme hatası: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
