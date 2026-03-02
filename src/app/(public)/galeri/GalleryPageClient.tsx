"use client";

import { useState, useCallback, useEffect } from "react";
import type { GalleryImage } from "@/lib/gallery";

type GalleryPageClientProps = {
  images: GalleryImage[];
  categories: readonly string[];
};

export default function GalleryPageClient({ images, categories }: GalleryPageClientProps) {
  const [active, setActive] = useState("Tümü");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    active === "Tümü" ? images : images.filter((img) => img.cat === active);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null && i <= 0 ? images.length - 1 : (i ?? 0) - 1
      ),
    [images.length]
  );
  const goNext = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null && i >= images.length - 1 ? 0 : (i ?? 0) + 1
      ),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
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
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  return (
    <>
      <section className="gp-gal" aria-label="Galeri">
        <div className="gp-gal__head">
          <span className="gp-gal__label">Galeri</span>
          <h2 className="gp-gal__title">Projelerimizden Kareler</h2>
          <p className="gp-gal__lead">
            Havacılık, metal işleme ve kalite kontrol süreçlerimizden seçme görüntüler. CNC üretim ve referans projelerimiz.
          </p>
        </div>

        {/* Filters */}
        <div className="gp-gal__filters" role="tablist" aria-label="Galeri filtresi">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active === cat}
              className={`gp-gal__filter ${active === cat ? "gp-gal__filter--active" : ""}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="gp-gal__meta">
          <span className="gp-gal__count">{filtered.length} görüntü</span>
        </div>

        {/* Grid */}
        <div className="gp-gal__grid">
          {filtered.map((img, i) => {
            const globalIdx = images.indexOf(img);
            return (
              <button
                type="button"
                key={`${img.alt}-${i}`}
                className="gp-gal__item"
                onClick={() => openLightbox(globalIdx)}
                aria-label={`${img.alt} – Büyüt`}
              >
                <img
                  src={img.url.replace("1200", "800")}
                  alt={img.alt}
                  loading="lazy"
                  className="gp-gal__img"
                />
                <div className="gp-gal__overlay">
                  <span className="gp-gal__badge">{img.cat}</span>
                  <p className="gp-gal__title">{img.alt}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="gp-lb" onClick={closeLightbox}>
          <div className="gp-lb__inner" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt}
              className="gp-lb__img"
            />
            <button
              type="button"
              className="gp-lb__close"
              onClick={closeLightbox}
              aria-label="Kapat"
            >
              ✕
            </button>
            <button
              type="button"
              className="gp-lb__arrow gp-lb__arrow--prev"
              onClick={goPrev}
              aria-label="Önceki"
            >
              ‹
            </button>
            <button
              type="button"
              className="gp-lb__arrow gp-lb__arrow--next"
              onClick={goNext}
              aria-label="Sonraki"
            >
              ›
            </button>
          </div>
        </div>
      )}

      <style>{`
        .gp-gal{padding:var(--space-2xl) var(--space-lg);background:var(--color-bg-elevated)}
        .gp-gal__head{text-align:center;margin-bottom:2.5rem}
        .gp-gal__label{display:inline-block;font-size:.72rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent);padding:.3rem .9rem;border:1px solid var(--color-accent-dim);border-radius:999px;background:var(--color-accent-dim);margin-bottom:1rem}
        .gp-gal__title{font-family:var(--font-display);font-size:clamp(2rem,4vw,3rem);font-weight:700;color:var(--color-text);margin:0 0 .75rem}
        .gp-gal__lead{font-size:1.05rem;color:var(--color-text-muted);max-width:520px;margin:0 auto;line-height:1.7}
        .gp-gal__filters{display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-bottom:1.5rem}
        .gp-gal__filter{padding:.55rem 1.15rem;background:var(--color-surface);border:1px solid var(--color-border);color:var(--color-text-muted);font-size:.82rem;font-weight:500;border-radius:999px;cursor:pointer;transition:all .3s}
        .gp-gal__filter:hover{color:var(--color-accent);border-color:rgba(201,162,39,.3);background:rgba(201,162,39,.06)}
        .gp-gal__filter--active{background:var(--color-accent);color:var(--color-bg);border-color:var(--color-accent);font-weight:700}
        .gp-gal__meta{margin-bottom:1.5rem;text-align:center}
        .gp-gal__count{font-size:.82rem;color:var(--color-text-dim)}
        .gp-gal__grid{max-width:1360px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem}
        .gp-gal__item{position:relative;border:none;padding:0;border-radius:var(--radius-lg);overflow:hidden;cursor:pointer;background:var(--color-surface);aspect-ratio:4/3}
        .gp-gal__img{width:100%;height:100%;object-fit:cover;transition:transform .5s,filter .5s;filter:brightness(.9)}
        .gp-gal__item:hover .gp-gal__img{transform:scale(1.05);filter:brightness(1)}
        .gp-gal__overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(8,12,18,.85) 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.4rem;opacity:0;transition:opacity .4s}
        .gp-gal__item:hover .gp-gal__overlay{opacity:1}
        .gp-gal__badge{display:inline-block;width:fit-content;font-size:.65rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--color-accent);background:rgba(201,162,39,.12);border:1px solid rgba(201,162,39,.3);padding:.2rem .65rem;border-radius:999px;margin-bottom:.5rem}
        .gp-gal__title{font-size:.92rem;font-weight:500;color:var(--color-text);margin:0;line-height:1.35}
        @media(max-width:600px){.gp-gal__grid{grid-template-columns:1fr 1fr;gap:.85rem}}

        .gp-lb{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.92);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;animation:fadeIn .3s ease forwards}
        .gp-lb__inner{position:relative;max-width:90vw;max-height:90vh}
        .gp-lb__img{max-width:90vw;max-height:85vh;object-fit:contain;border-radius:var(--radius-lg)}
        .gp-lb__close{position:absolute;top:-2.5rem;right:0;background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;opacity:.7;transition:opacity .2s}
        .gp-lb__close:hover{opacity:1}
        .gp-lb__arrow{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:50%;width:48px;height:48px;color:white;font-size:1.5rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
        .gp-lb__arrow:hover{background:rgba(201,162,39,.3)}
        .gp-lb__arrow--prev{left:-4rem}
        .gp-lb__arrow--next{right:-4rem}
        @media(max-width:768px){.gp-lb__arrow--prev{left:.5rem}.gp-lb__arrow--next{right:.5rem}}
      `}</style>
    </>
  );
}
