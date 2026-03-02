"use client";

import { useState, useEffect, useRef } from "react";

import { BUSINESS } from "@/lib/business";
import { createMessage } from "@/lib/actions/messages";

const CONTACT_INFO = [
  { label: "E-posta", value: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
  { label: "Telefon", value: BUSINESS.phoneDisplay, href: `tel:${BUSINESS.phone.replace(/\s/g, "")}` },
  {
    label: "Adres",
    value: BUSINESS.address.streetAddress
      ? `${BUSINESS.address.streetAddress}, ${BUSINESS.address.addressLocality}`
      : `${BUSINESS.address.addressLocality}, Türkiye`,
    href: BUSINESS.googleMapsUrl || null,
  },
];

export default function HomeContact() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Ad Soyad gerekli";
    if (!form.email.trim()) e.email = "E-posta gerekli";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Geçerli bir e-posta girin";
    if (!form.message.trim()) e.message = "Mesaj gerekli";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim(),
      });
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    } catch {
      setErrors({ message: "Mesaj gönderilemedi. Lütfen tekrar deneyin." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <section className="hc" ref={ref} aria-label="İletişim">
      <div className="hc__bg" />
      <div className="hc__bg-overlay" />

      <div className="hc__inner">
        <div className={`hc__head ${visible ? "hc__head--in" : ""}`}>
          <span className="hc__label">İletişim</span>
          <h2 className="hc__title">Bizimle İletişime Geçin</h2>
          <p className="hc__lead">
            Projeleriniz için teklif alın veya teknik danışmanlık için formu doldurun.
          </p>
        </div>

        <div className="hc__body">
          <div className={`hc__left ${visible ? "hc__left--in" : ""}`}>
            <div className="hc__cards">
              {CONTACT_INFO.map(({ label, value, href }) => (
                <div className="hc__card" key={label}>
                  <div className="hc__card-body">
                    <span className="hc__card-label">{label}</span>
                    {href ? (
                      <a href={href} className="hc__card-value">{value}</a>
                    ) : (
                      <span className="hc__card-value">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="hc__map-wrap">
              <iframe
                title="Mareşal Konum"
                src={BUSINESS.googleMapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d385396.32114945484!2d28.731980049!3d41.00498225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2s%C4%B0stanbul!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"}
                className="hc__map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className={`hc__right ${visible ? "hc__right--in" : ""}`}>
            {submitted ? (
              <div className="hc__success">
                <h3 className="hc__success-title">Mesajınız Alındı!</h3>
                <p className="hc__success-desc">
                  En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz.
                </p>
                <button type="button" className="hc__success-btn" onClick={() => setSubmitted(false)}>
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form className="hc__form" onSubmit={handleSubmit} noValidate>
                <h3 className="hc__form-title">Hızlı İletişim</h3>

                <div className="hc__form-row">
                  <div className={`hc__field ${errors.name ? "hc__field--error" : ""}`}>
                    <label htmlFor="hc-name" className="hc__field-label">Ad Soyad *</label>
                    <input id="hc-name" type="text" value={form.name} onChange={handleChange("name")} placeholder="Adınız Soyadınız" className="hc__field-input" autoComplete="name" />
                    {errors.name && <span className="hc__field-error">{errors.name}</span>}
                  </div>
                  <div className={`hc__field ${errors.email ? "hc__field--error" : ""}`}>
                    <label htmlFor="hc-email" className="hc__field-label">E-posta *</label>
                    <input id="hc-email" type="email" value={form.email} onChange={handleChange("email")} placeholder="ornek@sirket.com" className="hc__field-input" autoComplete="email" />
                    {errors.email && <span className="hc__field-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="hc__field">
                  <label htmlFor="hc-phone" className="hc__field-label">Telefon (İsteğe Bağlı)</label>
                  <input id="hc-phone" type="tel" value={form.phone} onChange={handleChange("phone")} placeholder="+90 (___) ___ __ __" className="hc__field-input" autoComplete="tel" />
                </div>

                <div className={`hc__field ${errors.message ? "hc__field--error" : ""}`}>
                  <label htmlFor="hc-msg" className="hc__field-label">Mesaj *</label>
                  <textarea id="hc-msg" value={form.message} onChange={handleChange("message")} placeholder="Projeniz, teknik gereksinimleriniz veya sorularınız..." rows={5} className="hc__field-input hc__field-input--textarea" />
                  {errors.message && <span className="hc__field-error">{errors.message}</span>}
                </div>

                <button type="submit" className={`hc__submit ${loading ? "hc__submit--loading" : ""}`} disabled={loading}>
                  {loading ? "Gönderiliyor..." : "Mesaj Gönder"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .hc {
          position: relative;
          padding: var(--space-2xl) var(--space-lg);
          overflow: hidden;
        }
        .hc__bg {
          position: absolute; inset: 0;
          background-image: url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80');
          background-size: cover; background-position: center;
          filter: brightness(0.2) saturate(0.6);
        }
        .hc__bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(8,12,18,0.95) 0%, rgba(8,12,18,0.8) 50%, rgba(8,12,18,0.95) 100%);
        }
        .hc__inner { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; }
        .hc__head {
          text-align: center; margin-bottom: 3.5rem;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
        }
        .hc__head--in { opacity: 1; transform: translateY(0); }
        .hc__label {
          display: inline-block;
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--color-accent);
          padding: 0.3rem 0.9rem;
          border: 1px solid var(--color-accent-dim);
          border-radius: 999px; background: var(--color-accent-dim);
          margin-bottom: 1rem;
        }
        .hc__title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700; color: var(--color-text);
          margin: 0 0 0.75rem;
        }
        .hc__lead {
          font-size: 1.05rem; color: var(--color-text-muted);
          max-width: 480px; margin: 0 auto; line-height: 1.7;
        }
        .hc__body {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 3rem; align-items: start;
        }
        .hc__left {
          opacity: 0; transform: translateX(-28px);
          transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
        }
        .hc__left--in { opacity: 1; transform: translateX(0); }
        .hc__right {
          background: rgba(14,21,33,0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: var(--radius-lg);
          padding: 2.5rem;
          box-shadow: var(--shadow-lg);
          opacity: 0; transform: translateX(28px);
          transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
        }
        .hc__right--in { opacity: 1; transform: translateX(0); }

        .hc__cards { display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem; }
        .hc__card {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(19,28,42,0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--radius);
          transition: border-color 0.3s, transform 0.3s;
        }
        .hc__card:hover { border-color: rgba(201,162,39,0.35); transform: translateX(4px); }
        .hc__card-label {
          display: block; font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--color-text-dim); margin-bottom: 2px;
        }
        .hc__card-value { font-size: 0.92rem; color: var(--color-text); text-decoration: none; transition: color 0.2s; }
        a.hc__card-value:hover { color: var(--color-accent); }

        .hc__map-wrap {
          border-radius: var(--radius-lg); overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          aspect-ratio: 16 / 9; background: var(--color-surface);
        }
        .hc__map {
          width: 100%; height: 100%; border: 0; display: block;
          filter: brightness(0.8) contrast(1.1) saturate(0);
          transition: filter 0.5s;
        }
        .hc__map-wrap:hover .hc__map { filter: brightness(0.9) contrast(1.05) saturate(0.5); }

        .hc__form { display: flex; flex-direction: column; gap: 1.1rem; }
        .hc__form-title {
          font-family: var(--font-display); font-size: 1.35rem; font-weight: 700;
          color: var(--color-text); margin: 0 0 1.25rem;
          padding-bottom: 0.85rem; border-bottom: 1px solid var(--color-border);
        }
        .hc__form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .hc__field { display: flex; flex-direction: column; gap: 0.4rem; }
        .hc__field-label { font-size: 0.82rem; font-weight: 600; color: var(--color-text-muted); }
        .hc__field-input {
          padding: 0.8rem 1rem;
          background: rgba(8,12,18,0.6);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius);
          color: var(--color-text);
          font-family: var(--font-body);
          font-size: 0.95rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          resize: none;
        }
        .hc__field-input::placeholder { color: var(--color-text-dim); }
        .hc__field-input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(201,162,39,0.12);
        }
        .hc__field--error .hc__field-input { border-color: #e53e3e; }
        .hc__field-input--textarea { min-height: 120px; }
        .hc__field-error { font-size: 0.8rem; color: #fc8181; }

        .hc__submit {
          display: flex; align-items: center; justify-content: center;
          width: 100%; padding: 0.95rem;
          background: var(--grad-accent); background-size: 200% 200%;
          color: #080c12; font-family: var(--font-body);
          font-size: 1rem; font-weight: 700;
          border: none; border-radius: 999px;
          cursor: pointer; margin-top: 0.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .hc__submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201,162,39,0.4);
        }
        .hc__submit--loading { opacity: 0.8; cursor: not-allowed; }

        .hc__success { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 3rem 1.5rem; gap: 1rem; }
        .hc__success-title { font-family: var(--font-display); font-size: 1.5rem; color: var(--color-text); margin: 0; }
        .hc__success-desc { color: var(--color-text-muted); line-height: 1.65; margin: 0; max-width: 300px; }
        .hc__success-btn {
          padding: 0.7rem 1.75rem; background: transparent;
          border: 1.5px solid rgba(201,162,39,0.35);
          color: var(--color-accent); font-size: 0.9rem; font-weight: 600;
          border-radius: 999px; cursor: pointer; font-family: var(--font-body);
          transition: background 0.2s, color 0.2s;
        }
        .hc__success-btn:hover { background: var(--color-accent); color: var(--color-bg); }

        @media (max-width: 900px) {
          .hc__body { grid-template-columns: 1fr; gap: 2.5rem; }
          .hc__form-row { grid-template-columns: 1fr; }
          .hc { padding: var(--space-xl) var(--space-md); }
        }
        @media (max-width: 500px) {
          .hc__right { padding: 1.75rem 1.25rem; }
        }
      `}</style>
    </section>
  );
}
