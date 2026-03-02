import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BUSINESS } from "@/lib/business";
import { GALLERY_CATEGORIES } from "@/lib/gallery";
import { getGalleryImages } from "@/lib/actions/gallery";
import GalleryPageClient from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "Galeri | Mareşal Mühendislik",
  description:
    "Havacılık, savunma ve metal işleme projelerimizden seçme görüntüler. CNC üretim, kalite kontrol ve tamamlanan referans projelerimiz.",
  openGraph: {
    title: "Galeri | Mareşal",
    description: "Üretim süreçlerimiz ve projelerimizden görüntüler.",
    type: "website",
  },
};

const STATS = [
  { value: "200+", label: "Tamamlanan Proje" },
  { value: "5", label: "Uzmanlık Alanı" },
  { value: "6+", label: "Yıllık Deneyim" },
  { value: "%100", label: "Kalite Odaklı" },
];

export default async function GalleryPage() {
  const images = await getGalleryImages();
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BUSINESS.url },
      { "@type": "ListItem", position: 2, name: "Galeri", item: `${BUSINESS.url}/galeri` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <section className="gp-hero">
        <div className="gp-hero__bg-wrap">
          <Image
            src="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1920&q=85"
            alt=""
            fill
            priority
            className="gp-hero__bg-img"
            sizes="100vw"
            unoptimized
          />
        </div>
        <div className="gp-hero__overlay" />
        <div className="gp-hero__content">
          <nav className="gp-hero__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Ana Sayfa</Link>
            <span>/</span>
            <span>Galeri</span>
          </nav>
          <span className="gp-hero__label">Galeri & Projeler</span>
          <h1 className="gp-hero__title">
            <span>Üretim</span>
            <span className="gp-hero__title--accent">Süreçlerimiz</span>
          </h1>
          <p className="gp-hero__subtitle">
            Havacılık, savunma ve metal işleme projelerimizden seçme görüntüler. CNC üretim, kalite kontrol ve tamamlanan referans projelerimiz.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="gp-stats" aria-label="İstatistikler">
        <div className="gp-stats__inner">
          {STATS.map((s) => (
            <div key={s.label} className="gp-stat">
              <span className="gp-stat__value">{s.value}</span>
              <span className="gp-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery grid (client for filters + lightbox) */}
      <GalleryPageClient images={images} categories={GALLERY_CATEGORIES} />

      {/* CTA */}
      <section className="gp-cta">
        <div className="gp-cta__inner">
          <span className="gp-cta__label">Projeniz mi var?</span>
          <h2 className="gp-cta__title">Birlikte Çalışalım</h2>
          <p className="gp-cta__desc">
            Teknik gereksinimlerinizi paylaşın, uzman ekibimiz size en uygun çözümü sunacaktır.
          </p>
          <div className="gp-cta__btns">
            <Link href="/iletisim" className="gp-cta__btn gp-cta__btn--primary">
              İletişime Geçin →
            </Link>
            <Link href="/hizmetler" className="gp-cta__btn gp-cta__btn--outline">
              Hizmetlerimiz
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .gp-hero{position:relative;min-height:75vh;display:flex;align-items:flex-end;overflow:hidden}
        .gp-hero__bg-wrap{position:absolute;inset:0;overflow:hidden}
        .gp-hero__bg-img{object-fit:cover;animation:gpBgZoom 12s ease-out forwards}
        @keyframes gpBgZoom{from{transform:scale(1.08)}to{transform:scale(1)}}
        .gp-hero__overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,12,18,.35) 0%,rgba(8,12,18,.25) 30%,rgba(8,12,18,.65) 65%,rgba(8,12,18,.97) 100%)}
        .gp-hero__content{position:relative;z-index:2;padding:0 3rem 4.5rem;max-width:780px;animation:fadeInUp .8s .1s var(--ease) both}
        .gp-hero__breadcrumb{display:flex;align-items:center;gap:.45rem;font-size:.78rem;color:var(--color-text-dim);margin-bottom:1.5rem}
        .gp-hero__breadcrumb a{color:var(--color-text-muted);transition:color .2s}.gp-hero__breadcrumb a:hover{color:var(--color-accent)}
        .gp-hero__label{display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent);padding:.32rem .9rem;border:1px solid rgba(201,162,39,.3);border-radius:999px;background:rgba(201,162,39,.08);backdrop-filter:blur(8px);margin-bottom:1.25rem}
        .gp-hero__title{font-family:var(--font-display);font-size:clamp(2.4rem,6vw,4.2rem);font-weight:700;line-height:1.08;color:var(--color-text);letter-spacing:-.03em;margin:0 0 1rem}
        .gp-hero__title span{display:block}
        .gp-hero__title--accent{color:var(--color-accent)}
        .gp-hero__subtitle{font-size:clamp(.95rem,1.6vw,1.1rem);color:var(--color-text-muted);line-height:1.75;max-width:520px;margin:0}
        @media(max-width:768px){.gp-hero{min-height:65vh}.gp-hero__content{padding:0 1.5rem 3.5rem}}

        .gp-stats{background:var(--color-surface);border-top:1px solid var(--color-border);border-bottom:1px solid var(--color-border);padding:2.5rem var(--space-lg)}
        .gp-stats__inner{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;text-align:center}
        .gp-stat{display:flex;flex-direction:column;gap:.2rem}
        .gp-stat__value{font-family:var(--font-display);font-size:clamp(1.6rem,3vw,2.2rem);font-weight:700;color:var(--color-accent);letter-spacing:-.02em}
        .gp-stat__label{font-size:.78rem;color:var(--color-text-dim);text-transform:uppercase;letter-spacing:.1em;font-weight:600}
        @media(max-width:768px){.gp-stats__inner{grid-template-columns:1fr 1fr;gap:1.5rem}}

        .gp-cta{position:relative;padding:7rem 2rem;background:var(--color-bg-elevated);text-align:center;overflow:hidden}
        .gp-cta__inner{position:relative;max-width:600px;margin:0 auto}
        .gp-cta__label{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent);margin-bottom:.5rem}
        .gp-cta__title{font-family:var(--font-display);font-size:clamp(2rem,4.5vw,3.2rem);font-weight:700;color:var(--color-text);letter-spacing:-.02em;line-height:1.15;margin:.5rem 0 1rem}
        .gp-cta__desc{color:var(--color-text-muted);margin:0 0 2.5rem;line-height:1.7;font-size:1.05rem}
        .gp-cta__btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
        .gp-cta__btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.75rem;font-weight:600;font-size:1rem;border-radius:999px;text-decoration:none;transition:all .3s}
        .gp-cta__btn--primary{background:var(--grad-accent);color:#080c12;border:none}
        .gp-cta__btn--primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,162,39,.4)}
        .gp-cta__btn--outline{background:transparent;color:var(--color-text);border:1px solid var(--color-border)}
        .gp-cta__btn--outline:hover{border-color:var(--color-accent);color:var(--color-accent)}
        @media(max-width:500px){.gp-cta{padding:5rem 1.5rem}}
      `}</style>
    </>
  );
}
