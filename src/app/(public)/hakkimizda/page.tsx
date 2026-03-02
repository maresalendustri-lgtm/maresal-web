import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAboutContent } from "@/lib/actions/about";
import { BUSINESS } from "@/lib/business";
import RevealOnScroll from "@/components/RevealOnScroll";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hakkımızda | Mareşal Mühendislik, Alüminyum & Geri Dönüşüm",
  description:
    "Mareşal; savunma, havacılık ve ağır sanayi sektörlerinde mühendislik çözümleri, sertifikalı alüminyum tedariki ve sürdürülebilir geri dönüşüm hizmetleri sunan entegre çözüm ortağı.",
  openGraph: {
    title: "Hakkımızda | Mareşal",
    description:
      "Savunma, havacılık ve ağır sanayide entegre mühendislik, alüminyum tedarik ve geri dönüşüm çözümleri.",
    type: "website",
  },
};

export default async function AboutPage() {
  const about = await getAboutContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BUSINESS.url}/#organization`,
    name: BUSINESS.legalName,
    alternateName: BUSINESS.name,
    description: about.company_description,
    url: BUSINESS.url,
    foundingDate: about.milestones[0]?.year || "2019",
    ...(about.hero_image ? { image: about.hero_image } : {}),
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.address.addressLocality,
      addressCountry: BUSINESS.address.addressCountry,
    },
    ...(BUSINESS.googleMapsUrl ? { hasMap: BUSINESS.googleMapsUrl } : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BUSINESS.url },
      { "@type": "ListItem", position: 2, name: "Hakkımızda", item: `${BUSINESS.url}/hakkimizda` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <section className="ab-hero">
        <div className="ab-hero__bg-wrap">
          {about.hero_image && (
            <Image src={about.hero_image} alt="Mareşal Mühendislik tesisi" fill priority className="ab-hero__bg-img" sizes="100vw" unoptimized />
          )}
        </div>
        <div className="ab-hero__overlay" />
        <div className="ab-hero__content">
          <nav className="ab-hero__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Ana Sayfa</Link>
            <span>/</span>
            <span>Hakkımızda</span>
          </nav>
          <span className="ab-hero__label">Hakkımızda</span>
          <h1 className="ab-hero__title">{about.hero_title}</h1>
          <p className="ab-hero__subtitle">{about.hero_subtitle}</p>
        </div>
        <div className="ab-hero__scroll" aria-hidden="true">
          <span className="ab-hero__scroll-line" />
        </div>
      </section>

      {/* Stats */}
      {about.stats.length > 0 && (
        <section className="ab-stats" aria-label="Rakamlarla Mareşal">
          <div className="ab-stats__inner">
            {about.stats.map((stat, i) => (
              <RevealOnScroll key={stat.label} delay={i * 0.08}>
                <div className="ab-stat">
                  <span className="ab-stat__value">{stat.value}</span>
                  <span className="ab-stat__label">{stat.label}</span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>
      )}

      {/* Company Description */}
      <section className="ab-about" aria-label="Hakkımızda">
        <div className="ab-about__wrap">
          <RevealOnScroll direction="left">
            <div className="ab-about__left">
              <span className="ab-label">Biz Kimiz?</span>
              <div className="ab-about__badge">
                <span className="ab-about__badge-year">{about.milestones[0]?.year ?? "2019"}</span>
                <span className="ab-about__badge-text">Kuruluş Yılı</span>
              </div>
              <h2 className="ab-heading">
                Entegre Mühendislik
                <br />
                Çözüm Ortağı
              </h2>
              <p className="ab-text">{about.company_description}</p>
              <Link href="/hizmetler" className="ab-cta-btn">
                Hizmetlerimiz
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
          </RevealOnScroll>
          <RevealOnScroll direction="right">
            <div className="ab-about__right">
              <div className="ab-about__img-wrap">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=85"
                  alt="Mareşal üretim tesisi"
                  width={640}
                  height={480}
                  className="ab-about__img"
                  sizes="(max-width: 900px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Mission & Vision */}
      {(about.mission || about.vision) && (
        <section className="ab-mv" aria-label="Misyon ve Vizyon">
          <div className="ab-mv__wrap">
            {about.mission && (
              <RevealOnScroll delay={0.1}>
                <div className="ab-mv__card">
                  <div className="ab-mv__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                  </div>
                  <h3 className="ab-mv__title">Misyonumuz</h3>
                  <p className="ab-mv__desc">{about.mission}</p>
                </div>
              </RevealOnScroll>
            )}
            {about.vision && (
              <RevealOnScroll delay={0.2}>
                <div className="ab-mv__card">
                  <div className="ab-mv__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  </div>
                  <h3 className="ab-mv__title">Vizyonumuz</h3>
                  <p className="ab-mv__desc">{about.vision}</p>
                </div>
              </RevealOnScroll>
            )}
          </div>
        </section>
      )}

      {/* Values */}
      {about.values_list.length > 0 && (
        <section className="ab-values" aria-label="Değerlerimiz">
          <div className="ab-values__wrap">
            <RevealOnScroll>
              <div className="ab-values__head">
                <span className="ab-label">Değerlerimiz</span>
                <h2 className="ab-heading">Bizi Farklı Kılan Yaklaşım</h2>
              </div>
            </RevealOnScroll>
            <div className="ab-values__grid">
              {about.values_list.map((val, i) => (
                <RevealOnScroll key={val.title} delay={0.08 * (i + 1)}>
                  <div className="ab-vcard">
                    <span className="ab-vcard__num">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="ab-vcard__title">{val.title}</h3>
                    <p className="ab-vcard__desc">{val.description}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {about.milestones.length > 0 && (
        <section className="ab-timeline" aria-label="Kilometre Taşları">
          <div className="ab-timeline__wrap">
            <RevealOnScroll>
              <div className="ab-timeline__head">
                <span className="ab-label">Yolculuğumuz</span>
                <h2 className="ab-heading">Kilometre Taşları</h2>
              </div>
            </RevealOnScroll>
            <div className="ab-timeline__list">
              {about.milestones.map((m, i) => (
                <RevealOnScroll key={m.year + m.title} delay={0.1 * (i + 1)}>
                  <div className="ab-tl">
                    <div className="ab-tl__marker">
                      <span className="ab-tl__year">{m.year}</span>
                      {i < about.milestones.length - 1 && <span className="ab-tl__line" />}
                    </div>
                    <div className="ab-tl__content">
                      <h3 className="ab-tl__title">{m.title}</h3>
                      <p className="ab-tl__desc">{m.description}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      {about.certifications.length > 0 && (
        <section className="ab-certs" aria-label="Sertifikalar">
          <div className="ab-certs__wrap">
            <RevealOnScroll>
              <div className="ab-certs__head">
                <span className="ab-label">Kalite Güvencesi</span>
                <h2 className="ab-heading">Sertifikalarımız</h2>
              </div>
            </RevealOnScroll>
            <div className="ab-certs__grid">
              {about.certifications.map((cert, i) => (
                <RevealOnScroll key={cert.name} delay={0.1 * (i + 1)}>
                  <div className="ab-cert">
                    <div className="ab-cert__badge">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 15l-2 5 2-1 2 1-2-5z" /><circle cx="12" cy="9" r="6" /></svg>
                    </div>
                    <h3 className="ab-cert__name">{cert.name}</h3>
                    <p className="ab-cert__desc">{cert.description}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="ab-cta" aria-label="İletişim">
        <div className="ab-cta__glow" aria-hidden="true" />
        <RevealOnScroll>
          <div className="ab-cta__inner">
            <span className="ab-label">İş Birliği</span>
            <h2 className="ab-cta__title">Birlikte Çalışalım</h2>
            <p className="ab-cta__desc">Projeleriniz için bize ulaşın. Uzman ekibimiz size özel çözümler sunacaktır.</p>
            <div className="ab-cta__btns">
              <Link href="/iletisim" className="ab-btn ab-btn--primary">
                İletişime Geçin
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <Link href="/hizmetler" className="ab-btn ab-btn--outline">Hizmetlerimiz</Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <style>{`
        .ab-label{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--color-accent);margin-bottom:.5rem}
        .ab-heading{font-family:var(--font-display);font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;color:var(--color-text);margin:0 0 .75rem;letter-spacing:-.02em;line-height:1.15}
        .ab-text{font-size:.95rem;color:var(--color-text-muted);line-height:1.75}

        /* HERO */
        .ab-hero{position:relative;min-height:75vh;display:flex;align-items:flex-end;overflow:hidden}
        .ab-hero__bg-wrap{position:absolute;inset:0;overflow:hidden}
        .ab-hero__bg-img{object-fit:cover;animation:abBgZoom 12s ease-out forwards}
        @keyframes abBgZoom{from{transform:scale(1.08)}to{transform:scale(1)}}
        .ab-hero__overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,12,18,.35) 0%,rgba(8,12,18,.25) 30%,rgba(8,12,18,.65) 65%,rgba(8,12,18,.97) 100%)}
        .ab-hero__content{position:relative;z-index:2;padding:0 3rem 4.5rem;max-width:800px;animation:fadeInUp .8s .1s var(--ease) both}
        .ab-hero__breadcrumb{display:flex;align-items:center;gap:.45rem;font-size:.78rem;color:var(--color-text-dim);margin-bottom:1.5rem}
        .ab-hero__breadcrumb a{color:var(--color-text-muted);transition:color .2s}.ab-hero__breadcrumb a:hover{color:var(--color-accent)}
        .ab-hero__label{display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent);padding:.32rem .9rem;border:1px solid rgba(201,162,39,.3);border-radius:999px;background:rgba(201,162,39,.08);backdrop-filter:blur(8px);margin-bottom:1.25rem}
        .ab-hero__title{font-family:var(--font-display);font-size:clamp(2.2rem,5.5vw,4rem);font-weight:700;line-height:1.1;color:var(--color-text);letter-spacing:-.03em;margin:0 0 1rem}
        .ab-hero__subtitle{font-size:clamp(1rem,1.8vw,1.12rem);color:var(--color-text-muted);line-height:1.7;max-width:600px;margin:0}
        .ab-hero__scroll{position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:2}
        .ab-hero__scroll-line{display:block;width:1px;height:44px;background:linear-gradient(to bottom,rgba(201,162,39,.6),transparent);animation:scrollBounce 2.2s ease-in-out infinite}

        /* STATS */
        .ab-stats{background:var(--color-bg-elevated);border-top:1px solid rgba(201,162,39,.1);border-bottom:1px solid rgba(201,162,39,.1);padding:3rem 2rem}
        .ab-stats__inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(6,1fr);gap:2rem;text-align:center}
        .ab-stat__value{display:block;font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2.2rem);font-weight:700;background:var(--grad-accent);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:.3rem}
        .ab-stat__label{font-size:.78rem;color:var(--color-text-muted);letter-spacing:.05em;font-weight:500}

        /* ABOUT / COMPANY */
        .ab-about{padding:var(--space-2xl) var(--space-lg);background:var(--color-bg)}
        .ab-about__wrap{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
        .ab-about__badge{display:inline-block;padding:.5rem 1rem;background:rgba(201,162,39,.08);border:1px solid rgba(201,162,39,.3);border-radius:var(--radius);margin-bottom:1rem;text-align:center}
        .ab-about__badge-year{display:block;font-family:var(--font-display);font-size:1.5rem;font-weight:700;color:var(--color-accent);line-height:1}
        .ab-about__badge-text{font-size:.68rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--color-text-muted)}
        .ab-about__img-wrap{border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-lg);border:1px solid rgba(201,162,39,.15)}
        .ab-about__img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;display:block;transition:transform .8s var(--ease)}
        .ab-about__img-wrap:hover .ab-about__img{transform:scale(1.04)}
        .ab-cta-btn{display:inline-flex;align-items:center;gap:.5rem;margin-top:2rem;padding:.75rem 1.75rem;border-radius:var(--radius-pill);background:var(--color-accent);color:var(--color-bg);font-size:.9rem;font-weight:600;transition:background .2s,transform .2s,box-shadow .2s}
        .ab-cta-btn:hover{background:var(--color-accent-lt);transform:translateY(-2px);box-shadow:0 8px 32px rgba(201,162,39,.3)}
        .ab-cta-btn svg{transition:transform .3s var(--ease)}.ab-cta-btn:hover svg{transform:translateX(4px)}

        /* MISSION & VISION */
        .ab-mv{padding:var(--space-2xl) var(--space-lg);background:var(--color-bg-elevated)}
        .ab-mv__wrap{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:2rem}
        .ab-mv__card{padding:2.5rem;background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);transition:border-color .3s,transform .4s var(--ease)}
        .ab-mv__card:hover{border-color:rgba(201,162,39,.25);transform:translateY(-4px)}
        .ab-mv__icon{width:56px;height:56px;border-radius:50%;background:rgba(201,162,39,.1);border:1px solid rgba(201,162,39,.25);color:var(--color-accent);display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem}
        .ab-mv__title{font-family:var(--font-display);font-size:1.25rem;font-weight:700;color:var(--color-text);margin:0 0 .75rem}
        .ab-mv__desc{font-size:.9rem;color:var(--color-text-muted);line-height:1.75;margin:0}

        /* VALUES */
        .ab-values{padding:var(--space-2xl) var(--space-lg);background:var(--color-bg)}
        .ab-values__wrap{max-width:1200px;margin:0 auto}
        .ab-values__head{text-align:center;margin-bottom:3.5rem}
        .ab-values__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
        .ab-vcard{padding:2rem 1.75rem;background:var(--color-bg-elevated);border:1px solid var(--color-border);border-radius:var(--radius-lg);transition:border-color .3s,transform .4s var(--ease),box-shadow .4s}
        .ab-vcard:hover{border-color:rgba(201,162,39,.2);transform:translateY(-5px);box-shadow:0 16px 48px rgba(0,0,0,.35)}
        .ab-vcard__num{font-family:var(--font-display);font-size:.85rem;font-weight:700;color:var(--color-accent);width:36px;height:36px;border-radius:50%;background:rgba(201,162,39,.1);border:1px solid rgba(201,162,39,.25);display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem}
        .ab-vcard__title{font-family:var(--font-display);font-size:1.05rem;font-weight:700;color:var(--color-text);margin:0 0 .5rem}
        .ab-vcard__desc{font-size:.85rem;color:var(--color-text-muted);line-height:1.7;margin:0}

        /* TIMELINE */
        .ab-timeline{padding:var(--space-2xl) var(--space-lg);background:var(--color-bg-elevated)}
        .ab-timeline__wrap{max-width:700px;margin:0 auto}
        .ab-timeline__head{text-align:center;margin-bottom:3rem}
        .ab-timeline__list{display:flex;flex-direction:column}
        .ab-tl{display:flex;gap:1.5rem}
        .ab-tl__marker{display:flex;flex-direction:column;align-items:center;flex-shrink:0}
        .ab-tl__year{width:64px;height:36px;border-radius:999px;background:rgba(201,162,39,.1);border:2px solid rgba(201,162,39,.3);color:var(--color-accent);font-family:var(--font-display);font-size:.82rem;font-weight:700;display:flex;align-items:center;justify-content:center;transition:background .3s,box-shadow .3s}
        .ab-tl:hover .ab-tl__year{background:rgba(201,162,39,.2);box-shadow:0 0 18px rgba(201,162,39,.2)}
        .ab-tl__line{display:block;width:2px;flex:1;min-height:28px;background:linear-gradient(to bottom,rgba(201,162,39,.3),rgba(201,162,39,.05))}
        .ab-tl__content{padding-bottom:2.5rem}
        .ab-tl__title{font-family:var(--font-display);font-size:1.05rem;font-weight:700;color:var(--color-text);margin:.35rem 0 .3rem}
        .ab-tl__desc{font-size:.85rem;color:var(--color-text-muted);line-height:1.7;margin:0}

        /* CERTIFICATIONS */
        .ab-certs{padding:var(--space-2xl) var(--space-lg);background:var(--color-bg)}
        .ab-certs__wrap{max-width:1100px;margin:0 auto}
        .ab-certs__head{text-align:center;margin-bottom:3rem}
        .ab-certs__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem}
        .ab-cert{padding:2rem 1.5rem;background:var(--color-bg-elevated);border:1px solid var(--color-border);border-radius:var(--radius-lg);text-align:center;transition:border-color .3s,transform .4s var(--ease)}
        .ab-cert:hover{border-color:rgba(201,162,39,.25);transform:translateY(-4px)}
        .ab-cert__badge{width:52px;height:52px;border-radius:50%;background:rgba(201,162,39,.1);border:1px solid rgba(201,162,39,.25);color:var(--color-accent);display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem}
        .ab-cert__name{font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--color-accent);margin:0 0 .5rem}
        .ab-cert__desc{font-size:.82rem;color:var(--color-text-muted);line-height:1.65;margin:0}

        /* CTA */
        .ab-cta{position:relative;padding:7rem 2rem;background:var(--color-bg);text-align:center;overflow:hidden}
        .ab-cta__glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:350px;background:radial-gradient(ellipse,rgba(201,162,39,.1) 0%,transparent 70%);pointer-events:none}
        .ab-cta__inner{position:relative;max-width:600px;margin:0 auto}
        .ab-cta__title{font-family:var(--font-display);font-size:clamp(1.9rem,4vw,3rem);font-weight:700;margin:.5rem 0 1rem;color:var(--color-text);letter-spacing:-.02em;line-height:1.15}
        .ab-cta__desc{color:var(--color-text-muted);margin:0 0 2.5rem;line-height:1.7;font-size:1.05rem}
        .ab-cta__btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
        .ab-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.75rem;border-radius:var(--radius-pill);font-size:.9rem;font-weight:600;transition:all .25s var(--ease)}
        .ab-btn--primary{background:var(--color-accent);color:var(--color-bg)}
        .ab-btn--primary:hover{background:var(--color-accent-lt);transform:translateY(-2px);box-shadow:0 8px 32px rgba(201,162,39,.3)}
        .ab-btn--outline{background:transparent;color:var(--color-text-muted);border:1px solid var(--color-border)}
        .ab-btn--outline:hover{border-color:rgba(255,255,255,.15);color:var(--color-text);transform:translateY(-2px)}

        /* RESPONSIVE */
        @media(max-width:1024px){.ab-stats__inner{grid-template-columns:repeat(3,1fr)}.ab-certs__grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:900px){.ab-about__wrap{grid-template-columns:1fr;gap:3rem}.ab-mv__wrap{grid-template-columns:1fr}.ab-values__grid{grid-template-columns:1fr 1fr}}
        @media(max-width:768px){.ab-hero{min-height:65vh}.ab-hero__content{padding:0 1.5rem 3.5rem}.ab-hero__scroll{display:none}.ab-stats__inner{grid-template-columns:repeat(2,1fr)}.ab-values__grid{grid-template-columns:1fr}}
        @media(max-width:550px){.ab-about{padding:var(--space-xl) var(--space-md)}.ab-mv{padding:var(--space-xl) var(--space-md)}.ab-values{padding:var(--space-xl) var(--space-md)}.ab-timeline{padding:var(--space-xl) var(--space-md)}.ab-certs{padding:var(--space-xl) var(--space-md)}.ab-certs__grid{grid-template-columns:1fr}}
      `}</style>
    </>
  );
}
