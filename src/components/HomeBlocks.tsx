import Link from "next/link";

const BLOCKS = [
  {
    href: "/hakkimizda",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=85",
    label: "Hikayemiz",
    title: "Havacılıkta\nSınır Tanımıyoruz",
    desc: "2019'dan bu yana savunma, havacılık ve ağır sanayide 6 yılı aşkın deneyim. ISO 9001, 14001 ve 45001 sertifikalı entegre çözüm ortağınız.",
    cta: "Hakkımızda →",
    side: "left" as const,
  },
  {
    href: "/hizmetler",
    img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=85",
    label: "Uzmanlık",
    title: "Metal & Alüminyum\nİşleme",
    desc: "Alüminyum, çelik, titanyum. CNC tornalama, frezeleme, kalite kontrol ve tam dokümantasyon. Tek adreste tam çözüm.",
    cta: "Hizmetlere Git →",
    side: "right" as const,
  },
  {
    href: "/galeri",
    img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1920&q=85",
    label: "Çalışmalar",
    title: "Projelerimizden\nGörüntüler",
    desc: "Üretim tesislerimiz, CNC işleme ve tamamlanan havacılık projelerinden bir seçki.",
    cta: "Galeriyi Aç →",
    side: "left" as const,
  },
  {
    href: "/iletisim",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=85",
    label: "İletişim",
    title: "Projenizi\nKonuşalım",
    desc: "Teklif alın, teknik danışmanlık için formu doldurun veya doğrudan bize ulaşın. En kısa sürede yanıt veriyoruz.",
    cta: "İletişime Geç →",
    side: "right" as const,
  },
];

export default function HomeBlocks() {
  return (
    <>
      {BLOCKS.map(({ href, img, label, title, desc, cta, side }) => (
        <Link
          key={href}
          href={href}
          className={`hh-block hh-block--${side}`}
          aria-label={cta}
        >
          <div
            className="hh-block__bg"
            style={{ backgroundImage: `url(${img})` }}
          />
          <div className="hh-block__overlay" />
          <div className="hh-block__content">
            <span className="hh-block__label">{label}</span>
            <h2 className="hh-block__title">
              {title.split("\n").map((line, i) => (
                <span key={i} className="hh-block__title-line">
                  {line}
                </span>
              ))}
            </h2>
            <p className="hh-block__desc">{desc}</p>
            <span className="hh-block__cta">{cta}</span>
          </div>
        </Link>
      ))}

      <style>{`
        .hh-block {
          position: relative;
          display: block;
          min-height: 100vh;
          text-decoration: none;
          color: inherit;
          overflow: hidden;
        }
        .hh-block__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.9s var(--ease);
        }
        .hh-block:hover .hh-block__bg { transform: scale(1.05); }
        .hh-block__overlay {
          position: absolute;
          inset: 0;
          transition: background 0.5s;
        }
        .hh-block--left .hh-block__overlay {
          background: linear-gradient(105deg, rgba(8,12,18,0.88) 0%, rgba(8,12,18,0.40) 100%);
        }
        .hh-block--right .hh-block__overlay {
          background: linear-gradient(255deg, rgba(8,12,18,0.88) 0%, rgba(8,12,18,0.40) 100%);
        }
        .hh-block:hover .hh-block__overlay { filter: brightness(0.9); }
        .hh-block__content {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 6rem 3rem 4rem;
          max-width: 680px;
        }
        .hh-block--right .hh-block__content { margin-left: auto; }
        .hh-block__label {
          display: inline-block;
          width: fit-content;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-accent);
          padding: 0.3rem 0.9rem;
          border: 1px solid var(--color-accent-dim);
          border-radius: 999px;
          background: var(--color-accent-dim);
          margin-bottom: 0.75rem;
        }
        .hh-block__title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 700;
          line-height: 1.1;
          margin: 0.75rem 0 1rem;
          color: var(--color-text);
          letter-spacing: -0.02em;
          display: flex;
          flex-direction: column;
        }
        .hh-block__title-line { display: block; }
        .hh-block__desc {
          font-size: clamp(0.95rem, 2vw, 1.15rem);
          color: var(--color-text-muted);
          line-height: 1.75;
          margin: 0 0 1.5rem;
          max-width: 420px;
        }
        .hh-block__cta {
          display: inline-flex;
          color: var(--color-accent);
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.03em;
          transition: transform 0.3s var(--ease);
        }
        .hh-block:hover .hh-block__cta { transform: translateX(10px); }
        @media (max-width: 768px) {
          .hh-block--right .hh-block__content { margin-left: 0; }
          .hh-block__content { padding: 6rem 1.5rem 3rem; }
        }
      `}</style>
    </>
  );
}
