"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import type { ServiceGalleryItem, ServiceSpec } from "@/types/service";

export default function ServiceGallery({
  gallery,
  specs,
  description,
}: {
  gallery: ServiceGalleryItem[];
  specs: ServiceSpec[];
  description: string | null;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleViewerMove = useCallback(
    (e: React.MouseEvent) => {
      const el = viewerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    },
    []
  );

  const handleThumbClick = useCallback((i: number) => setActiveImg(i), []);

  const prev = () =>
    setActiveImg((v) => (v - 1 + gallery.length) % gallery.length);
  const next = () => setActiveImg((v) => (v + 1) % gallery.length);

  if (gallery.length === 0) return null;

  const current = gallery[activeImg] || gallery[0];

  return (
    <>
      <div className="sdg-body">
        <div className="sdg-viewer" ref={viewerRef} onMouseMove={handleViewerMove} onMouseLeave={() => setMousePos({ x: 0.5, y: 0.5 })}>
          <div className="sdg-viewer__frame">
            <Image
              src={current.url}
              alt={current.alt}
              fill
              className="sdg-viewer__img"
              style={{
                transform: `scale(1.06) translate(${(mousePos.x - 0.5) * -12}px, ${(mousePos.y - 0.5) * -12}px)`,
              }}
              sizes="(max-width: 1024px) 100vw, 60vw"
              unoptimized
            />
            <div className="sdg-viewer__overlay">
              <span className="sdg-viewer__counter">
                {activeImg + 1} / {gallery.length}
              </span>
            </div>
            <button type="button" className="sdg-arrow sdg-arrow--prev" aria-label="Önceki" onClick={prev}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button type="button" className="sdg-arrow sdg-arrow--next" aria-label="Sonraki" onClick={next}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          <div className="sdg-thumbs" role="tablist">
            {gallery.map((img, i) => (
              <button
                key={img.url}
                type="button"
                role="tab"
                aria-selected={i === activeImg}
                aria-label={img.alt}
                className={`sdg-thumb ${i === activeImg ? "sdg-thumb--active" : ""}`}
                onClick={() => handleThumbClick(i)}
              >
                <Image src={img.url} alt={img.alt} width={80} height={56} className="sdg-thumb__img" unoptimized />
              </button>
            ))}
          </div>
        </div>

        <div className="sdg-info">
          <h3 className="sdg-info__title">{current.alt}</h3>
          {description && <p className="sdg-info__desc">{description}</p>}
          <div className="sdg-specs">
            {specs.map((spec) => (
              <div className="sdg-spec" key={spec.label}>
                <span className="sdg-spec__value">{spec.value}</span>
                <span className="sdg-spec__label">{spec.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .sdg-body {
          display: grid; grid-template-columns: 1fr 380px;
          gap: 2.5rem; align-items: start;
        }
        .sdg-viewer { display: flex; flex-direction: column; gap: 1rem; }
        .sdg-viewer__frame {
          position: relative; border-radius: var(--radius-lg);
          overflow: hidden; aspect-ratio: 16/10;
          background: var(--color-surface);
          border: 1px solid rgba(255,255,255,0.06);
          cursor: crosshair;
        }
        .sdg-viewer__img {
          object-fit: cover;
          transition: transform 0.1s linear;
          will-change: transform;
        }
        .sdg-viewer__overlay {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, transparent 70%, rgba(8,12,18,0.5) 100%);
        }
        .sdg-viewer__counter {
          position: absolute; bottom: 1rem; left: 1.25rem;
          font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.7);
          letter-spacing: 0.08em;
        }
        .sdg-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(8,12,18,0.5); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1); color: var(--color-text);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.3s, background 0.3s, transform 0.3s, box-shadow 0.3s;
          z-index: 3;
        }
        .sdg-viewer__frame:hover .sdg-arrow { opacity: 1; }
        .sdg-arrow--prev { left: 1rem; }
        .sdg-arrow--next { right: 1rem; }
        .sdg-arrow:hover {
          background: var(--color-accent); color: var(--color-bg);
          box-shadow: 0 0 20px rgba(201,162,39,0.4);
        }
        .sdg-arrow--prev:hover { transform: translateY(-50%) translateX(-2px); }
        .sdg-arrow--next:hover { transform: translateY(-50%) translateX(2px); }
        .sdg-thumbs {
          display: flex; gap: 0.6rem; overflow-x: auto; padding-bottom: 0.25rem;
          scrollbar-width: thin; scrollbar-color: var(--color-surface-2) transparent;
        }
        .sdg-thumb {
          flex-shrink: 0; width: 80px; height: 56px;
          border-radius: var(--radius-sm); overflow: hidden;
          border: 2px solid transparent; cursor: pointer;
          opacity: 0.5; background: none; padding: 0;
          transition: opacity 0.25s, border-color 0.25s, transform 0.25s;
        }
        .sdg-thumb:hover { opacity: 0.8; transform: translateY(-2px); }
        .sdg-thumb--active {
          opacity: 1; border-color: var(--color-accent);
          box-shadow: 0 0 12px rgba(201,162,39,0.3);
        }
        .sdg-thumb__img { width: 100%; height: 100%; object-fit: cover; }
        .sdg-info { position: sticky; top: 6rem; }
        .sdg-info__title {
          font-family: var(--font-display);
          font-size: 1.2rem; font-weight: 700; color: var(--color-text);
          margin: 0 0 0.75rem;
        }
        .sdg-info__desc {
          font-size: 0.9rem; color: var(--color-text-muted);
          line-height: 1.75; margin: 0 0 2rem;
        }
        .sdg-specs {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
        }
        .sdg-spec {
          padding: 1rem; background: var(--color-surface);
          border: 1px solid var(--color-border); border-radius: var(--radius);
          text-align: center; transition: border-color 0.3s, transform 0.3s;
        }
        .sdg-spec:hover { border-color: rgba(201,162,39,0.3); transform: translateY(-2px); }
        .sdg-spec__value {
          display: block; font-family: var(--font-display);
          font-size: 1.15rem; font-weight: 700;
          color: var(--color-accent); margin-bottom: 0.2rem;
        }
        .sdg-spec__label {
          font-size: 0.72rem; color: var(--color-text-dim);
          letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;
        }
        @media (max-width: 1024px) {
          .sdg-body { grid-template-columns: 1fr; }
          .sdg-info { position: static; }
          .sdg-specs { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 768px) {
          .sdg-specs { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 550px) {
          .sdg-thumb { width: 64px; height: 44px; }
        }
      `}</style>
    </>
  );
}
