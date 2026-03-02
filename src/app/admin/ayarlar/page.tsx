"use client";

import { useState } from "react";
import { BUSINESS } from "@/lib/business";
import { Settings, Mail, Phone, MapPin, Globe } from "lucide-react";

const TABS = [
  { key: "contact", label: "İletişim Bilgileri", icon: Mail },
  { key: "general", label: "Genel", icon: Settings },
  { key: "seo", label: "SEO", icon: Globe },
];

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("contact");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    email: BUSINESS.email,
    phone: BUSINESS.phone,
    phoneDisplay: BUSINESS.phoneDisplay,
    address: BUSINESS.address.streetAddress
      ? `${BUSINESS.address.streetAddress}, ${BUSINESS.address.addressLocality}`
      : `${BUSINESS.address.addressLocality}, Türkiye`,
    googleMapsUrl: BUSINESS.googleMapsUrl || "",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="ast">
      <div className="ast__header">
        <h2 className="ast__title">Ayarlar</h2>
        <p className="ast__subtitle">Site yapılandırma ve genel ayarlar</p>
      </div>

      <div className="ast__body">
        <div className="ast__tabs">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                className={`ast__tab ${tab === t.key ? "ast__tab--active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                <Icon size={18} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="ast__content">
          {tab === "contact" && (
            <div className="ast__section">
              <h3 className="ast__section-title">İletişim Bilgileri</h3>
              <p className="ast__section-desc">
                Bu bilgiler site genelinde (Footer, İletişim sayfası) kullanılır. Değişiklikler için{" "}
                <code className="ast__code">src/lib/business.ts</code> dosyasını güncelleyin.
              </p>
              <div className="ast__form">
                <label className="ast__field">
                  <span>E-posta</span>
                  <input type="email" value={form.email} readOnly className="ast__readonly" />
                </label>
                <label className="ast__field">
                  <span>Telefon</span>
                  <input type="tel" value={form.phoneDisplay} readOnly className="ast__readonly" />
                </label>
                <label className="ast__field">
                  <span>Adres</span>
                  <textarea rows={2} value={form.address} readOnly className="ast__readonly" />
                </label>
                <label className="ast__field">
                  <span>Google Maps Embed URL</span>
                  <input type="text" value={form.googleMapsUrl || "(boş)"} readOnly className="ast__readonly" placeholder="NEXT_PUBLIC_GOOGLE_MAPS_URL" />
                </label>
              </div>
            </div>
          )}

          {tab === "general" && (
            <div className="ast__section">
              <h3 className="ast__section-title">Genel Ayarlar</h3>
              <div className="ast__form">
                <label className="ast__field">
                  <span>Site Başlığı</span>
                  <input type="text" defaultValue="Mareşal Mühendislik" />
                </label>
                <label className="ast__field">
                  <span>Site Açıklaması</span>
                  <textarea rows={3} defaultValue="Savunma, havacılık ve ağır sanayide entegre mühendislik, alüminyum tedarik ve geri dönüşüm çözümleri." />
                </label>
              </div>
            </div>
          )}

          {tab === "seo" && (
            <div className="ast__section">
              <h3 className="ast__section-title">SEO Ayarları</h3>
              <div className="ast__form">
                <label className="ast__field">
                  <span>Meta Başlık</span>
                  <input type="text" defaultValue="Mareşal | Mühendislik, Alüminyum & Geri Dönüşüm" />
                </label>
                <label className="ast__field">
                  <span>Meta Açıklama</span>
                  <textarea rows={3} defaultValue="Mareşal; savunma, havacılık ve ağır sanayi sektörlerinde mühendislik çözümleri, sertifikalı alüminyum tedariki ve sürdürülebilir geri dönüşüm hizmetleri sunan entegre çözüm ortağı." />
                </label>
              </div>
            </div>
          )}

          <div className="ast__save-row">
            <button className={`ast__save-btn ${saved ? "ast__save-btn--saved" : ""}`} onClick={handleSave}>
              {saved ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Kaydedildi
                </>
              ) : (
                "Değişiklikleri Kaydet"
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .ast { max-width: 1100px; }
        .ast__header { margin-bottom: 1.5rem; }
        .ast__title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; }
        .ast__subtitle { font-size: 0.82rem; color: var(--color-text-dim); margin: 0; }
        .ast__body { display: grid; grid-template-columns: 220px 1fr; gap: 1.5rem; }
        .ast__tabs { display: flex; flex-direction: column; gap: 0.2rem; background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 0.6rem; align-self: start; position: sticky; top: 80px; }
        .ast__tab { display: flex; align-items: center; gap: 0.65rem; padding: 0.65rem 0.85rem; border-radius: var(--radius); background: none; border: none; color: var(--color-text-muted); font-size: 0.85rem; font-weight: 500; font-family: var(--font-body); cursor: pointer; transition: all 0.2s var(--ease); text-align: left; }
        .ast__tab:hover { color: var(--color-text); background: rgba(255,255,255,0.03); }
        .ast__tab--active { color: var(--color-accent) !important; background: rgba(201,162,39,0.08) !important; }
        .ast__content { background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.75rem; }
        .ast__section-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin: 0 0 0.5rem; }
        .ast__section-desc { font-size: 0.8rem; color: var(--color-text-dim); margin: 0 0 1.25rem; line-height: 1.6; }
        .ast__code { font-size: 0.75rem; color: var(--color-accent); background: rgba(201,162,39,0.1); padding: 0.1rem 0.4rem; border-radius: 4px; }
        .ast__form { display: flex; flex-direction: column; gap: 1.15rem; }
        .ast__field { display: flex; flex-direction: column; gap: 0.35rem; }
        .ast__field > span { font-size: 0.78rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
        .ast__field input, .ast__field textarea { padding: 0.65rem 0.85rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); font-size: 0.88rem; font-family: var(--font-body); outline: none; resize: vertical; transition: border-color 0.2s; }
        .ast__field input:focus, .ast__field textarea:focus { border-color: rgba(201,162,39,0.4); }
        .ast__readonly { opacity: 0.85; cursor: not-allowed; }
        .ast__save-row { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border); display: flex; justify-content: flex-end; }
        .ast__save-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.75rem; background: var(--color-accent); color: var(--color-bg); border: none; border-radius: var(--radius); font-weight: 600; font-size: 0.88rem; font-family: var(--font-body); cursor: pointer; transition: all 0.2s var(--ease); }
        .ast__save-btn:hover { background: var(--color-accent-lt); transform: translateY(-1px); }
        .ast__save-btn--saved { background: #22c55e; }
        @media (max-width: 768px) { .ast__body { grid-template-columns: 1fr; } .ast__tabs { flex-direction: row; overflow-x: auto; position: static; } .ast__tab { white-space: nowrap; } }
      `}</style>
    </div>
  );
}
