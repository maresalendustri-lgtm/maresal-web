import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import HomeContact from "@/components/HomeContact";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "İletişim | Mareşal Mühendislik",
  description:
    "Mareşal ile iletişime geçin. Teklif alın, teknik danışmanlık için formu doldurun veya doğrudan bize ulaşın.",
  openGraph: {
    title: "İletişim | Mareşal",
    description: "Projeleriniz için teklif alın veya teknik danışmanlık için bize ulaşın.",
    type: "website",
  },
};

export default function ContactPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BUSINESS.url },
      { "@type": "ListItem", position: 2, name: "İletişim", item: `${BUSINESS.url}/iletisim` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <section className="ct-hero">
        <div className="ct-hero__bg-wrap">
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=85"
            alt=""
            fill
            priority
            className="ct-hero__bg-img"
            sizes="100vw"
            unoptimized
          />
        </div>
        <div className="ct-hero__overlay" />
        <div className="ct-hero__content">
          <nav className="ct-hero__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Ana Sayfa</Link>
            <span>/</span>
            <span>İletişim</span>
          </nav>
          <span className="ct-hero__label">İletişim</span>
          <h1 className="ct-hero__title">Projenizi Konuşalım</h1>
          <p className="ct-hero__subtitle">
            Teklif ve bilgi için formu doldurun veya doğrudan iletişime geçin.
          </p>
        </div>
        <div className="ct-hero__scroll" aria-hidden="true">
          <span className="ct-hero__scroll-line" />
        </div>
      </section>

      <HomeContact />

      <style>{`
        .ct-hero{position:relative;min-height:75vh;display:flex;align-items:flex-end;overflow:hidden}
        .ct-hero__bg-wrap{position:absolute;inset:0;overflow:hidden}
        .ct-hero__bg-img{object-fit:cover;animation:ctBgZoom 12s ease-out forwards}
        @keyframes ctBgZoom{from{transform:scale(1.08)}to{transform:scale(1)}}
        .ct-hero__overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,12,18,.35) 0%,rgba(8,12,18,.25) 30%,rgba(8,12,18,.65) 65%,rgba(8,12,18,.97) 100%)}
        .ct-hero__content{position:relative;z-index:2;padding:0 3rem 4.5rem;max-width:800px;animation:fadeInUp .8s .1s var(--ease) both}
        .ct-hero__breadcrumb{display:flex;align-items:center;gap:.45rem;font-size:.78rem;color:var(--color-text-dim);margin-bottom:1.5rem}
        .ct-hero__breadcrumb a{color:var(--color-text-muted);transition:color .2s}.ct-hero__breadcrumb a:hover{color:var(--color-accent)}
        .ct-hero__label{display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent);padding:.32rem .9rem;border:1px solid rgba(201,162,39,.3);border-radius:999px;background:rgba(201,162,39,.08);backdrop-filter:blur(8px);margin-bottom:1.25rem}
        .ct-hero__title{font-family:var(--font-display);font-size:clamp(2.2rem,5.5vw,4rem);font-weight:700;line-height:1.1;color:var(--color-text);letter-spacing:-.03em;margin:0 0 1rem}
        .ct-hero__subtitle{font-size:clamp(1rem,1.8vw,1.12rem);color:var(--color-text-muted);line-height:1.7;max-width:600px;margin:0}
        .ct-hero__scroll{position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:2}
        .ct-hero__scroll-line{display:block;width:1px;height:44px;background:linear-gradient(to bottom,rgba(201,162,39,.6),transparent);animation:scrollBounce 2.2s ease-in-out infinite}
        @media(max-width:768px){.ct-hero{min-height:65vh}.ct-hero__content{padding:0 1.5rem 3.5rem}.ct-hero__scroll{display:none}}
      `}</style>
    </>
  );
}
