"use client";

import { useState, useEffect, useRef } from "react";

const STATS = [
  { value: 6, suffix: "+", label: "Yıl Deneyim" },
  { value: 200, suffix: "+", label: "Tamamlanan Proje" },
  { value: 50, suffix: "+", label: "Mutlu Müşteri" },
  { value: 100, suffix: "%", label: "Kalite Odaklı" },
];

function useCounter(target: number, isVisible: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(Math.floor(start));
      if (start >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [isVisible, target, duration]);
  return count;
}

function AnimatedStat({
  stat,
  visible,
}: {
  stat: (typeof STATS)[0];
  visible: boolean;
}) {
  const count = useCounter(stat.value, visible);
  return (
    <div className="hs-stat">
      <span className="hs-stat__value">
        {count}
        {stat.suffix}
      </span>
      <span className="hs-stat__label">{stat.label}</span>
    </div>
  );
}

export default function StatsSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="hh-stats" ref={ref} aria-label="İstatistikler">
      <div className="hh-stats__inner">
        {STATS.map((stat) => (
          <AnimatedStat key={stat.label} stat={stat} visible={visible} />
        ))}
      </div>

      <style>{`
        .hh-stats {
          background: var(--color-bg-elevated);
          border-top: 1px solid rgba(201,162,39,0.12);
          border-bottom: 1px solid rgba(201,162,39,0.12);
          padding: 3.5rem 2rem;
        }
        .hh-stats__inner {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          text-align: center;
        }
        .hs-stat { display: flex; flex-direction: column; gap: 0.35rem; }
        .hs-stat__value {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1;
          background: var(--grad-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hs-stat__label {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
        }
        @media (max-width: 768px) {
          .hh-stats__inner { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
