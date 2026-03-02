import Link from "next/link";
import { BUSINESS } from "@/lib/business";

const FOOTER_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: `/hizmetler/${BUSINESS.mainService.slug}`, label: BUSINESS.mainService.label },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <div className="ft__inner">
        <div className="ft__brand">
          <Link href="/" className="ft__logo">
            Maresal
          </Link>
          <div className="ft__logo-bar" />
          <p className="ft__tagline">Uçak Mühendisliği &amp; Metal İşleme</p>
          <p className="ft__desc">
            Havacılık ve savunma sanayiinde yüksek hassasiyetli imalat çözümleri
            sunan güvenilir ortağınız.
          </p>
        </div>

        <div className="ft__col">
          <h3 className="ft__col-title">Hızlı Erişim</h3>
          <ul className="ft__nav">
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="ft__nav-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="ft__col">
          <h3 className="ft__col-title">İletişim</h3>
          <ul className="ft__contact-list">
            <li>
              <span className="ft__contact-icon">✉</span>
              <a href={`mailto:${BUSINESS.email}`} className="ft__contact-link">
                {BUSINESS.email}
              </a>
            </li>
            <li>
              <span className="ft__contact-icon">✆</span>
              <a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`} className="ft__contact-link">
                {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li>
              <span className="ft__contact-icon">⌖</span>
              <span className="ft__contact-text">
                {BUSINESS.address.streetAddress
                  ? `${BUSINESS.address.streetAddress}, ${BUSINESS.address.addressLocality}`
                  : `${BUSINESS.address.addressLocality}, Türkiye`}
              </span>
            </li>
            {BUSINESS.googleMapsUrl && (
              <li>
                <span className="ft__contact-icon">📍</span>
                <a
                  href={BUSINESS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft__contact-link"
                >
                  Google&apos;da Görüntüle
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="ft__bottom">
        <p className="ft__copy">© {year} {BUSINESS.name}. Tüm hakları saklıdır.</p>
        <p className="ft__sub">ISO 9001, 14001 & 45001 Uyumlu Üretim</p>
      </div>

      <style>{`
        .ft {
          background: var(--color-bg);
          border-top: 1px solid rgba(201,162,39,0.12);
          padding: 5rem 2.5rem 0;
          position: relative;
          overflow: hidden;
        }
        .ft::before {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 40%;
          height: 1px;
          background: var(--grad-accent);
          opacity: 0.6;
        }
        .ft__inner {
          max-width: 1200px;
          margin: 0 auto 4rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 4rem;
        }
        .ft__logo {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--color-text);
          text-decoration: none;
          display: block;
          line-height: 1;
          transition: color var(--transition-fast);
        }
        .ft__logo:hover { color: var(--color-accent); }
        .ft__logo-bar {
          width: 2rem; height: 2px;
          background: var(--grad-accent);
          border-radius: 999px;
          margin: 0.6rem 0 1rem;
          transition: width var(--transition);
        }
        .ft__brand:hover .ft__logo-bar { width: 4rem; }
        .ft__tagline {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: 0.75rem;
        }
        .ft__desc {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          line-height: 1.7;
          max-width: 280px;
        }
        .ft__col-title {
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: 1.2rem;
        }
        .ft__nav { display: flex; flex-direction: column; gap: 0.5rem; }
        .ft__nav-link {
          color: var(--color-text-muted);
          font-size: 0.92rem;
          text-decoration: none;
          transition: color var(--transition-fast), padding-left var(--transition-fast);
          display: inline-block;
        }
        .ft__nav-link:hover { color: var(--color-accent); padding-left: 6px; }
        .ft__contact-list { display: flex; flex-direction: column; gap: 0.85rem; }
        .ft__contact-list li { display: flex; align-items: flex-start; gap: 0.6rem; }
        .ft__contact-icon {
          font-size: 0.85rem;
          color: var(--color-accent);
          flex-shrink: 0;
          margin-top: 2px;
          width: 16px;
          text-align: center;
        }
        .ft__contact-link, .ft__contact-text {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .ft__contact-link:hover { color: var(--color-accent); }
        .ft__bottom {
          max-width: 1200px;
          margin: 0 auto;
          border-top: 1px solid var(--color-border);
          padding: 1.5rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .ft__copy { font-size: 0.82rem; color: var(--color-text-dim); margin: 0; }
        .ft__sub {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-accent-dim);
          margin: 0;
          padding: 0.25rem 0.75rem;
          border: 1px solid var(--color-accent-dim);
          border-radius: 999px;
          filter: brightness(1.4);
        }
        @media (max-width: 900px) {
          .ft__inner { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
          .ft__brand { grid-column: span 2; }
        }
        @media (max-width: 580px) {
          .ft__inner { grid-template-columns: 1fr; }
          .ft__brand { grid-column: span 1; }
          .ft { padding: 3.5rem 1.5rem 0; }
        }
      `}</style>
    </footer>
  );
}
