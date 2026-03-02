"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=90",
    tag: "Uçak Mühendisliği",
    title: "Mükemmellik",
    titleAccent: "Metalle Buluşuyor",
    subtitle:
      "6 yılı aşkın deneyim. Savunma, havacılık ve ağır sanayide sınır tanımayan hassasiyet. Alüminyum ve metallerle geleceği inşa ediyoruz.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=90",
    tag: "Metal İşleme",
    title: "Hassasiyette",
    titleAccent: "Sınır Yok",
    subtitle:
      "ISO 9001, 14001 ve 45001 uyumlu üretim. CNC tornalama, frezeleme ve yüzey işlemlerinde mikron toleranslarda güvenilir çözümler.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=90",
    tag: "Savunma Sanayii",
    title: "Güvenilir",
    titleAccent: "Çözüm Ortağı",
    subtitle:
      "Çelik, titanyum ve alüminyum alaşımlarında tasarımdan seri üretime kadar tam hizmet.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1920&q=90",
    tag: "Kalite Kontrol",
    title: "Her Projede",
    titleAccent: "%100 Kalite",
    subtitle:
      "CMM ölçüm, NDT testleri ve tam dokümantasyon ile uluslararası standartlarda üretim güvencesi.",
  },
];

const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD = 50;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState("next");
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const progressRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const touchStartRef = useRef({ x: 0, time: 0 });
  const touchDeltaRef = useRef(0);

  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  const goTo = useCallback(
    (idx: number, dir = "next") => {
      if (transitioning) return;
      setTransitioning(true);
      setDirection(dir);
      setPrev(current);
      setCurrent(idx);
      setProgress(0);
      setContentKey((k) => k + 1);
      startTimeRef.current = performance.now();
      setTimeout(() => {
        setPrev(null);
        setTransitioning(false);
      }, 800);
    },
    [current, transitioning]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % SLIDES.length, "next");
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, "prev");
  }, [current, goTo]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(goNext, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, paused, goNext]);

  useEffect(() => {
    if (paused) {
      setProgress(0);
      return;
    }
    startTimeRef.current = performance.now();
    const step = () => {
      const elapsed = performance.now() - startTimeRef.current;
      setProgress(Math.min((elapsed / AUTOPLAY_MS) * 100, 100));
      progressRef.current = requestAnimationFrame(step);
    };
    progressRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current, paused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartRef.current = { x: e.touches[0].clientX, time: Date.now() };
      touchDeltaRef.current = 0;
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      touchDeltaRef.current = e.touches[0].clientX - touchStartRef.current.x;
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    const delta = touchDeltaRef.current;
    const elapsed = Date.now() - touchStartRef.current.time;
    const velocity = Math.abs(delta) / elapsed;
    if (Math.abs(delta) > SWIPE_THRESHOLD || velocity > 0.5) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchDeltaRef.current = 0;
  }, [goNext, goPrev]);

  const slide = SLIDES[current];
  const prevSlide = prev !== null ? SLIDES[prev] : null;

  return (
    <section
      className="hs"
      aria-label="Ana sayfa slayt gösterisi"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hs__viewport">
        {prevSlide && (
          <div
            className={`hs__slide hs__slide--exit hs__slide--exit-${direction}`}
          >
            <div
              className="hs__bg"
              style={{ backgroundImage: `url(${prevSlide.image})` }}
            />
            <div className="hs__overlay" />
          </div>
        )}

        <div
          className={`hs__slide hs__slide--active ${prev !== null ? `hs__slide--enter-${direction}` : ""}`}
        >
          <div
            className="hs__bg hs__bg--zoom"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="hs__overlay" />

          <div className="hs__particles" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <span key={i} className={`hs__particle hs__particle--${i + 1}`} />
            ))}
          </div>

          <div className="hs__content" key={contentKey}>
            <span className="hs__tag">{slide.tag}</span>
            <h1 className="hs__title">
              <span className="hs__title-line">{slide.title}</span>
              <span className="hs__title-line hs__title-line--gold">
                {slide.titleAccent}
              </span>
            </h1>
            <p className="hs__subtitle">{slide.subtitle}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="hs__arrow hs__arrow--prev"
        aria-label="Önceki slayt"
        onClick={goPrev}
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
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        className="hs__arrow hs__arrow--next"
        aria-label="Sonraki slayt"
        onClick={goNext}
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
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="hs__progress-bar">
        <div className="hs__progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <style>{`
        .hs {
          position: relative;
          height: 100vh;
          height: 100dvh;
          min-height: 600px;
          overflow: hidden;
          background: var(--color-bg);
          user-select: none;
        }
        .hs__viewport {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .hs__slide {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hs__slide--active { z-index: 2; }
        .hs__slide--enter-next { animation: hsEnterNext 0.8s var(--ease) forwards; }
        .hs__slide--enter-prev { animation: hsEnterPrev 0.8s var(--ease) forwards; }
        .hs__slide--exit { z-index: 1; }
        .hs__slide--exit-next { animation: hsExitNext 0.8s var(--ease) forwards; }
        .hs__slide--exit-prev { animation: hsExitPrev 0.8s var(--ease) forwards; }

        @keyframes hsEnterNext {
          from { clip-path: inset(0 0 0 100%); }
          to   { clip-path: inset(0 0 0 0); }
        }
        @keyframes hsEnterPrev {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0 0 0); }
        }
        @keyframes hsExitNext {
          from { opacity: 1; }
          to   { opacity: 0.4; }
        }
        @keyframes hsExitPrev {
          from { opacity: 1; }
          to   { opacity: 0.4; }
        }

        .hs__bg {
          position: absolute;
          inset: -4%;
          background-size: cover;
          background-position: center;
          will-change: transform;
        }
        .hs__bg--zoom {
          animation: hsBgZoom 10s ease-out forwards;
        }
        @keyframes hsBgZoom {
          from { transform: scale(1.12); }
          to   { transform: scale(1); }
        }

        .hs__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg,
            rgba(8,12,18,0.4) 0%,
            rgba(8,12,18,0.3) 30%,
            rgba(8,12,18,0.55) 70%,
            rgba(8,12,18,0.8) 100%
          );
        }

        .hs__particles { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .hs__particle {
          position: absolute;
          border-radius: 50%;
          background: var(--color-accent);
          opacity: 0;
          animation: hsParticle 6s ease-in-out infinite;
        }
        .hs__particle--1 { top: 15%; left: 10%; width: 4px; height: 4px; animation-delay: 0s; }
        .hs__particle--2 { top: 70%; left: 80%; width: 6px; height: 6px; animation-delay: 1.2s; }
        .hs__particle--3 { top: 35%; left: 90%; width: 3px; height: 3px; animation-delay: 0.6s; }
        .hs__particle--4 { top: 82%; left: 15%; width: 4px; height: 4px; animation-delay: 2s; }
        .hs__particle--5 { top: 22%; left: 55%; width: 3px; height: 3px; animation-delay: 2.8s; }
        .hs__particle--6 { top: 55%; left: 42%; width: 2px; height: 2px; animation-delay: 3.5s; }

        @keyframes hsParticle {
          0%   { opacity: 0; transform: translateY(0) scale(0.6); }
          20%  { opacity: 0.7; }
          50%  { opacity: 0.4; transform: translateY(-25px) scale(1.1); }
          80%  { opacity: 0.6; }
          100% { opacity: 0; transform: translateY(-50px) scale(0.6); }
        }

        .hs__content {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 880px;
          margin: 0 auto;
          padding: 2rem 2.5rem 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hs__tag {
          display: inline-flex;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-accent);
          padding: 0.38rem 1.1rem;
          border: 1px solid rgba(201,162,39,0.3);
          border-radius: 999px;
          background: rgba(201,162,39,0.08);
          backdrop-filter: blur(8px);
          margin-bottom: 1.6rem;
          animation: hsContentIn 0.7s 0.15s var(--ease) both;
        }

        .hs__title {
          margin: 0 0 1.4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.05em;
          max-width: 840px;
        }
        .hs__title-line {
          font-family: var(--font-display);
          font-size: clamp(2.8rem, 8.5vw, 6.5rem);
          font-weight: 700;
          line-height: 1.08;
          color: var(--color-text);
          letter-spacing: -0.025em;
          display: block;
          animation: hsContentIn 0.8s 0.25s var(--ease) both;
        }
        .hs__title-line--gold {
          background: var(--grad-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-style: italic;
          animation-delay: 0.38s;
        }

        .hs__subtitle {
          font-size: clamp(0.95rem, 1.6vw, 1.12rem);
          color: var(--color-text-muted);
          line-height: 1.8;
          max-width: 520px;
          margin: 0 0 2.5rem;
          animation: hsContentIn 0.8s 0.48s var(--ease) both;
        }

        @keyframes hsContentIn {
          from { opacity: 0; transform: translateY(32px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .hs__progress-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: rgba(255,255,255,0.06);
          z-index: 11;
        }
        .hs__progress-fill {
          height: 100%;
          background: var(--grad-accent);
          border-radius: 0 999px 999px 0;
          transition: width 0.05s linear;
        }

        .hs__arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 50px; height: 50px;
          border-radius: 50%;
          background: rgba(8,12,18,0.45);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--color-text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.35s, background 0.3s, border-color 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        .hs:hover .hs__arrow { opacity: 1; }
        .hs__arrow--prev { left: 1.5rem; }
        .hs__arrow--next { right: 1.5rem; }
        .hs__arrow:hover {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: var(--color-bg);
          box-shadow: 0 0 24px rgba(201,162,39,0.4);
        }

        @media (max-width: 768px) {
          .hs__content { padding: 2rem 1.5rem 0; }
          .hs__arrow { width: 42px; height: 42px; opacity: 1; }
          .hs__arrow--prev { left: 0.6rem; }
          .hs__arrow--next { right: 0.6rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hs__slide--enter-next,
          .hs__slide--enter-prev,
          .hs__slide--exit-next,
          .hs__slide--exit-prev { animation-duration: 0.01ms; }
          .hs__bg--zoom { animation: none; }
          .hs__particle { animation: none; }
          .hs__tag, .hs__title-line, .hs__subtitle { animation-duration: 0.01ms; }
        }
      `}</style>
    </section>
  );
}
