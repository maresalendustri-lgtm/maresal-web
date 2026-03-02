import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getMainService, getRegularServices } from "@/lib/actions/services";
import type { Service } from "@/types/service";
import RevealOnScroll from "@/components/RevealOnScroll";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hizmetlerimiz | Maresal Havacılık & Metal",
  description:
    "Havacılık ve savunma sanayiinde ISO 9001, 14001 ve 45001 sertifikalı CNC işleme, metal mühendisliği, kalite kontrol, 5 eksen işleme, yüzey işlemleri ve prototip Ar-Ge hizmetleri.",
  openGraph: {
    title: "Hizmetlerimiz | Maresal Havacılık & Metal",
    description:
      "Havacılık ve savunma sanayiinde ISO 9001, 14001 ve 45001 sertifikalı, tam kapsamlı üretim ve mühendislik hizmetleri.",
    type: "website",
  },
};

const CAPABILITIES = [
  { label: "Tolerans", value: "±0.005mm" },
  { label: "Max Parça", value: "2000mm" },
  { label: "Malzeme Çeşidi", value: "30+" },
  { label: "Günlük Kapasite", value: "500+ Parça" },
];

const PROCESS = [
  { num: "01", title: "Teknik İnceleme", desc: "Çizim ve spesifikasyon analizi, üretilebilirlik değerlendirmesi" },
  { num: "02", title: "Teklif & Planlama", desc: "Detaylı fiyatlama, malzeme ve süreç planlaması" },
  { num: "03", title: "Üretim", desc: "CNC işleme, yüzey işlem ve montaj süreçleri" },
  { num: "04", title: "Kalite & Teslimat", desc: "Kapsamlı test, dokümantasyon ve zamanında teslimat" },
];

const HIGHLIGHTS = [
  "ISO 9001, 14001 & 45001 sertifikalı",
  "Mikron hassasiyette üretim",
  "Tam izlenebilirlik ve dokümantasyon",
  "Zamanında teslimat garantisi",
];

