"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

type GalleryImage = { url: string; alt: string; cat: string };

const DEFAULT_HOME_GALLERY: GalleryImage[] = [
  { url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=90", alt: "Uçak kanadı detayı", cat: "Havacılık" },
  { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=90", alt: "Metal işleme atölyesi", cat: "Metal" },
  { url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=90", alt: "Alüminyum parça imalatı", cat: "Alüminyum" },
  { url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=90", alt: "CNC üretim", cat: "Metal" },
  { url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=90", alt: "Kalite kontrol", cat: "Kalite" },
  { url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=90", alt: "Havacılık bileşenleri", cat: "Havacılık" },
];

export default function HomeGallery({ images = DEFAULT_HOME_GALLERY }: { images?: GalleryImage[] }) {
  const gallery = images.length > 0 ? images : DEFAULT_HOME_GALLERY;
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const goPrev = useCallback(() => setLightbox((i) => (i !== null && i <= 0 ? gallery.length - 1 : (i ?? 0) - 1)), [gallery.length]);
  const goNext = useCallback(() => setLightbox((i) => (i !== null && i >= gallery.length - 1 ? 0 : (i ?? 0) + 1)), [gallery.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, closeLightbox, goPrev, goNext]);

  return (
    <>
      <section className="hg" ref={ref} aria-label="Galeri">
        <div className="hg__head">
          <span className={`hg__label ${visible ? "hg__label--in" : ""}`}>Galeri</span>
          <h2 className={`hg__title ${visible ? "hg__title--in" : ""}`}>
            Projelerimizden Kareler
          </h2>
          <p className={`hg__lead ${visible ? "hg__lead--in" : ""}`}>
            Havacılık, metal işleme ve kalite kontrol süreçlerimizden seçme görüntüler.
          </p>
        </div>

        <div className="hg__grid">
          {gallery.map((img, i) => (
            <button
              type="button"
              key={`${img.alt}-${i}`}
              className={`hg__item hg__item--${i + 1} ${visible ? "hg__item--in" : ""}`}
              style={{ animationDelay: visible ? `${0.1 + i * 0.08}s` : "0s" }}
              onClick={() => setLightbox(i)}
              aria-label={`${img.alt} – Büyüt`}
            >
              <img src={img.url.replace("1200", "800")} alt={img.alt} loading="lazy" className="hg__img" />
              <div className="hg__overlay">
                <span className="hg__cat">{img.cat}</span>
                <span className="hg__alt">{img.alt}</span>
              </div>
            </button>
          ))}
        </div>

        <div className={`hg__more ${visible ? "hg__more--in" : ""}`}>
          <Link href="/galeri" className="hg__more-btn">
            Tüm Galeriyi Gör →
          </Link>
        </div>
      </section>

      {lightbox !== null && (
        <div className="lb" onClick={closeLightbox}>
          <div className="lb__inner" onClick={(e) => e.stopPropagation()}>
            <img src={gallery[lightbox].url} alt={gallery[lightbox].alt} className="lb__img" />
            <button type="button" className="lb__close" onClick={closeLightbox} aria-label="Kapat">✕</button>
            <button type="button" className="lb__arrow lb__arrow--prev" onClick={goPrev} aria-label="Önceki">‹</button>
            <button type="button" className="lb__arrow lb__arrow--next" onClick={goNext} aria-label="Sonraki">›</button>
          </div>
        </div>
      )}

      <style>{`
        .hg {
          padding: var(--space-2xl) var(--space-lg);
          background: var(--color-bg);
          overflow: hidden;
        }
        .hg__head { text-align: center; margin-bottom: 3rem; }
        .hg__label {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-accent);
          padding: 0.3rem 0.9rem;
          border: 1px solid var(--color-accent-dim);
          border-radius: 999px;
          background: var(--color-accent-dim);
          margin-bottom: 1rem;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
        }
        .hg__label--in { opacity: 1; transform: translateY(0); }
        .hg__title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 0.75rem;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s 0.1s var(--ease), transform 0.7s 0.1s var(--ease);
        }
        .hg__title--in { opacity: 1; transform: translateY(0); }
        .hg__lead {
          font-size: 1.05rem;
          color: var(--color-text-muted);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s 0.2s var(--ease), transform 0.7s 0.2s var(--ease);
        }
        .hg__lead--in { opacity: 1; transform: translateY(0); }

        .hg__grid {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: 280px 280px;
          gap: 1rem;
        }
        .hg__item {
          position: relative;
          border: none;
          padding: 0;
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          background: var(--color-surface);
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
        }
        .hg__item--in {
          opacity: 1; transform: translateY(0);
          animation: hgFadeIn 0.6s var(--ease) both;
        }
        @keyframes hgFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hg__item--1 { grid-column: 1 / 5;  grid-row: 1 / 2; }
        .hg__item--2 { grid-column: 5 / 9;  grid-row: 1 / 2; }
        .hg__item--3 { grid-column: 9 / 13; grid-row: 1 / 2; }
        .hg__item--4 { grid-column: 1 / 5;  grid-row: 2 / 3; }
        .hg__item--5 { grid-column: 5 / 8;  grid-row: 2 / 3; }
        .hg__item--6 { grid-column: 8 / 13; grid-row: 2 / 3; }

        .hg__img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.7s var(--ease), filter 0.5s;
          filter: brightness(0.85);
        }
        .hg__item:hover .hg__img { transform: scale(1.08); filter: brightness(1); }

        .hg__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(8,12,18,0.85) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.4rem;
          opacity: 0;
          transition: opacity 0.4s var(--ease);
        }
        .hg__item:hover .hg__overlay { opacity: 1; }
        .hg__cat {
          display: inline-block;
          width: fit-content;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-accent);
          background: rgba(201,162,39,0.12);
          border: 1px solid rgba(201,162,39,0.3);
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
          margin-bottom: 0.5rem;
        }
        .hg__alt {
          font-size: 0.92rem;
          font-weight: 500;
          color: var(--color-text);
          line-height: 1.35;
        }

        .hg__more {
          text-align: center;
          margin-top: 2.5rem;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.7s 0.4s var(--ease), transform 0.7s 0.4s var(--ease);
        }
        .hg__more--in { opacity: 1; transform: translateY(0); }
        .hg__more-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.75rem;
          color: var(--color-text);
          font-weight: 600;
          font-size: 0.95rem;
          border: 1px solid var(--color-border);
          border-radius: 999px;
          text-decoration: none;
          transition: border-color 0.3s, color 0.3s, transform 0.3s;
        }
        .hg__more-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .hg__grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 220px);
          }
          .hg__item--1 { grid-column: 1 / 2; grid-row: 1 / 2; }
          .hg__item--2 { grid-column: 2 / 3; grid-row: 1 / 2; }
          .hg__item--3 { grid-column: 1 / 2; grid-row: 2 / 3; }
          .hg__item--4 { grid-column: 2 / 3; grid-row: 2 / 3; }
          .hg__item--5 { grid-column: 1 / 2; grid-row: 3 / 4; }
          .hg__item--6 { grid-column: 2 / 3; grid-row: 3 / 4; }
        }
        @media (max-width: 550px) {
          .hg { padding: var(--space-xl) var(--space-md); }
          .hg__grid { grid-template-columns: 1fr; grid-template-rows: repeat(6, 200px); }
          .hg__item--1,.hg__item--2,.hg__item--3,.hg__item--4,.hg__item--5,.hg__item--6 { grid-column: 1 / -1; grid-row: auto; }
          .hg__overlay { opacity: 1; }
        }

        /* Lightbox */
        .lb {
          position: fixed;
          inset: 0;
          z-index: 500;
          background: rgba(0,0,0,0.92);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease forwards;
        }
        .lb__inner {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }
        .lb__img {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          border-radius: var(--radius-lg);
        }
        .lb__close {
          position: absolute;
          top: -2.5rem; right: 0;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .lb__close:hover { opacity: 1; }
        .lb__arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          width: 48px; height: 48px;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .lb__arrow:hover { background: rgba(201,162,39,0.3); }
        .lb__arrow--prev { left: -4rem; }
        .lb__arrow--next { right: -4rem; }
        @media (max-width: 768px) {
          .lb__arrow--prev { left: 0.5rem; }
          .lb__arrow--next { right: 0.5rem; }
        }
      `}</style>
    </>
  );
}
