import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getServiceBySlug,
  getActiveServices,
  getRelatedServices,
} from "@/lib/actions/services";
import RevealOnScroll from "@/components/RevealOnScroll";
import ServiceGallery from "@/components/ServiceGallery";

export const revalidate = 60;

export async function generateStaticParams() {
  const services = await getActiveServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Hizmet Bulunamadı" };

  return {
    title: `${service.title} | Maresal Havacılık & Metal`,
    description: service.description,
    openGraph: {
      title: `${service.title} | Maresal`,
      description: service.description,
      type: "article",
      ...(service.hero_image ? { images: [{ url: service.hero_image }] } : {}),
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const related = await getRelatedServices(slug, 3);
  const gallery = service.gallery || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.detail_description || service.description,
    provider: {
      "@type": "Organization",
      name: "Maresal Havacılık & Metal",
      url: "https://maresal.com.tr",
    },
    ...(service.hero_image ? { image: service.hero_image } : {}),
    url: `https://maresal.com.tr/hizmetler/${service.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://maresal.com.tr" },
      { "@type": "ListItem", position: 2, name: "Hizmetler", item: "https://maresal.com.tr/hizmetler" },
      { "@type": "ListItem", position: 3, name: service.title, item: `https://maresal.com.tr/hizmetler/${service.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <section className="sd-hero">
        <div className="sd-hero__bg-wrap">
          {service.hero_image && (
            <Image
              src={service.hero_image}
              alt={service.title}
              fill
              priority
              className="sd-hero__bg-img"
              sizes="100vw"
              unoptimized
            />
          )}
        </div>
        <div className="sd-hero__overlay" />
        <div className="sd-hero__content">
          <nav className="sd-hero__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/hizmetler">Hizmetler</Link>
            <span>/</span>
            <span>{service.title}</span>
          </nav>
          <span className="sd-hero__tag">{service.tag}</span>
          <h1 className="sd-hero__title">{service.title}</h1>
          <p className="sd-hero__subtitle">{service.description}</p>
          <Link href={`/hizmetler/${service.slug}/sunum`} className="sd-hero__pres-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            Sunum Modu
          </Link>
        </div>
        <div className="sd-hero__scroll" aria-hidden="true">
          <span className="sd-hero__scroll-line" />
        </div>
      </section>

      {/* Gallery Showcase */}
      {gallery.length > 0 && (
        <section className="sd-showcase" aria-label="Galeri">
          <div className="sd-showcase__wrap">
            <RevealOnScroll>
              <div className="sd-showcase__head">
                <span className="section__label">Görüntüler</span>
                <h2 className="section__title">Proje Galerisi</h2>
              </div>
            </RevealOnScroll>
            <ServiceGallery
              gallery={gallery}
              specs={service.specs}
              description={service.detail_description}
            />
          </div>
        </section>
      )}

      {/* Features */}
      <section className="sd-features" aria-label="Özellikler">
        <div className="sd-features__wrap">
          <RevealOnScroll direction="left">
            <div className="sd-features__left">
              <span className="section__label">Özellikler</span>
              <h2 className="sd-features__title">
                Bu Hizmette
                <br />
                Neler Sunuyoruz?
              </h2>
              {service.detail_description && (
                <p className="section__text">{service.detail_description}</p>
              )}
              <Link href="/iletisim" className="sd-features__cta">
                Teklif Alın
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
          </RevealOnScroll>
          <RevealOnScroll direction="right">
            <div className="sd-features__grid">
              {service.features.map((f, i) => (
                <div className="sd-feat" key={f}>
                  <span className="sd-feat__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="sd-feat__text">{f}</span>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Bento Grid */}
      {gallery.length >= 4 && (
        <section className="sd-bento" aria-label="Galeri grid">
          <RevealOnScroll>
            <div className="sd-bento__wrap">
              {gallery.slice(0, 4).map((img, i) => (
                <div key={img.url} className={`sd-bento__item sd-bento__item--${i + 1}`}>
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="sd-bento__img"
                    sizes="(max-width: 900px) 100vw, 60vw"
                    unoptimized
                  />
                  <div className="sd-bento__overlay">
                    <span>{img.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </section>
      )}

      {/* Process */}
      {service.process.length > 0 && (
        <section className="sd-process" aria-label="Süreç">
          <div className="sd-process__wrap">
            <RevealOnScroll>
              <div className="sd-process__head">
                <span className="section__label">Süreç</span>
                <h2 className="section__title">{service.title} Süreci</h2>
              </div>
            </RevealOnScroll>
            <div className="sd-process__timeline">
              {service.process.map((step, i) => (
                <RevealOnScroll key={step.title} delay={0.1 * (i + 1)}>
                  <div className="sd-pstep">
                    <div className="sd-pstep__marker">
                      <span className="sd-pstep__num">{String(i + 1).padStart(2, "0")}</span>
                      {i < service.process.length - 1 && <span className="sd-pstep__line" />}
                    </div>
                    <div className="sd-pstep__content">
                      <h3 className="sd-pstep__title">{step.title}</h3>
                      <p className="sd-pstep__desc">{step.desc}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="sd-related" aria-label="İlgili hizmetler">
          <div className="sd-related__wrap">
            <RevealOnScroll>
              <div className="sd-related__head">
                <span className="section__label">Diğer Hizmetler</span>
                <h2 className="section__title">İlgili Çözümler</h2>
              </div>
            </RevealOnScroll>
            <div className="sd-related__grid">
              {related.map((svc, i) => (
                <RevealOnScroll key={svc.id} delay={0.1 * (i + 1)}>
                  <Link href={`/hizmetler/${svc.slug}`} className="sd-rcard">
                    <div className="sd-rcard__img-wrap">
                      {svc.image ? (
                        <Image
                          src={svc.image}
                          alt={svc.title}
                          fill
                          className="sd-rcard__img"
                          sizes="(max-width: 900px) 100vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "var(--color-surface)" }} />
                      )}
                      <div className="sd-rcard__img-overlay" />
                      <span className="sd-rcard__tag">{svc.tag}</span>
                    </div>
                    <div className="sd-rcard__body">
                      <h3 className="sd-rcard__title">{svc.title}</h3>
                      <p className="sd-rcard__desc">{svc.description}</p>
                      <span className="sd-rcard__link">
                        Detay
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                      </span>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="sd-cta" aria-label="İletişim">
        <div className="sd-cta__glow" aria-hidden="true" />
        <div className="sd-cta__inner">
          <span className="section__label">Başlayalım</span>
          <h2 className="sd-cta__title">
            {service.title} için
            <br />
            Teklif Alın
          </h2>
          <p className="sd-cta__desc">
            Teknik gereksinimlerinizi paylaşın, uzman ekibimiz size özel çözüm sunacaktır.
          </p>
          <div className="sd-cta__btns">
            <Link href="/iletisim" className="sd-btn sd-btn--primary">
              İletişime Geçin
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <Link href="/hizmetler" className="sd-btn sd-btn--outline">Tüm Hizmetler</Link>
          </div>
        </div>
      </section>

      <style>{`
        /* ═══ SHARED ══════════ */
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
        .section__text { font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.75; }

        /* ═══ HERO ══════════════ */
        .sd-hero {
          position: relative; min-height: 75vh;
          display: flex; align-items: flex-end; overflow: hidden;
        }
        .sd-hero__bg-wrap { position: absolute; inset: 0; overflow: hidden; }
        .sd-hero__bg-img {
          object-fit: cover; object-position: center;
          animation: sdBgZoom 12s ease-out forwards;
        }
        @keyframes sdBgZoom { from { transform: scale(1.08); } to { transform: scale(1); } }
        .sd-hero__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg,
            rgba(8,12,18,0.3) 0%, rgba(8,12,18,0.2) 30%,
            rgba(8,12,18,0.6) 65%, rgba(8,12,18,0.97) 100%);
        }
        .sd-hero__content {
          position: relative; z-index: 2;
          padding: 0 3rem 4.5rem; max-width: 800px;
          animation: fadeInUp 0.8s 0.1s var(--ease) both;
        }
        .sd-hero__breadcrumb {
          display: flex; align-items: center; gap: 0.45rem;
          font-size: 0.78rem; color: var(--color-text-dim); margin-bottom: 1.5rem;
        }
        .sd-hero__breadcrumb a { color: var(--color-text-muted); transition: color 0.2s; }
        .sd-hero__breadcrumb a:hover { color: var(--color-accent); }
        .sd-hero__breadcrumb span:last-child { color: var(--color-text-muted); }
        .sd-hero__tag {
          display: inline-block; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-accent);
          padding: 0.32rem 0.9rem; border: 1px solid rgba(201,162,39,0.3);
          border-radius: 999px; background: rgba(201,162,39,0.08);
          backdrop-filter: blur(8px); margin-bottom: 1.25rem;
        }
        .sd-hero__title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700; line-height: 1.08;
          color: var(--color-text); letter-spacing: -0.03em; margin: 0 0 1rem;
        }
        .sd-hero__subtitle {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: var(--color-text-muted); line-height: 1.7; max-width: 540px; margin: 0 0 1.5rem;
        }
        .sd-hero__pres-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 1.3rem;
          background: rgba(201,162,39,0.1); border: 1px solid rgba(201,162,39,0.3);
          color: var(--color-accent); font-size: 0.82rem; font-weight: 600;
          border-radius: var(--radius-pill);
          backdrop-filter: blur(10px); letter-spacing: 0.03em;
          transition: all 0.3s var(--ease);
        }
        .sd-hero__pres-btn:hover {
          background: var(--color-accent); color: var(--color-bg);
          box-shadow: 0 0 24px rgba(201,162,39,0.4); transform: translateY(-2px);
        }
        .sd-hero__scroll {
          position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%); z-index: 2;
        }
        .sd-hero__scroll-line {
          display: block; width: 1px; height: 44px;
          background: linear-gradient(to bottom, rgba(201,162,39,0.6), transparent);
          animation: scrollBounce 2.2s ease-in-out infinite;
        }

        /* ═══ SHOWCASE ═════════ */
        .sd-showcase {
          padding: var(--space-2xl) var(--space-lg);
          background: var(--color-bg-elevated);
        }
        .sd-showcase__wrap { max-width: 1300px; margin: 0 auto; }
        .sd-showcase__head { text-align: center; margin-bottom: 3rem; }

        /* ═══ FEATURES ═════════ */
        .sd-features { padding: var(--space-2xl) var(--space-lg); background: var(--color-bg); }
        .sd-features__wrap {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 5rem; align-items: center;
        }
        .sd-features__title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 700; color: var(--color-text);
          margin: 0.5rem 0 1.25rem; line-height: 1.2; letter-spacing: -0.02em;
        }
        .sd-features__cta {
          display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 2rem;
          padding: 0.75rem 1.75rem; border-radius: var(--radius-pill);
          background: var(--color-accent); color: var(--color-bg);
          font-size: 0.9rem; font-weight: 600;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .sd-features__cta:hover {
          background: var(--color-accent-lt); transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(201,162,39,0.3);
        }
        .sd-features__cta svg { transition: transform 0.3s var(--ease); }
        .sd-features__cta:hover svg { transform: translateX(4px); }
        .sd-features__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .sd-feat {
          padding: 1.25rem; background: var(--color-bg-elevated);
          border: 1px solid var(--color-border); border-radius: var(--radius);
          display: flex; align-items: flex-start; gap: 0.85rem;
          transition: border-color 0.3s, transform 0.3s var(--ease);
        }
        .sd-feat:hover { border-color: rgba(201,162,39,0.25); transform: translateY(-3px); }
        .sd-feat__num {
          font-family: var(--font-display); font-size: 0.85rem; font-weight: 700;
          color: var(--color-accent); flex-shrink: 0;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(201,162,39,0.1); border: 1px solid rgba(201,162,39,0.25);
          display: flex; align-items: center; justify-content: center;
        }
        .sd-feat__text { font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.5; }

        /* ═══ BENTO GRID ═══════ */
        .sd-bento { padding: 0 var(--space-lg) var(--space-2xl); background: var(--color-bg); }
        .sd-bento__wrap {
          max-width: 1300px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(12, 1fr);
          grid-template-rows: 260px 260px; gap: 1rem;
        }
        .sd-bento__item {
          position: relative; border-radius: var(--radius-lg);
          overflow: hidden; cursor: pointer;
        }
        .sd-bento__item--1 { grid-column: 1 / 8; grid-row: 1 / 2; }
        .sd-bento__item--2 { grid-column: 8 / 13; grid-row: 1 / 2; }
        .sd-bento__item--3 { grid-column: 1 / 5; grid-row: 2 / 3; }
        .sd-bento__item--4 { grid-column: 5 / 13; grid-row: 2 / 3; }
        .sd-bento__img {
          object-fit: cover; transition: transform 0.7s var(--ease);
          filter: brightness(0.85);
        }
        .sd-bento__item:hover .sd-bento__img { transform: scale(1.08); filter: brightness(1); }
        .sd-bento__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(8,12,18,0.75) 100%);
          display: flex; align-items: flex-end; padding: 1.25rem;
          opacity: 0; transition: opacity 0.35s;
        }
        .sd-bento__item:hover .sd-bento__overlay { opacity: 1; }
        .sd-bento__overlay span { font-size: 0.88rem; font-weight: 500; color: var(--color-text); }

        /* ═══ PROCESS ══════════ */
        .sd-process { padding: var(--space-2xl) var(--space-lg); background: var(--color-bg-elevated); }
        .sd-process__wrap { max-width: 700px; margin: 0 auto; }
        .sd-process__head { text-align: center; margin-bottom: 3rem; }
        .sd-process__timeline { display: flex; flex-direction: column; }
        .sd-pstep { display: flex; gap: 1.5rem; }
        .sd-pstep__marker { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
        .sd-pstep__num {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(201,162,39,0.1); border: 2px solid rgba(201,162,39,0.3);
          color: var(--color-accent); font-family: var(--font-display);
          font-size: 0.88rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.3s, box-shadow 0.3s;
        }
        .sd-pstep:hover .sd-pstep__num {
          background: rgba(201,162,39,0.2); box-shadow: 0 0 18px rgba(201,162,39,0.2);
        }
        .sd-pstep__line {
          display: block; width: 2px; flex: 1; min-height: 32px;
          background: linear-gradient(to bottom, rgba(201,162,39,0.3), rgba(201,162,39,0.05));
        }
        .sd-pstep__content { padding-bottom: 2.5rem; }
        .sd-pstep__title {
          font-family: var(--font-display);
          font-size: 1.1rem; font-weight: 700; color: var(--color-text);
          margin: 0.6rem 0 0.35rem;
        }
        .sd-pstep__desc {
          font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.7; margin: 0;
        }

        /* ═══ RELATED ══════════ */
        .sd-related { padding: var(--space-2xl) var(--space-lg); background: var(--color-bg); }
        .sd-related__wrap { max-width: 1200px; margin: 0 auto; }
        .sd-related__head { text-align: center; margin-bottom: 3rem; }
        .sd-related__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .sd-rcard {
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); overflow: hidden;
          display: flex; flex-direction: column;
          transition: transform 0.4s var(--ease), box-shadow 0.4s, border-color 0.3s;
        }
        .sd-rcard:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          border-color: rgba(201,162,39,0.2);
        }
        .sd-rcard__img-wrap { position: relative; height: 180px; overflow: hidden; }
        .sd-rcard__img {
          object-fit: cover; transition: transform 0.6s var(--ease);
        }
        .sd-rcard:hover .sd-rcard__img { transform: scale(1.08); }
        .sd-rcard__img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(8,12,18,0.7) 100%);
        }
        .sd-rcard__tag {
          position: absolute; top: 0.75rem; right: 0.75rem;
          padding: 0.2rem 0.6rem; background: rgba(8,12,18,0.7);
          backdrop-filter: blur(8px); border: 1px solid rgba(201,162,39,0.3);
          color: var(--color-accent); font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: var(--radius-pill);
        }
        .sd-rcard__body { padding: 1.5rem; }
        .sd-rcard__title {
          font-family: var(--font-display);
          font-size: 1.1rem; font-weight: 700; color: var(--color-text); margin: 0 0 0.4rem;
        }
        .sd-rcard__desc {
          font-size: 0.84rem; color: var(--color-text-muted);
          line-height: 1.6; margin: 0 0 1rem;
        }
        .sd-rcard__link {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.85rem; font-weight: 600; color: var(--color-accent);
        }
        .sd-rcard__link svg { transition: transform 0.2s; }
        .sd-rcard:hover .sd-rcard__link svg { transform: translateX(4px); }

        /* ═══ CTA ══════════════ */
        .sd-cta {
          position: relative; padding: 7rem 2rem;
          background: var(--color-bg-elevated); text-align: center; overflow: hidden;
        }
        .sd-cta__glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 600px; height: 350px;
          background: radial-gradient(ellipse, rgba(201,162,39,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .sd-cta__inner { position: relative; max-width: 600px; margin: 0 auto; }
        .sd-cta__title {
          font-family: var(--font-display);
          font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 700;
          margin: 0.5rem 0 1rem; color: var(--color-text);
          letter-spacing: -0.02em; line-height: 1.15;
        }
        .sd-cta__desc {
          color: var(--color-text-muted); margin: 0 0 2.5rem;
          line-height: 1.7; font-size: 1.05rem;
        }
        .sd-cta__btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .sd-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.75rem; border-radius: var(--radius-pill);
          font-size: 0.9rem; font-weight: 600; transition: all 0.25s var(--ease);
        }
        .sd-btn--primary { background: var(--color-accent); color: var(--color-bg); }
        .sd-btn--primary:hover {
          background: var(--color-accent-lt); transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(201,162,39,0.3);
        }
        .sd-btn--outline {
          background: transparent; color: var(--color-text-muted);
          border: 1px solid var(--color-border);
        }
        .sd-btn--outline:hover {
          border-color: rgba(255,255,255,0.15); color: var(--color-text);
          transform: translateY(-2px);
        }

        /* ═══ RESPONSIVE ═══════ */
        @media (max-width: 1024px) {
          .sd-showcase { padding: var(--space-xl) var(--space-lg); }
        }
        @media (max-width: 900px) {
          .sd-features__wrap { grid-template-columns: 1fr; gap: 3rem; }
          .sd-related__grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .sd-bento__wrap {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 200px 200px;
          }
          .sd-bento__item--1 { grid-column: 1 / -1; }
          .sd-bento__item--2 { grid-column: 1 / 2; }
          .sd-bento__item--3 { grid-column: 2 / 3; }
          .sd-bento__item--4 { grid-column: 1 / -1; }
        }
        @media (max-width: 768px) {
          .sd-hero { min-height: 65vh; }
          .sd-hero__content { padding: 0 1.5rem 3.5rem; }
          .sd-hero__title { font-size: clamp(2rem, 7vw, 3rem); }
          .sd-hero__scroll { display: none; }
          .sd-features__grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 550px) {
          .sd-showcase { padding: var(--space-xl) var(--space-md); }
          .sd-features { padding: var(--space-xl) var(--space-md); }
          .sd-bento { padding: 0 var(--space-md) var(--space-xl); }
          .sd-bento__wrap {
            grid-template-columns: 1fr; grid-template-rows: repeat(4, 180px);
          }
          .sd-bento__item--1, .sd-bento__item--2,
          .sd-bento__item--3, .sd-bento__item--4 { grid-column: 1 / -1; }
          .sd-process { padding: var(--space-xl) var(--space-md); }
          .sd-related { padding: var(--space-xl) var(--space-md); }
        }
      `}</style>
    </>
  );
}