export default async function ServicesPage() {
  const mainService = await getMainService();
  const services = await getRegularServices();
  const allServices = mainService ? [mainService, ...services] : services;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Maresal Hizmetler",
    description: "Havacılık ve savunma sanayiinde ISO sertifikalı üretim hizmetleri",
    numberOfItems: allServices.length,
    itemListElement: allServices.map((svc, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: svc.title,
        description: svc.description,
        url: `https://maresal.com.tr/hizmetler/${svc.slug}`,
        ...(svc.image ? { image: svc.image } : {}),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="sv-hero" aria-label="Hizmetler">
        <div className="sv-hero__bg" role="img" aria-label="Havacılık üretimi" />
        <div className="sv-hero__overlay" />
        <div className="sv-hero__particles" aria-hidden="true">
          <span className="sv-hero__dot sv-hero__dot--1" />
          <span className="sv-hero__dot sv-hero__dot--2" />
          <span className="sv-hero__dot sv-hero__dot--3" />
          <span className="sv-hero__dot sv-hero__dot--4" />
        </div>
        <div className="sv-hero__content">
          <nav className="sv-hero__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Ana Sayfa</Link>
            <span aria-hidden="true">/</span>
            <span>Hizmetler</span>
          </nav>
          <span className="sv-hero__label">Hizmetlerimiz</span>
          <h1 className="sv-hero__title">
            <span>Metal & Alüminyum</span>
            <span className="sv-hero__title--gold">İşleme Çözümleri</span>
          </h1>
          <p className="sv-hero__subtitle">
            Havacılık ve savunma sanayiinde ISO 9001, 14001 ve 45001 sertifikalı, tam kapsamlı üretim ve mühendislik hizmetleri.
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="sv-caps" aria-label="Yetenekler">
        <div className="sv-caps__inner">
          {CAPABILITIES.map((cap, i) => (
            <RevealOnScroll key={cap.label} delay={i * 0.1}>
              <div className="sv-cap">
                <span className="sv-cap__value">{cap.value}</span>
                <span className="sv-cap__label">{cap.label}</span>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Main service - featured */}
      {mainService && (
        <section className="sv-main-section" aria-label="Ana hizmet">
          <div className="sv-main-section__wrap">
            <RevealOnScroll>
              <div className="sv-main-section__head">
                <span className="section__label">Ana Hizmet</span>
                <h2 className="section__title">Yüksek Teknoloji Çözümleri</h2>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <MainServiceCard service={mainService} />
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* Services grid */}
      <section className="sv-grid-section" aria-label="Hizmet listesi">
        <div className="sv-grid-section__wrap">
          <RevealOnScroll>
            <div className="sv-grid-section__head">
              <span className="section__label">Uzmanlık Alanları</span>
              <h2 className="section__title">Ne Yapıyoruz?</h2>
              <p className="section__lead">
                Tasarımdan teslimata, havacılık ve savunma sanayiinin ihtiyaçlarına özel üretim çözümleri.
              </p>
            </div>
          </RevealOnScroll>

          <div className="sv-grid">
            {services.map((svc, i) => (
              <RevealOnScroll key={svc.id} delay={0.05 * ((i % 6) + 1)}>
                <ServiceCard service={svc} />
              </RevealOnScroll>
            ))}
          </div>

          {services.length === 0 && !mainService && (
            <p className="sv-empty">Henüz hizmet eklenmemiş.</p>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="sv-process" aria-label="Süreç">
        <div className="sv-process__wrap">
          <RevealOnScroll>
            <div className="sv-process__head">
              <span className="section__label">Süreç</span>
              <h2 className="section__title">Nasıl Çalışıyoruz?</h2>
            </div>
          </RevealOnScroll>
          <div className="sv-process__row">
            {PROCESS.map((step, i) => (
              <RevealOnScroll key={step.num} delay={0.1 * (i + 1)}>
                <div className="sv-pstep">
                  <span className="sv-pstep__num">{step.num}</span>
                  <h3 className="sv-pstep__title">{step.title}</h3>
                  <p className="sv-pstep__desc">{step.desc}</p>
                  {i < PROCESS.length - 1 && (
                    <span className="sv-pstep__arrow" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </span>
                  )}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight */}
      <section className="sv-highlight" aria-label="Neden Biz">
        <div className="sv-highlight__wrap">
          <RevealOnScroll direction="left">
            <div className="sv-highlight__img">
              <Image
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=90"
                alt="Havacılık üretim tesisi"
                width={640}
                height={480}
                className="sv-highlight__img-el"
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll direction="right">
            <div className="sv-highlight__body">
              <span className="section__label">Neden Biz?</span>
              <h2 className="sv-highlight__title">
                Havacılıkta Güvenilir
                <br />
                Çözüm Ortağı
              </h2>
              <p className="section__text">
                6 yılı aşkın sektör deneyimimiz, ISO sertifikalı süreçlerimiz ve 200&apos;den fazla
                tamamlanan projemizle güvenilirliğimizi kanıtlıyoruz.
              </p>
              <div className="sv-highlight__checks">
                {HIGHLIGHTS.map((h) => (
                  <div className="sv-highlight__check" key={h}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
              <Link href="/iletisim" className="sv-highlight__cta">
                Teklif Alın
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="sv-cta" aria-label="İletişim">
        <div className="sv-cta__glow" aria-hidden="true" />
        <RevealOnScroll>
          <div className="sv-cta__inner">
            <span className="section__label">Başlayalım</span>
            <h2 className="sv-cta__title">Projeniz İçin Teklif Alın</h2>
            <p className="sv-cta__desc">Teknik gereksinimlerinizi paylaşın, size özel çözüm sunalım.</p>
            <div className="sv-cta__btns">
              <Link href="/iletisim" className="sv-btn sv-btn--primary">
                İletişime Geçin
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <Link href="/galeri" className="sv-btn sv-btn--outline">Çalışmalarımız</Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <style>{`
        /* ═══ HERO ═══ */
        .sv-hero {
          position: relative; min-height: 85vh;
          display: flex; align-items: center; justify-content: center;
          text-align: center; overflow: hidden;
        }
        .sv-hero__bg {
          position: absolute; inset: -4%;
          background: url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=85') center/cover;
          animation: svBgZoom 15s ease-out forwards;
        }
        @keyframes svBgZoom { from { transform: scale(1.1); } to { transform: scale(1); } }
        .sv-hero__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg,
            rgba(8,12,18,0.5) 0%, rgba(8,12,18,0.35) 40%,
            rgba(8,12,18,0.7) 80%, rgba(8,12,18,0.95) 100%);
        }
        .sv-hero__particles { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .sv-hero__dot {
          position: absolute; border-radius: 50%; background: var(--color-accent); opacity: 0;
          animation: dotFloat 5s ease-in-out infinite;
        }
        @keyframes dotFloat {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 0.6; transform: translateY(-20px); }
        }
        .sv-hero__dot--1 { top: 18%; left: 12%; width: 4px; height: 4px; animation-delay: 0.3s; }
        .sv-hero__dot--2 { top: 68%; left: 82%; width: 5px; height: 5px; animation-delay: 1.5s; }
        .sv-hero__dot--3 { top: 38%; left: 90%; width: 3px; height: 3px; animation-delay: 0.8s; }
        .sv-hero__dot--4 { top: 78%; left: 18%; width: 4px; height: 4px; animation-delay: 2.2s; }
        .sv-hero__content {
          position: relative; z-index: 2;
          padding: 7rem 2rem 5rem; max-width: 860px;
          animation: fadeInUp 0.8s var(--ease) both;
        }
        .sv-hero__breadcrumb {
          display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; font-size: 0.8rem; color: var(--color-text-dim); margin-bottom: 1.5rem;
        }
        .sv-hero__breadcrumb a { color: var(--color-text-muted); transition: color 0.2s; }
        .sv-hero__breadcrumb a:hover { color: var(--color-accent); }
        .sv-hero__breadcrumb span:last-child { color: var(--color-accent); }
        .sv-hero__label {
          display: inline-block; font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-accent);
          padding: 0.35rem 1rem; border: 1px solid rgba(201,162,39,0.3);
          border-radius: 999px; background: rgba(201,162,39,0.08);
          backdrop-filter: blur(8px); margin-bottom: 1.5rem;
        }
        .sv-hero__title {
          display: flex; flex-direction: column; align-items: center; margin: 0 0 1.25rem;
          font-family: var(--font-display); font-size: clamp(2.6rem, 7vw, 5rem);
          font-weight: 700; line-height: 1.08; color: var(--color-text); letter-spacing: -0.025em;
        }
        .sv-hero__title--gold {
          background: var(--grad-accent);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; font-style: italic;
        }
        .sv-hero__subtitle {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: var(--color-text-muted); line-height: 1.75;
          max-width: 520px; margin: 0 auto;
        }

        /* ═══ MAIN SERVICE ═══ */
        .sv-main-section {
          padding: var(--space-2xl) var(--space-lg);
          background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-elevated) 100%);
          border-top: 1px solid rgba(201,162,39,0.12);
          border-bottom: 1px solid rgba(201,162,39,0.08);
        }
        .sv-main-section__wrap { max-width: 1100px; margin: 0 auto; }
        .sv-main-section__head { text-align: center; margin-bottom: 2.5rem; }
        .sv-main-card {
          display: grid; grid-template-columns: 1.2fr 1fr;
          gap: 3rem; align-items: center;
          background: var(--color-bg-elevated);
          border: 1px solid rgba(201,162,39,0.2);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform 0.4s var(--ease), box-shadow 0.4s, border-color 0.3s;
          cursor: pointer;
        }
        .sv-main-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,162,39,0.25);
          border-color: rgba(201,162,39,0.3);
        }
        .sv-main-card__img-wrap {
          position: relative; aspect-ratio: 16/10; overflow: hidden;
        }
        .sv-main-card__img { transition: transform 0.7s var(--ease); }
        .sv-main-card:hover .sv-main-card__img { transform: scale(1.06); }
        .sv-main-card__img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 40%, rgba(8,12,18,0.6) 100%);
        }
        .sv-main-card__tag {
          position: absolute; top: 1.25rem; left: 1.25rem;
          padding: 0.35rem 0.9rem;
          background: rgba(201,162,39,0.2); backdrop-filter: blur(8px);
          border: 1px solid rgba(201,162,39,0.4); color: var(--color-accent);
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; border-radius: var(--radius-pill);
        }
        .sv-main-card__body { padding: 2.5rem 2rem; }
        .sv-main-card__title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700; color: var(--color-text);
          margin: 0 0 0.75rem; letter-spacing: -0.02em; line-height: 1.2;
        }
        .sv-main-card__desc {
          font-size: 0.95rem; color: var(--color-text-muted);
          line-height: 1.7; margin: 0 0 1.5rem;
        }
        .sv-main-card__features {
          list-style: none; display: flex; flex-direction: column;
          gap: 0.5rem; margin: 0 0 1.5rem;
        }
        .sv-main-card__features li {
          display: flex; align-items: center; gap: 0.6rem;
          font-size: 0.88rem; color: var(--color-text-muted);
        }
        .sv-main-card__features svg { color: var(--color-accent); flex-shrink: 0; }
        .sv-main-card__cta {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.5rem; border-radius: var(--radius-pill);
          background: var(--color-accent); color: var(--color-bg);
          font-size: 0.9rem; font-weight: 600;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .sv-main-card__cta:hover {
          background: var(--color-accent-lt);
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(201,162,39,0.35);
        }
        @media (max-width: 900px) {
          .sv-main-card { grid-template-columns: 1fr; }
          .sv-main-card__img-wrap { aspect-ratio: 21/9; }
        }

        /* ═══ CAPABILITIES ═══ */
        .sv-caps {
          background: var(--color-bg-elevated);
          border-top: 1px solid rgba(201,162,39,0.1);
          border-bottom: 1px solid rgba(201,162,39,0.1);
          padding: 3rem 2rem;
        }
        .sv-caps__inner {
          max-width: 1000px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 2rem; text-align: center;
        }
        .sv-cap__value {
          display: block; font-family: var(--font-display);
          font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 700;
          background: var(--grad-accent);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          line-height: 1; margin-bottom: 0.35rem;
        }
        .sv-cap__label {
          font-size: 0.82rem; color: var(--color-text-muted);
          letter-spacing: 0.05em; font-weight: 500;
        }

        /* ═══ GRID ═══ */
        .sv-grid-section { padding: var(--space-2xl) var(--space-lg); background: var(--color-bg); }
        .sv-grid-section__wrap { max-width: 1300px; margin: 0 auto; }
        .sv-grid-section__head { text-align: center; margin-bottom: 3.5rem; }
        .section__label {
          display: inline-block; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-accent);
          margin-bottom: 0.5rem;
        }
        .section__title {
          font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700; color: var(--color-text); margin: 0 0 0.75rem;
          letter-spacing: -0.02em; line-height: 1.15;
        }
        .section__lead {
          font-size: 1.05rem; color: var(--color-text-muted);
          line-height: 1.7; max-width: 560px; margin: 0 auto;
        }
        .section__text {
          font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.75;
        }
        .sv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .sv-empty { padding: 5rem 0; text-align: center; color: var(--color-text-dim); }

        /* ═══ CARD ═══ */
        .sv-card {
          position: relative; background: var(--color-bg-elevated);
          border-radius: var(--radius-lg); overflow: hidden;
          border: 1px solid var(--color-border);
          cursor: pointer; display: flex; flex-direction: column; height: 100%;
          transition: transform 0.4s var(--ease), box-shadow 0.4s, border-color 0.3s;
        }
        .sv-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,162,39,0.2);
          border-color: transparent;
        }
        .sv-card__img-wrap { position: relative; height: 200px; overflow: hidden; flex-shrink: 0; }
        .sv-card__img { transition: transform 0.7s var(--ease); }
        .sv-card:hover .sv-card__img { transform: scale(1.1); }
        .sv-card__img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(8,12,18,0.8) 100%);
        }
        .sv-card__tag {
          position: absolute; top: 0.85rem; right: 0.85rem;
          padding: 0.25rem 0.7rem;
          background: rgba(8,12,18,0.7); backdrop-filter: blur(8px);
          border: 1px solid rgba(201,162,39,0.3); color: var(--color-accent);
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; border-radius: var(--radius-pill);
        }
        .sv-card__body {
          padding: 1.75rem; display: flex; flex-direction: column; flex: 1;
        }
        .sv-card__title {
          font-family: var(--font-display);
          font-size: 1.2rem; font-weight: 700; color: var(--color-text);
          margin: 0 0 0.5rem; letter-spacing: -0.01em;
        }
        .sv-card__desc {
          font-size: 0.88rem; color: var(--color-text-muted);
          line-height: 1.65; margin: 0 0 1rem;
        }
        .sv-card__features {
          list-style: none; display: flex; flex-direction: column;
          gap: 0.4rem; margin: 0 0 1.25rem; flex: 1;
        }
        .sv-card__features li {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.82rem; color: var(--color-text-muted); line-height: 1.4;
        }
        .sv-card__features svg { color: var(--color-accent); flex-shrink: 0; }
        .sv-card__cta {
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 1.5px solid rgba(201,162,39,0.3);
          color: var(--color-accent); font-size: 0.85rem; font-weight: 600;
          padding: 0.6rem 1.1rem; border-radius: var(--radius-pill);
          align-self: flex-start; margin-top: auto;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          background: transparent;
        }
        .sv-card:hover .sv-card__cta {
          background: var(--color-accent); color: var(--color-bg);
          box-shadow: 0 4px 16px rgba(201,162,39,0.3);
        }
        .sv-card__cta svg { transition: transform 0.2s; }
        .sv-card:hover .sv-card__cta svg { transform: translateX(3px); }
        .sv-card__shine {
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.04) 50%, transparent 100%);
          transform: skewX(-15deg); transition: left 0.6s var(--ease); pointer-events: none;
        }
        .sv-card:hover .sv-card__shine { left: 120%; }

        /* ═══ PROCESS ═══ */
        .sv-process { padding: var(--space-2xl) var(--space-lg); background: var(--color-bg-elevated); }
        .sv-process__wrap { max-width: 1100px; margin: 0 auto; }
        .sv-process__head { text-align: center; margin-bottom: 3.5rem; }
        .sv-process__row {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; position: relative;
        }
        .sv-pstep {
          position: relative; text-align: center;
          padding: 2rem 1.25rem; background: var(--color-surface);
          border: 1px solid var(--color-border); border-radius: var(--radius-lg);
          transition: border-color 0.3s, transform 0.4s var(--ease), box-shadow 0.4s;
        }
        .sv-pstep:hover {
          border-color: rgba(201,162,39,0.3);
          transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.3);
        }
        .sv-pstep__num {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(201,162,39,0.1); border: 2px solid rgba(201,162,39,0.3);
          color: var(--color-accent);
          font-family: var(--font-display); font-size: 0.9rem; font-weight: 700;
          margin: 0 auto 1rem; transition: background 0.3s, box-shadow 0.3s;
        }
        .sv-pstep:hover .sv-pstep__num {
          background: rgba(201,162,39,0.2); box-shadow: 0 0 20px rgba(201,162,39,0.2);
        }
        .sv-pstep__title {
          font-family: var(--font-display);
          font-size: 1.05rem; font-weight: 700; color: var(--color-text); margin: 0 0 0.4rem;
        }
        .sv-pstep__desc { font-size: 0.84rem; color: var(--color-text-muted); line-height: 1.6; margin: 0; }
        .sv-pstep__arrow {
          position: absolute; top: 50%; right: -1.1rem;
          transform: translateY(-50%); color: var(--color-text-dim); opacity: 0.4; z-index: 2;
        }

        /* ═══ HIGHLIGHT ═══ */
        .sv-highlight { padding: var(--space-2xl) var(--space-lg); background: var(--color-bg); }
        .sv-highlight__wrap {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center;
        }
        .sv-highlight__img {
          border-radius: var(--radius-lg); overflow: hidden;
          box-shadow: var(--shadow-lg); border: 1px solid rgba(201,162,39,0.15);
        }
        .sv-highlight__img-el {
          width: 100%; height: auto; aspect-ratio: 4/3; object-fit: cover; display: block;
          transition: transform 0.8s var(--ease);
        }
        .sv-highlight__img:hover .sv-highlight__img-el { transform: scale(1.04); }
        .sv-highlight__title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 700; color: var(--color-text);
          margin: 0.5rem 0 1.25rem; line-height: 1.2; letter-spacing: -0.02em;
        }
        .sv-highlight__checks { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; }
        .sv-highlight__check {
          display: flex; align-items: center; gap: 0.65rem;
          font-size: 0.92rem; color: var(--color-text-muted);
        }
        .sv-highlight__check svg { color: var(--color-accent); flex-shrink: 0; }
        .sv-highlight__cta {
          display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 2rem;
          padding: 0.75rem 1.75rem; border-radius: var(--radius-pill);
          background: var(--color-accent); color: var(--color-bg);
          font-size: 0.9rem; font-weight: 600;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .sv-highlight__cta:hover {
          background: var(--color-accent-lt); transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(201,162,39,0.3);
        }
        .sv-highlight__cta svg { transition: transform 0.3s var(--ease); }
        .sv-highlight__cta:hover svg { transform: translateX(4px); }

        /* ═══ CTA ═══ */
        .sv-cta {
          position: relative; padding: 7rem 2rem;
          background: var(--color-bg-elevated); text-align: center; overflow: hidden;
        }
        .sv-cta__glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 600px; height: 350px;
          background: radial-gradient(ellipse, rgba(201,162,39,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .sv-cta__inner { position: relative; max-width: 600px; margin: 0 auto; }
        .sv-cta__title {
          font-family: var(--font-display);
          font-size: clamp(1.9rem, 4vw, 3rem);
          font-weight: 700; margin: 0.5rem 0 1rem;
          color: var(--color-text); letter-spacing: -0.02em; line-height: 1.15;
        }
        .sv-cta__desc {
          color: var(--color-text-muted); margin: 0 0 2.5rem;
          line-height: 1.7; font-size: 1.05rem;
        }
        .sv-cta__btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .sv-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.75rem; border-radius: var(--radius-pill);
          font-size: 0.9rem; font-weight: 600; transition: all 0.25s var(--ease);
        }
        .sv-btn--primary {
          background: var(--color-accent); color: var(--color-bg);
        }
        .sv-btn--primary:hover {
          background: var(--color-accent-lt); transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(201,162,39,0.3);
        }
        .sv-btn--outline {
          background: transparent; color: var(--color-text-muted);
          border: 1px solid var(--color-border);
        }
        .sv-btn--outline:hover {
          border-color: rgba(255,255,255,0.15); color: var(--color-text);
          transform: translateY(-2px);
        }

        /* ═══ RESPONSIVE ═══ */
        @media (max-width: 1024px) {
          .sv-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .sv-process__row { grid-template-columns: repeat(2, 1fr); }
          .sv-pstep__arrow { display: none; }
          .sv-highlight__wrap { grid-template-columns: 1fr; gap: 3rem; }
          .sv-caps__inner { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .sv-hero { min-height: 75vh; }
          .sv-hero__content { padding: 6rem 1.5rem 4rem; }
          .sv-hero__title { font-size: clamp(2rem, 8vw, 3.5rem); }
        }
        @media (max-width: 600px) {
          .sv-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .sv-grid-section { padding: var(--space-xl) var(--space-md); }
          .sv-process { padding: var(--space-xl) var(--space-md); }
          .sv-process__row { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
          .sv-highlight { padding: var(--space-xl) var(--space-md); }
          .sv-caps { padding: 2rem 1.25rem; }
        }
      `}</style>
    </>
  );
}

function MainServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/hizmetler/${service.slug}`} className="sv-main-card">
      <div className="sv-main-card__img-wrap">
        {service.hero_image || service.image ? (
          <Image
            src={service.hero_image || service.image || ""}
            alt={service.title}
            fill
            className="sv-main-card__img"
            style={{ objectFit: "cover" }}
            sizes="(max-width: 900px) 100vw, 55vw"
            unoptimized
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-dim)" }}>
            Görsel Yok
          </div>
        )}
        <div className="sv-main-card__img-overlay" />
        <span className="sv-main-card__tag">{service.tag}</span>
      </div>
      <div className="sv-main-card__body">
        <h3 className="sv-main-card__title">{service.title}</h3>
        <p className="sv-main-card__desc">{service.description}</p>
        <ul className="sv-main-card__features">
          {service.features.slice(0, 4).map((f) => (
            <li key={f}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              {f}
            </li>
          ))}
        </ul>
        <span className="sv-main-card__cta">
          Detaylı Bilgi
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </span>
      </div>
    </Link>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/hizmetler/${service.slug}`} className="sv-card">
      <div className="sv-card__img-wrap">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="sv-card__img"
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-dim)" }}>
            Görsel Yok
          </div>
        )}
        <div className="sv-card__img-overlay" />
        <span className="sv-card__tag">{service.tag}</span>
      </div>

      <div className="sv-card__body">
        <h3 className="sv-card__title">{service.title}</h3>
        <p className="sv-card__desc">{service.description}</p>
        <ul className="sv-card__features">
          {service.features.slice(0, 3).map((f) => (
            <li key={f}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              {f}
            </li>
          ))}
        </ul>
        <span className="sv-card__cta">
          <span>Detaylı Bilgi</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </span>
      </div>
      <div className="sv-card__shine" aria-hidden="true" />
    </Link>
  );
}
