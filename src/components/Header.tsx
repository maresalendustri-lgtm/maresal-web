"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS } from "@/lib/business";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: `/hizmetler/${BUSINESS.mainService.slug}`, label: BUSINESS.mainService.label },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const close = useCallback(() => setMobileOpen(false), []);
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/hizmetler/") && href !== "/hizmetler") {
      return pathname === href || pathname.startsWith(href + "/");
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className={`hdr ${scrolled ? "hdr--scrolled" : ""}`}>
        <div className="hdr__inner">
          <Link href="/" className="hdr__logo">
            <span className="hdr__logo-text">Maresal</span>
            <span className="hdr__logo-bar" />
          </Link>

          <nav className="hdr__nav">
            <ul className="hdr__links">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`hdr__link ${isActive(href) ? "hdr__link--active" : ""}`}
                  >
                    {label}
                    <span className="hdr__link-line" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/iletisim" className="hdr__cta">
            İletişim
          </Link>

          <button
            type="button"
            className="hdr__burger"
            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span
              style={
                mobileOpen
                  ? { transform: "rotate(45deg) translate(5px, 5px)" }
                  : {}
              }
            />
            <span style={mobileOpen ? { opacity: 0, width: 0 } : {}} />
            <span
              style={
                mobileOpen
                  ? { transform: "rotate(-45deg) translate(5px, -5px)" }
                  : {}
              }
            />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`hdr__overlay ${mobileOpen ? "hdr__overlay--visible" : ""}`}
        onClick={close}
      />

      {/* Mobile drawer */}
      <nav className={`hdr__drawer ${mobileOpen ? "hdr__drawer--open" : ""}`}>
        <div className="hdr__drawer-top">
          <Link href="/" className="hdr__logo" onClick={close}>
            <span className="hdr__logo-text">Maresal</span>
            <span className="hdr__logo-bar" />
          </Link>
          <button
            type="button"
            className="hdr__drawer-close"
            onClick={close}
            aria-label="Menüyü kapat"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ul className="hdr__drawer-links">
          {NAV_LINKS.map(({ href, label }, i) => (
            <li
              key={href}
              className="hdr__drawer-item"
              style={{
                transitionDelay: mobileOpen ? `${0.05 + i * 0.04}s` : "0s",
              }}
            >
              <Link
                href={href}
                className={`hdr__drawer-link ${isActive(href) ? "hdr__drawer-link--active" : ""}`}
                onClick={close}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hdr__drawer-footer">
          <Link href="/iletisim" className="hdr__drawer-cta" onClick={close}>
            İletişime Geçin
          </Link>
        </div>
      </nav>

      <style>{`
        .hdr {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 200;
          padding: 1.1rem 2.5rem;
          background: rgba(8,12,18,0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.4s var(--ease), padding 0.4s var(--ease), border-color 0.4s;
        }
        .hdr--scrolled {
          background: rgba(8,12,18,0.92);
          padding-top: 0.8rem;
          padding-bottom: 0.8rem;
          border-bottom-color: rgba(201,162,39,0.15);
          box-shadow: 0 4px 32px rgba(0,0,0,0.4);
        }
        .hdr__inner {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .hdr__logo {
          display: flex;
          flex-direction: column;
          gap: 3px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .hdr__logo-text {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--color-text);
          letter-spacing: 0.04em;
          line-height: 1;
          transition: color var(--transition-fast);
        }
        .hdr__logo:hover .hdr__logo-text { color: var(--color-accent); }
        .hdr__logo-bar {
          display: block;
          width: 2rem;
          height: 2px;
          background: var(--grad-accent);
          border-radius: 999px;
          transition: width var(--transition);
        }
        .hdr__logo:hover .hdr__logo-bar { width: 100%; }
        .hdr__nav { margin-left: auto; }
        .hdr__links {
          list-style: none;
          display: flex;
          gap: 0.25rem;
        }
        .hdr__link {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2px;
          color: var(--color-text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          text-decoration: none;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-sm);
          transition: color var(--transition-fast);
        }
        .hdr__link:hover,
        .hdr__link--active { color: var(--color-text); }
        .hdr__link-line {
          position: absolute;
          bottom: 0; left: 0.85rem; right: 0.85rem;
          height: 2px;
          background: var(--grad-accent);
          border-radius: 999px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--transition);
        }
        .hdr__link:hover .hdr__link-line,
        .hdr__link--active .hdr__link-line { transform: scaleX(1); }
        .hdr__cta {
          flex-shrink: 0;
          display: inline-block;
          padding: 0.55rem 1.4rem;
          background: var(--color-accent-dim);
          border: 1px solid var(--color-border-glow);
          color: var(--color-accent);
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: 999px;
          text-decoration: none;
          transition: background var(--transition-fast), color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        .hdr__cta:hover {
          background: var(--color-accent);
          color: var(--color-bg);
          transform: translateY(-2px);
          box-shadow: var(--shadow-glow);
        }
        .hdr__burger {
          display: none;
          position: relative;
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius);
          cursor: pointer;
          margin-left: auto;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
        }
        .hdr__burger span {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--color-text);
          border-radius: 999px;
          transition: transform 0.35s var(--ease), opacity 0.25s, width 0.25s;
        }
        .hdr__overlay {
          position: fixed;
          inset: 0;
          z-index: 199;
          background: rgba(4,7,12,0.7);
          backdrop-filter: blur(6px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s var(--ease);
        }
        .hdr__overlay--visible {
          opacity: 1;
          pointer-events: auto;
        }
        .hdr__drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(340px, 85vw);
          background: var(--color-bg-elevated);
          border-left: 1px solid rgba(201,162,39,0.1);
          z-index: 210;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.4s var(--ease);
          overflow-y: auto;
        }
        .hdr__drawer--open {
          transform: translateX(0);
          box-shadow: -16px 0 48px rgba(0,0,0,0.5);
        }
        .hdr__drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .hdr__drawer-close {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--color-text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
        }
        .hdr__drawer-close:hover {
          background: rgba(201,162,39,0.15);
          color: var(--color-accent);
        }
        .hdr__drawer-links {
          display: flex;
          flex-direction: column;
          padding: 0.75rem 1rem;
          gap: 0.25rem;
          flex: 1;
        }
        .hdr__drawer-item {
          opacity: 0;
          transform: translateX(20px);
          transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
        }
        .hdr__drawer--open .hdr__drawer-item {
          opacity: 1;
          transform: translateX(0);
        }
        .hdr__drawer-link {
          display: block;
          padding: 0.85rem 1rem;
          color: var(--color-text-muted);
          font-size: 0.98rem;
          font-weight: 500;
          border-radius: var(--radius);
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
        }
        .hdr__drawer-link--active {
          color: var(--color-accent);
          background: rgba(201,162,39,0.06);
        }
        .hdr__drawer-link:hover { color: var(--color-text); }
        .hdr__drawer-footer {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .hdr__drawer-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.9rem 1.5rem;
          background: var(--grad-accent);
          color: #080c12;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 999px;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .hdr__drawer-cta:active { transform: scale(0.97); }
        @media (max-width: 900px) {
          .hdr { padding: 0.9rem 1.25rem; }
          .hdr--scrolled { padding-top: 0.7rem; padding-bottom: 0.7rem; }
          .hdr__nav, .hdr__cta { display: none; }
          .hdr__burger { display: flex; }
        }
      `}</style>
    </>
  );
}
