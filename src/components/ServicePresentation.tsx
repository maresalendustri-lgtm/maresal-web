"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/types/service";

interface Slide {
  type: "title" | "overview" | "image" | "features" | "process" | "specs" | "closing";
  image?: { url: string; alt: string };
  idx?: number;
}

function buildSlides(svc: Service): Slide[] {
  return [
    { type: "title" },
    { type: "overview" },
    ...svc.gallery.map((img, i) => ({ type: "image" as const, image: img, idx: i })),
    ...(svc.features.length > 0 ? [{ type: "features" as const }] : []),
    ...(svc.process.length > 0 ? [{ type: "process" as const }] : []),
    ...(svc.specs.length > 0 ? [{ type: "specs" as const }] : []),
    { type: "closing" },
  ];
}

export default function ServicePresentation({ service }: { service: Service }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const slides = buildSlides(service);
  const total = slides.length;

  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef(0);

  const goTo = useCallback(
    (idx: number, direction?: number) => {
      if (transitioning || idx < 0 || idx >= total) return;
      setDir(direction ?? (idx > current ? 1 : -1));
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(idx);
        setTimeout(() => setTransitioning(false), 50);
      }, 400);
    },
    [current, total, transitioning]
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3500);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      if (e.key === "Home") { e.preventDefault(); goTo(0, -1); }
      if (e.key === "End") { e.preventDefault(); goTo(total - 1, 1); }
      if (e.key === "Escape") router.push(`/hizmetler/${service.slug}`);
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, total, service.slug, router, toggleFullscreen]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const onMove = () => resetControlsTimer();
    window.addEventListener("mousemove", onMove);
    resetControlsTimer();
    return () => { window.removeEventListener("mousemove", onMove); if (controlsTimer.current) clearTimeout(controlsTimer.current); };
  }, [resetControlsTimer]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 60) diff > 0 ? prev() : next();
  };

  const slide = slides[current];
  const progress = ((current + 1) / total) * 100;

  return (
    <div ref={containerRef} className="sp" onMouseMove={resetControlsTimer} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Progress */}
      <div className={`sp-progress ${showControls ? "" : "sp-progress--hidden"}`}>
        <div className="sp-progress__bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Top bar */}
      <header className={`sp-topbar ${showControls ? "" : "sp-topbar--hidden"}`}>
        <div className="sp-topbar__left">
          <span className="sp-topbar__logo">MARESAL</span>
          <span className="sp-topbar__divider" />
          <span className="sp-topbar__service">{service.title}</span>
        </div>
        <div className="sp-topbar__right">
          <span className="sp-topbar__counter">{String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <button className="sp-topbar__btn" onClick={toggleFullscreen} aria-label="Tam ekran" title="Tam ekran (F)">
            {isFullscreen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 4 20 10 20" /><polyline points="20 10 20 4 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
            )}
          </button>
          <button className="sp-topbar__btn sp-topbar__btn--exit" onClick={() => router.push(`/hizmetler/${service.slug}`)} aria-label="Çıkış" title="Çıkış (Esc)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      </header>

      {/* Stage */}
      <div className={`sp-stage ${transitioning ? (dir > 0 ? "sp-stage--exit-left" : "sp-stage--exit-right") : "sp-stage--enter"}`}>
        {slide.type === "title" && (
          <div className="sp-slide sp-title">
            {service.hero_image && <div className="sp-title__bg" style={{ backgroundImage: `url(${service.hero_image})` }} />}
            <div className="sp-title__overlay" />
            <div className="sp-title__content">
              <span className="sp-title__tag">{service.tag}</span>
              <h1 className="sp-title__heading">{service.title}</h1>
              <p className="sp-title__desc">{service.description}</p>
              <div className="sp-title__meta">
                <span>MARESAL Havacılık &amp; Metal</span>
                <span className="sp-title__dot" />
                <span>Yatırımcı Sunumu</span>
              </div>
            </div>
          </div>
        )}

        {slide.type === "overview" && (
          <div className="sp-slide sp-overview">
            <div className="sp-overview__left">
              <span className="sp-overview__label">Genel Bakış</span>
              <h2 className="sp-overview__title">{service.title}</h2>
              <p className="sp-overview__desc">{service.detail_description || service.description}</p>
            </div>
            <div className="sp-overview__right">
              {service.specs.map((s) => (
                <div className="sp-overview__stat" key={s.label}>
                  <span className="sp-overview__stat-val">{s.value}</span>
                  <span className="sp-overview__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.type === "image" && slide.image && (
          <div className="sp-slide sp-image">
            <div className="sp-image__bg" style={{ backgroundImage: `url(${slide.image.url})` }} />
            <div className="sp-image__overlay" />
            <div className="sp-image__caption">
              <span className="sp-image__num">{String((slide.idx ?? 0) + 1).padStart(2, "0")}</span>
              <h2 className="sp-image__title">{slide.image.alt}</h2>
              <div className="sp-image__tag">{service.tag}</div>
            </div>
          </div>
        )}

        {slide.type === "features" && (
          <div className="sp-slide sp-feats">
            <div className="sp-feats__head">
              <span className="sp-feats__label">Özellikler &amp; Yetenekler</span>
              <h2 className="sp-feats__title">Neler Sunuyoruz?</h2>
            </div>
            <div className="sp-feats__grid">
              {service.features.map((f, i) => (
                <div className="sp-feats__item" key={f} style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                  <span className="sp-feats__item-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="sp-feats__item-text">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.type === "process" && (
          <div className="sp-slide sp-proc">
            <div className="sp-proc__head">
              <span className="sp-proc__label">Üretim Süreci</span>
              <h2 className="sp-proc__title">Nasıl Çalışıyoruz?</h2>
            </div>
            <div className="sp-proc__steps">
              {service.process.map((step, i) => (
                <div className="sp-proc__step" key={step.title} style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
                  <div className="sp-proc__step-num">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="sp-proc__step-title">{step.title}</h3>
                  <p className="sp-proc__step-desc">{step.desc}</p>
                  {i < service.process.length - 1 && (
                    <div className="sp-proc__connector" aria-hidden="true">
                      <svg width="32" height="16" viewBox="0 0 32 16"><path d="M0 8h28m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.type === "specs" && (
          <div className="sp-slide sp-specs">
            <div className="sp-specs__left">
              <span className="sp-specs__label">Teknik Veriler</span>
              <h2 className="sp-specs__title">Teknik Spesifikasyonlar</h2>
              <p className="sp-specs__desc">Uluslararası standartlara uygun, sertifikalı üretim süreçleri ile en yüksek kalite güvencesini sağlıyoruz.</p>
            </div>
            <div className="sp-specs__grid">
              {service.specs.map((s, i) => (
                <div className="sp-specs__card" key={s.label} style={{ animationDelay: `${0.5 + i * 0.12}s` }}>
                  <span className="sp-specs__card-val">{s.value}</span>
                  <span className="sp-specs__card-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.type === "closing" && (
          <div className="sp-slide sp-close">
            <div className="sp-close__glow" aria-hidden="true" />
            <div className="sp-close__content">
              <span className="sp-close__logo">MARESAL</span>
              <h2 className="sp-close__title">İş Birliğine Hazırız</h2>
              <p className="sp-close__desc">Teknik gereksinimlerinizi paylaşın — uzman ekibimiz size özel çözüm sunacaktır.</p>
              <div className="sp-close__info">
                <span>info@maresal.com.tr</span>
                <span className="sp-close__dot" />
                <span>+90 312 000 00 00</span>
                <span className="sp-close__dot" />
                <span>maresal.com.tr</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav arrows */}
      <div className={`sp-nav ${showControls ? "" : "sp-nav--hidden"}`}>
        <button className="sp-nav__btn sp-nav__btn--prev" onClick={prev} disabled={current === 0} aria-label="Önceki">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button className="sp-nav__btn sp-nav__btn--next" onClick={next} disabled={current === total - 1} aria-label="Sonraki">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Dots */}
      <div className={`sp-dots ${showControls ? "" : "sp-dots--hidden"}`}>
        {slides.map((_, i) => (
          <button key={i} className={`sp-dots__dot ${i === current ? "sp-dots__dot--active" : ""} ${i < current ? "sp-dots__dot--done" : ""}`} onClick={() => goTo(i, i > current ? 1 : -1)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      {/* Keyboard hints */}
      <div className={`sp-hints ${showControls ? "" : "sp-hints--hidden"}`}>
        <span><kbd>←</kbd><kbd>→</kbd> gezin</span>
        <span><kbd>F</kbd> tam ekran</span>
        <span><kbd>Esc</kbd> çıkış</span>
      </div>

      <style>{`
        .sp{position:fixed;inset:0;z-index:9999;background:#060a10;font-family:'Inter',system-ui,sans-serif;color:#edf0f5;overflow:hidden;cursor:default;user-select:none;--accent:#c9a227;--accent-lt:#e0c04a;--text:#edf0f5;--text-muted:#8a97a8;--text-dim:#4e5c6b;--ease:cubic-bezier(.22,1,.36,1)}
        .sp-progress{position:absolute;top:0;left:0;right:0;z-index:20;height:3px;background:rgba(255,255,255,.06);transition:opacity .5s}.sp-progress--hidden{opacity:0}.sp-progress__bar{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-lt));transition:width .5s var(--ease);box-shadow:0 0 12px rgba(201,162,39,.4)}
        .sp-topbar{position:absolute;top:0;left:0;right:0;z-index:15;display:flex;justify-content:space-between;align-items:center;padding:1.25rem 2rem;transition:opacity .5s,transform .5s var(--ease)}.sp-topbar--hidden{opacity:0;transform:translateY(-10px);pointer-events:none}.sp-topbar__left{display:flex;align-items:center;gap:.75rem}.sp-topbar__logo{font-family:var(--font-display);font-size:1rem;font-weight:700;letter-spacing:.2em;color:var(--accent)}.sp-topbar__divider{width:1px;height:16px;background:rgba(255,255,255,.15)}.sp-topbar__service{font-size:.8rem;font-weight:500;color:var(--text-muted);letter-spacing:.04em}.sp-topbar__right{display:flex;align-items:center;gap:.75rem}.sp-topbar__counter{font-size:.78rem;font-weight:600;color:var(--text-muted);letter-spacing:.12em;font-variant-numeric:tabular-nums}.sp-topbar__btn{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--text-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s,border-color .25s}.sp-topbar__btn:hover{background:rgba(201,162,39,.15);color:var(--accent);border-color:rgba(201,162,39,.3)}.sp-topbar__btn--exit:hover{background:rgba(255,60,60,.15);color:#ff6b6b;border-color:rgba(255,60,60,.3)}
        .sp-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}.sp-stage--enter{animation:spSlideIn .55s var(--ease) both}.sp-stage--exit-left{animation:spSlideOutLeft .4s var(--ease) both}.sp-stage--exit-right{animation:spSlideOutRight .4s var(--ease) both}
        @keyframes spSlideIn{from{opacity:0;transform:scale(.97) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}@keyframes spSlideOutLeft{to{opacity:0;transform:translateX(-40px) scale(.98)}}@keyframes spSlideOutRight{to{opacity:0;transform:translateX(40px) scale(.98)}}@keyframes spFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}@keyframes spKenBurns{from{transform:scale(1)}to{transform:scale(1.06)}}
        .sp-slide{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
        .sp-title__bg{position:absolute;inset:0;background-size:cover;background-position:center;animation:spKenBurns 12s ease-in-out infinite alternate}.sp-title__overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(6,10,16,.85) 0%,rgba(6,10,16,.5) 40%,rgba(6,10,16,.4) 60%,rgba(6,10,16,.8) 100%)}.sp-title__content{position:relative;z-index:2;text-align:center;max-width:800px;padding:2rem;animation:spFadeUp .8s .2s var(--ease) both}.sp-title__tag{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);padding:.35rem 1.1rem;border:1px solid rgba(201,162,39,.35);background:rgba(201,162,39,.08);backdrop-filter:blur(10px);border-radius:999px;margin-bottom:1.75rem}.sp-title__heading{font-family:var(--font-display);font-size:clamp(3rem,7vw,5.5rem);font-weight:700;line-height:1.05;letter-spacing:-.03em;margin:0 0 1.25rem;background:linear-gradient(135deg,#edf0f5 0%,#c9a227 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.sp-title__desc{font-size:clamp(1rem,2vw,1.25rem);color:var(--text-muted);line-height:1.7;max-width:580px;margin:0 auto 2.5rem}.sp-title__meta{display:flex;align-items:center;justify-content:center;gap:.75rem;font-size:.78rem;color:var(--text-dim);letter-spacing:.06em}.sp-title__dot{width:4px;height:4px;border-radius:50%;background:var(--accent);opacity:.6}
        .sp-overview{display:flex;gap:6rem;padding:3rem 6rem;align-items:center;max-width:1300px;margin:0 auto}.sp-overview__left{flex:1.2;animation:spFadeUp .7s .15s var(--ease) both}.sp-overview__label{display:inline-block;font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:.75rem}.sp-overview__title{font-family:var(--font-display);font-size:clamp(2rem,4vw,3.2rem);font-weight:700;line-height:1.15;letter-spacing:-.02em;margin:0 0 1.5rem}.sp-overview__desc{font-size:1.05rem;color:var(--text-muted);line-height:1.85;margin:0}.sp-overview__right{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;animation:spFadeUp .7s .35s var(--ease) both}.sp-overview__stat{padding:1.75rem 1.5rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;text-align:center;transition:border-color .3s,transform .3s var(--ease)}.sp-overview__stat:hover{border-color:rgba(201,162,39,.3);transform:translateY(-4px)}.sp-overview__stat-val{display:block;font-family:var(--font-display);font-size:1.6rem;font-weight:700;color:var(--accent);margin-bottom:.25rem;letter-spacing:-.02em}.sp-overview__stat-label{font-size:.72rem;font-weight:600;color:var(--text-dim);text-transform:uppercase;letter-spacing:.12em}
        .sp-image__bg{position:absolute;inset:0;background-size:cover;background-position:center;animation:spKenBurns 14s ease-in-out infinite alternate}.sp-image__overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,10,16,.2) 0%,rgba(6,10,16,0) 30%,rgba(6,10,16,.1) 60%,rgba(6,10,16,.85) 100%)}.sp-image__caption{position:absolute;bottom:5rem;left:4rem;z-index:2;animation:spFadeUp .7s .3s var(--ease) both}.sp-image__num{font-family:var(--font-display);font-size:4rem;font-weight:700;color:rgba(201,162,39,.15);line-height:1;display:block;margin-bottom:-.5rem}.sp-image__title{font-family:var(--font-display);font-size:clamp(1.5rem,3.5vw,2.8rem);font-weight:700;margin:0 0 .5rem;letter-spacing:-.02em}.sp-image__tag{display:inline-block;font-size:.65rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);padding:.25rem .8rem;border:1px solid rgba(201,162,39,.3);background:rgba(201,162,39,.08);border-radius:999px}
        .sp-feats{flex-direction:column;gap:3rem;padding:3rem 6rem;max-width:1100px}.sp-feats__head{text-align:center;animation:spFadeUp .6s .1s var(--ease) both}.sp-feats__label{display:block;font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:.5rem}.sp-feats__title{font-family:var(--font-display);font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:700;margin:0;letter-spacing:-.02em}.sp-feats__grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;width:100%}.sp-feats__item{display:flex;align-items:center;gap:1rem;padding:1.25rem 1.5rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;animation:spFadeUp .6s var(--ease) both;transition:border-color .3s,transform .3s var(--ease)}.sp-feats__item:hover{border-color:rgba(201,162,39,.25);transform:translateY(-3px)}.sp-feats__item-num{font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--accent);width:42px;height:42px;border-radius:50%;background:rgba(201,162,39,.1);border:1px solid rgba(201,162,39,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0}.sp-feats__item-text{font-size:.95rem;color:var(--text-muted);line-height:1.5}
        .sp-proc{flex-direction:column;gap:3.5rem;padding:3rem 4rem;max-width:1200px}.sp-proc__head{text-align:center;animation:spFadeUp .6s .1s var(--ease) both}.sp-proc__label{display:block;font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:.5rem}.sp-proc__title{font-family:var(--font-display);font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:700;margin:0;letter-spacing:-.02em}.sp-proc__steps{display:flex;align-items:flex-start;gap:0;justify-content:center}.sp-proc__step{flex:1;text-align:center;position:relative;padding:0 1.5rem;animation:spFadeUp .6s var(--ease) both}.sp-proc__step-num{width:56px;height:56px;border-radius:50%;background:rgba(201,162,39,.1);border:2px solid rgba(201,162,39,.35);color:var(--accent);font-family:var(--font-display);font-size:1.1rem;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem}.sp-proc__step-title{font-family:var(--font-display);font-size:1.1rem;font-weight:700;margin:0 0 .4rem;color:var(--text)}.sp-proc__step-desc{font-size:.85rem;color:var(--text-muted);line-height:1.6;margin:0}.sp-proc__connector{position:absolute;top:28px;right:-16px;color:rgba(201,162,39,.3)}
        .sp-specs{display:flex;gap:5rem;padding:3rem 6rem;align-items:center;max-width:1200px}.sp-specs__left{flex:1;animation:spFadeUp .7s .15s var(--ease) both}.sp-specs__label{display:block;font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:.75rem}.sp-specs__title{font-family:var(--font-display);font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:700;line-height:1.15;margin:0 0 1rem;letter-spacing:-.02em}.sp-specs__desc{font-size:.95rem;color:var(--text-muted);line-height:1.75;margin:0}.sp-specs__grid{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}.sp-specs__card{padding:2rem 1.5rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:18px;text-align:center;animation:spFadeUp .6s var(--ease) both;transition:border-color .3s,transform .3s var(--ease),box-shadow .3s}.sp-specs__card:hover{border-color:rgba(201,162,39,.35);transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.3)}.sp-specs__card-val{display:block;font-family:var(--font-display);font-size:1.8rem;font-weight:700;color:var(--accent);margin-bottom:.35rem;letter-spacing:-.02em}.sp-specs__card-label{font-size:.72rem;font-weight:600;color:var(--text-dim);text-transform:uppercase;letter-spacing:.12em}
        .sp-close{text-align:center;background:radial-gradient(ellipse at center,rgba(201,162,39,.06) 0%,transparent 65%)}.sp-close__glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:400px;background:radial-gradient(ellipse,rgba(201,162,39,.1) 0%,transparent 70%)}.sp-close__content{position:relative;z-index:2;animation:spFadeUp .8s .2s var(--ease) both}.sp-close__logo{display:block;font-family:var(--font-display);font-size:1.1rem;font-weight:700;letter-spacing:.3em;color:var(--accent);margin-bottom:2rem}.sp-close__title{font-family:var(--font-display);font-size:clamp(2.5rem,5.5vw,4.5rem);font-weight:700;margin:0 0 1rem;letter-spacing:-.03em;background:linear-gradient(135deg,#edf0f5 0%,#c9a227 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.sp-close__desc{font-size:1.15rem;color:var(--text-muted);line-height:1.7;max-width:500px;margin:0 auto 2.5rem}.sp-close__info{display:flex;align-items:center;justify-content:center;gap:.8rem;font-size:.88rem;color:var(--text-dim)}.sp-close__dot{width:4px;height:4px;border-radius:50%;background:var(--accent);opacity:.5}
        .sp-nav{position:absolute;top:50%;left:0;right:0;display:flex;justify-content:space-between;padding:0 1.5rem;z-index:15;transform:translateY(-50%);transition:opacity .5s}.sp-nav--hidden{opacity:0;pointer-events:none}.sp-nav__btn{width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s var(--ease);backdrop-filter:blur(10px)}.sp-nav__btn:hover:not(:disabled){background:var(--accent);color:#060a10;border-color:var(--accent);box-shadow:0 0 28px rgba(201,162,39,.4);transform:scale(1.08)}.sp-nav__btn:disabled{opacity:.2;cursor:default}
        .sp-dots{position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:15;display:flex;gap:6px;transition:opacity .5s}.sp-dots--hidden{opacity:0}.sp-dots__dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.15);border:none;padding:0;cursor:pointer;transition:all .35s var(--ease)}.sp-dots__dot--active{width:28px;border-radius:4px;background:var(--accent);box-shadow:0 0 10px rgba(201,162,39,.4)}.sp-dots__dot--done{background:rgba(201,162,39,.35)}.sp-dots__dot:hover:not(.sp-dots__dot--active){background:rgba(255,255,255,.3);transform:scale(1.3)}
        .sp-hints{position:absolute;bottom:1.5rem;right:2rem;z-index:15;display:flex;gap:1rem;font-size:.68rem;color:var(--text-dim);transition:opacity .5s}.sp-hints--hidden{opacity:0}.sp-hints span{display:flex;align-items:center;gap:.3rem}.sp-hints kbd{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 4px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:4px;font-size:.62rem;font-family:inherit;color:var(--text-muted)}
        @media(max-width:1024px){.sp-overview{flex-direction:column;gap:3rem;padding:2rem 3rem}.sp-specs{flex-direction:column;gap:2.5rem;padding:2rem 3rem}.sp-feats{padding:2rem 3rem}.sp-proc{padding:2rem 2rem}.sp-proc__step{padding:0 .75rem}}
        @media(max-width:768px){.sp-topbar{padding:1rem 1.25rem}.sp-topbar__service,.sp-topbar__divider{display:none}.sp-title__heading{font-size:clamp(2rem,8vw,3.5rem)}.sp-overview{padding:2rem 1.5rem}.sp-overview__right{grid-template-columns:1fr 1fr}.sp-feats{padding:2rem 1.5rem}.sp-feats__grid{grid-template-columns:1fr}.sp-specs{padding:2rem 1.5rem}.sp-specs__grid{grid-template-columns:1fr 1fr}.sp-proc__steps{flex-wrap:wrap}.sp-proc__step{flex:0 0 45%;margin-bottom:2rem}.sp-proc__connector{display:none}.sp-image__caption{left:2rem;bottom:4rem}.sp-image__num{font-size:2.5rem}.sp-nav{padding:0 .75rem}.sp-nav__btn{width:42px;height:42px}.sp-hints{display:none}}
        @media(max-width:500px){.sp-overview__right{grid-template-columns:1fr}.sp-proc__step{flex:0 0 100%}.sp-close__info{flex-direction:column;gap:.25rem}.sp-close__dot{display:none}}
      `}</style>
    </div>
  );
}
