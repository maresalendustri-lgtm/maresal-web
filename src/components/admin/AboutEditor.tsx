"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Save, Plus, Trash2, Upload, ChevronDown, ExternalLink } from "lucide-react";
import type {
  AboutContent,
  AboutStat,
  AboutValue,
  AboutMilestone,
  AboutCertification,
  AboutTeamMember,
} from "@/types/about";
import { updateAboutContent, uploadAboutImage } from "@/lib/actions/about";

export default function AboutEditor({ initialContent }: { initialContent: AboutContent }) {
  const [content, setContent] = useState<AboutContent>(initialContent);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const heroInputRef = useRef<HTMLInputElement>(null);

  const toggle = (key: string) =>
    setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  const set = <K extends keyof AboutContent>(key: K, val: AboutContent[K]) =>
    setContent((p) => ({ ...p, [key]: val }));

  const handleImageUpload = async (file: File, target: string) => {
    setUploading(target);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadAboutImage(fd);
      if (target === "hero") set("hero_image", url);
      else if (target.startsWith("team-")) {
        const idx = parseInt(target.split("-")[1]);
        set("team_members", content.team_members.map((m, i) => (i === idx ? { ...m, image: url } : m)));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Yükleme hatası.");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = () => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        await updateAboutContent(content);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Kaydetme hatası.");
      }
    });
  };

  // Array helpers
  const addStat = () => set("stats", [...content.stats, { label: "", value: "" }]);
  const updateStat = (i: number, f: keyof AboutStat, v: string) =>
    set("stats", content.stats.map((s, idx) => (idx === i ? { ...s, [f]: v } : s)));
  const removeStat = (i: number) => set("stats", content.stats.filter((_, idx) => idx !== i));

  const addValue = () => set("values_list", [...content.values_list, { title: "", description: "" }]);
  const updateValue = (i: number, f: keyof AboutValue, v: string) =>
    set("values_list", content.values_list.map((s, idx) => (idx === i ? { ...s, [f]: v } : s)));
  const removeValue = (i: number) => set("values_list", content.values_list.filter((_, idx) => idx !== i));

  const addMilestone = () => set("milestones", [...content.milestones, { year: "", title: "", description: "" }]);
  const updateMilestone = (i: number, f: keyof AboutMilestone, v: string) =>
    set("milestones", content.milestones.map((s, idx) => (idx === i ? { ...s, [f]: v } : s)));
  const removeMilestone = (i: number) => set("milestones", content.milestones.filter((_, idx) => idx !== i));

  const addCert = () => set("certifications", [...content.certifications, { name: "", description: "" }]);
  const updateCert = (i: number, f: keyof AboutCertification, v: string) =>
    set("certifications", content.certifications.map((s, idx) => (idx === i ? { ...s, [f]: v } : s)));
  const removeCert = (i: number) => set("certifications", content.certifications.filter((_, idx) => idx !== i));

  const addMember = () => set("team_members", [...content.team_members, { name: "", role: "", image: "" }]);
  const updateMember = (i: number, f: keyof AboutTeamMember, v: string) =>
    set("team_members", content.team_members.map((s, idx) => (idx === i ? { ...s, [f]: v } : s)));
  const removeMember = (i: number) => set("team_members", content.team_members.filter((_, idx) => idx !== i));

  return (
    <div className="abe">
      <div className="abe__header">
        <div>
          <h2 className="abe__title">Hakkımızda Sayfası</h2>
          <p className="abe__subtitle">Hakkımızda sayfasının içeriğini düzenleyin</p>
        </div>
        <div className="abe__header-actions">
          <a href="/hakkimizda" target="_blank" rel="noopener noreferrer" className="abe__preview-btn">
            <ExternalLink size={14} /> Önizle
          </a>
          <button onClick={handleSave} disabled={isPending} className="abe__save-btn">
            <Save size={16} />
            {isPending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      {error && <div className="abe__error">{error}</div>}
      {success && <div className="abe__success">Başarıyla kaydedildi!</div>}

      <div className="abe__body">
        {/* ── Hero ── */}
        <div className="abe__section-label">Hero Bölümü</div>
        <div className="abe__field">
          <label className="abe__label">Başlık</label>
          <input type="text" value={content.hero_title} onChange={(e) => set("hero_title", e.target.value)} className="abe__input" />
        </div>
        <div className="abe__field">
          <label className="abe__label">Alt Başlık</label>
          <textarea rows={3} value={content.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} className="abe__input abe__input--textarea" />
        </div>
        <div className="abe__field">
          <label className="abe__label">Hero Görsel</label>
          {content.hero_image ? (
            <div className="abe__img-preview">
              <Image src={content.hero_image} alt="Hero" width={600} height={200} className="abe__img-preview-img" unoptimized />
              <button type="button" className="abe__img-remove" onClick={() => { set("hero_image", ""); if (heroInputRef.current) heroInputRef.current.value = ""; }}>
                <Trash2 size={14} /> Kaldır
              </button>
            </div>
          ) : (
            <label className={`abe__upload-area ${uploading === "hero" ? "abe__upload-area--busy" : ""}`}>
              <input ref={heroInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="abe__file-input" disabled={uploading !== null} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, "hero"); }} />
              <Upload size={20} />
              <span>{uploading === "hero" ? "Yükleniyor..." : "Görsel seçin"}</span>
            </label>
          )}
        </div>

        {/* ── Company ── */}
        <div className="abe__section-label">Şirket Bilgileri</div>
        <div className="abe__field">
          <label className="abe__label">Şirket Açıklaması</label>
          <textarea rows={5} value={content.company_description} onChange={(e) => set("company_description", e.target.value)} className="abe__input abe__input--textarea" />
        </div>
        <div className="abe__field">
          <label className="abe__label">Misyon</label>
          <textarea rows={4} value={content.mission} onChange={(e) => set("mission", e.target.value)} className="abe__input abe__input--textarea" />
        </div>
        <div className="abe__field">
          <label className="abe__label">Vizyon</label>
          <textarea rows={4} value={content.vision} onChange={(e) => set("vision", e.target.value)} className="abe__input abe__input--textarea" />
        </div>

        {/* ── Stats ── */}
        <button type="button" className="abe__accordion" onClick={() => toggle("stats")}>
          <span>İstatistikler ({content.stats.length})</span>
          <ChevronDown size={16} className={`abe__acc-icon ${openSections.stats ? "abe__acc-icon--open" : ""}`} />
        </button>
        {openSections.stats && (
          <div className="abe__acc-body">
            {content.stats.map((stat, i) => (
              <div key={i} className="abe__row-3">
                <input type="text" value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)} placeholder="Değer (Örn: 500+)" className="abe__input abe__input--sm" />
                <input type="text" value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Etiket" className="abe__input abe__input--sm" />
                <button type="button" onClick={() => removeStat(i)} className="abe__rm"><Trash2 size={13} /></button>
              </div>
            ))}
            <button type="button" onClick={addStat} className="abe__add"><Plus size={14} /> İstatistik Ekle</button>
          </div>
        )}

        {/* ── Values ── */}
        <button type="button" className="abe__accordion" onClick={() => toggle("values")}>
          <span>Değerlerimiz ({content.values_list.length})</span>
          <ChevronDown size={16} className={`abe__acc-icon ${openSections.values ? "abe__acc-icon--open" : ""}`} />
        </button>
        {openSections.values && (
          <div className="abe__acc-body">
            {content.values_list.map((val, i) => (
              <div key={i} className="abe__card-editor">
                <div className="abe__card-header">
                  <input type="text" value={val.title} onChange={(e) => updateValue(i, "title", e.target.value)} placeholder="Değer başlığı" className="abe__input abe__input--sm" />
                  <button type="button" onClick={() => removeValue(i)} className="abe__rm"><Trash2 size={13} /></button>
                </div>
                <textarea rows={2} value={val.description} onChange={(e) => updateValue(i, "description", e.target.value)} placeholder="Açıklama..." className="abe__input abe__input--textarea abe__input--sm-textarea" />
              </div>
            ))}
            <button type="button" onClick={addValue} className="abe__add"><Plus size={14} /> Değer Ekle</button>
          </div>
        )}

        {/* ── Milestones ── */}
        <button type="button" className="abe__accordion" onClick={() => toggle("milestones")}>
          <span>Kilometre Taşları ({content.milestones.length})</span>
          <ChevronDown size={16} className={`abe__acc-icon ${openSections.milestones ? "abe__acc-icon--open" : ""}`} />
        </button>
        {openSections.milestones && (
          <div className="abe__acc-body">
            {content.milestones.map((m, i) => (
              <div key={i} className="abe__card-editor">
                <div className="abe__card-header">
                  <input type="text" value={m.year} onChange={(e) => updateMilestone(i, "year", e.target.value)} placeholder="Yıl" className="abe__input abe__input--sm" style={{ maxWidth: 80 }} />
                  <input type="text" value={m.title} onChange={(e) => updateMilestone(i, "title", e.target.value)} placeholder="Başlık" className="abe__input abe__input--sm" />
                  <button type="button" onClick={() => removeMilestone(i)} className="abe__rm"><Trash2 size={13} /></button>
                </div>
                <textarea rows={2} value={m.description} onChange={(e) => updateMilestone(i, "description", e.target.value)} placeholder="Açıklama..." className="abe__input abe__input--textarea abe__input--sm-textarea" />
              </div>
            ))}
            <button type="button" onClick={addMilestone} className="abe__add"><Plus size={14} /> Kilometre Taşı Ekle</button>
          </div>
        )}

        {/* ── Certifications ── */}
        <button type="button" className="abe__accordion" onClick={() => toggle("certs")}>
          <span>Sertifikalar ({content.certifications.length})</span>
          <ChevronDown size={16} className={`abe__acc-icon ${openSections.certs ? "abe__acc-icon--open" : ""}`} />
        </button>
        {openSections.certs && (
          <div className="abe__acc-body">
            {content.certifications.map((c, i) => (
              <div key={i} className="abe__card-editor">
                <div className="abe__card-header">
                  <input type="text" value={c.name} onChange={(e) => updateCert(i, "name", e.target.value)} placeholder="Sertifika adı" className="abe__input abe__input--sm" />
                  <button type="button" onClick={() => removeCert(i)} className="abe__rm"><Trash2 size={13} /></button>
                </div>
                <textarea rows={2} value={c.description} onChange={(e) => updateCert(i, "description", e.target.value)} placeholder="Açıklama..." className="abe__input abe__input--textarea abe__input--sm-textarea" />
              </div>
            ))}
            <button type="button" onClick={addCert} className="abe__add"><Plus size={14} /> Sertifika Ekle</button>
          </div>
        )}

        {/* ── Team ── */}
        <button type="button" className="abe__accordion" onClick={() => toggle("team")}>
          <span>Ekip ({content.team_members.length})</span>
          <ChevronDown size={16} className={`abe__acc-icon ${openSections.team ? "abe__acc-icon--open" : ""}`} />
        </button>
        {openSections.team && (
          <div className="abe__acc-body">
            {content.team_members.map((m, i) => (
              <div key={i} className="abe__card-editor">
                <div className="abe__card-header">
                  {m.image ? (
                    <div className="abe__team-thumb">
                      <Image src={m.image} alt={m.name} width={40} height={40} className="abe__team-thumb-img" unoptimized />
                      <button type="button" onClick={() => updateMember(i, "image", "")} className="abe__team-thumb-rm"><Trash2 size={10} /></button>
                    </div>
                  ) : (
                    <label className={`abe__team-upload ${uploading === `team-${i}` ? "abe__upload-area--busy" : ""}`}>
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="abe__file-input" disabled={uploading !== null} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, `team-${i}`); }} />
                      <Upload size={12} />
                    </label>
                  )}
                  <input type="text" value={m.name} onChange={(e) => updateMember(i, "name", e.target.value)} placeholder="İsim" className="abe__input abe__input--sm" />
                  <input type="text" value={m.role} onChange={(e) => updateMember(i, "role", e.target.value)} placeholder="Pozisyon" className="abe__input abe__input--sm" />
                  <button type="button" onClick={() => removeMember(i)} className="abe__rm"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addMember} className="abe__add"><Plus size={14} /> Ekip Üyesi Ekle</button>
          </div>
        )}
      </div>

      <style>{`
        .abe{max-width:900px;margin:0 auto}
        .abe__header{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.5rem}
        .abe__title{font-family:var(--font-display);font-size:1.75rem;font-weight:700;color:var(--color-text);margin:0}
        .abe__subtitle{margin:.25rem 0 0;font-size:.85rem;color:var(--color-text-dim)}
        .abe__header-actions{display:flex;gap:.75rem;align-items:center}
        .abe__preview-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.55rem 1rem;border-radius:10px;border:1px solid var(--color-border);background:transparent;color:var(--color-text-muted);font-size:.82rem;font-weight:600;text-decoration:none;transition:border-color .2s,color .2s}
        .abe__preview-btn:hover{border-color:rgba(59,130,246,.3);color:#60a5fa}
        .abe__save-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.6rem 1.25rem;border-radius:12px;border:none;background:var(--color-accent);color:var(--color-bg);font-family:var(--font-body);font-size:.88rem;font-weight:600;cursor:pointer;transition:background .2s,transform .2s,box-shadow .2s}
        .abe__save-btn:hover:not(:disabled){background:var(--color-accent-lt);transform:translateY(-1px);box-shadow:0 4px 16px rgba(201,162,39,.3)}
        .abe__save-btn:disabled{opacity:.5;cursor:not-allowed}
        .abe__error{padding:.75rem 1rem;border-radius:10px;border:1px solid rgba(239,68,68,.3);background:rgba(239,68,68,.1);font-size:.85rem;color:#f87171;margin-bottom:1rem}
        .abe__success{padding:.75rem 1rem;border-radius:10px;border:1px solid rgba(34,197,94,.3);background:rgba(34,197,94,.1);font-size:.85rem;color:#4ade80;margin-bottom:1rem}
        .abe__body{display:flex;flex-direction:column;gap:1rem;background:var(--color-bg-elevated);border:1px solid var(--color-border);border-radius:16px;padding:1.5rem 1.75rem}
        .abe__section-label{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:var(--color-accent);padding-top:.5rem;border-top:1px solid var(--color-border)}
        .abe__field{display:flex;flex-direction:column;gap:.4rem}
        .abe__label{font-size:.78rem;font-weight:600;color:var(--color-text-muted);letter-spacing:.02em}
        .abe__input{width:100%;padding:.65rem .85rem;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-text);font-family:var(--font-body);font-size:.88rem;outline:none;transition:border-color .2s,box-shadow .2s}
        .abe__input::placeholder{color:var(--color-text-dim)}
        .abe__input:focus{border-color:rgba(201,162,39,.4);box-shadow:0 0 0 3px rgba(201,162,39,.08)}
        .abe__input--textarea{resize:vertical;min-height:80px}
        .abe__input--sm{padding:.5rem .7rem;font-size:.82rem;border-radius:8px}
        .abe__input--sm-textarea{min-height:48px;margin-top:.35rem}
        .abe__file-input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}
        .abe__upload-area{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4rem;padding:1.5rem 1rem;border-radius:12px;border:2px dashed var(--color-border);background:rgba(255,255,255,.02);color:var(--color-text-dim);font-size:.85rem;cursor:pointer;transition:border-color .2s,background .2s}
        .abe__upload-area:hover{border-color:rgba(201,162,39,.4);background:rgba(201,162,39,.04)}
        .abe__upload-area--busy{opacity:.6;pointer-events:none}
        .abe__img-preview{position:relative;border-radius:12px;overflow:hidden;border:1px solid var(--color-border)}
        .abe__img-preview-img{width:100%;height:180px;object-fit:cover;display:block}
        .abe__img-remove{position:absolute;top:.5rem;right:.5rem;display:flex;align-items:center;gap:.35rem;padding:.35rem .65rem;border-radius:8px;border:none;background:rgba(0,0,0,.7);color:#f87171;font-size:.75rem;font-weight:600;cursor:pointer;backdrop-filter:blur(8px);transition:background .2s}
        .abe__img-remove:hover{background:rgba(239,68,68,.3)}
        .abe__accordion{display:flex;align-items:center;justify-content:space-between;width:100%;padding:.75rem 1rem;border-radius:10px;border:1px solid var(--color-border);background:rgba(255,255,255,.02);color:var(--color-text);font-family:var(--font-body);font-size:.85rem;font-weight:600;cursor:pointer;transition:border-color .2s,background .2s;margin-top:.25rem}
        .abe__accordion:hover{border-color:rgba(201,162,39,.3);background:rgba(201,162,39,.04)}
        .abe__acc-icon{color:var(--color-text-dim);transition:transform .2s}
        .abe__acc-icon--open{transform:rotate(180deg)}
        .abe__acc-body{display:flex;flex-direction:column;gap:.75rem;padding:.75rem;border:1px solid var(--color-border);border-top:0;border-radius:0 0 10px 10px;background:rgba(0,0,0,.15)}
        .abe__row-3{display:flex;align-items:center;gap:.5rem}
        .abe__card-editor{display:flex;flex-direction:column;gap:0;padding:.75rem;border-radius:10px;border:1px solid var(--color-border);background:rgba(255,255,255,.02)}
        .abe__card-header{display:flex;align-items:center;gap:.5rem}
        .abe__rm{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;border:1px solid rgba(239,68,68,.2);background:rgba(239,68,68,.06);color:#f87171;cursor:pointer;flex-shrink:0;transition:background .15s,border-color .15s}
        .abe__rm:hover{background:rgba(239,68,68,.15);border-color:rgba(239,68,68,.4)}
        .abe__add{display:flex;align-items:center;gap:.4rem;padding:.5rem .85rem;border-radius:8px;border:1px dashed rgba(201,162,39,.3);background:rgba(201,162,39,.04);color:var(--color-accent);font-size:.8rem;font-weight:600;cursor:pointer;font-family:var(--font-body);transition:background .15s,border-color .15s}
        .abe__add:hover{background:rgba(201,162,39,.1);border-color:rgba(201,162,39,.5)}
        .abe__team-thumb{position:relative;width:40px;height:40px;border-radius:8px;overflow:hidden;flex-shrink:0}
        .abe__team-thumb-img{width:100%;height:100%;object-fit:cover}
        .abe__team-thumb-rm{position:absolute;inset:0;background:rgba(0,0,0,.5);border:none;color:#f87171;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s}
        .abe__team-thumb:hover .abe__team-thumb-rm{opacity:1}
        .abe__team-upload{position:relative;width:40px;height:40px;border-radius:8px;border:1px dashed var(--color-border);display:flex;align-items:center;justify-content:center;color:var(--color-text-dim);cursor:pointer;flex-shrink:0;transition:border-color .2s}
        .abe__team-upload:hover{border-color:rgba(201,162,39,.4)}
        @media(max-width:600px){.abe__body{padding:1rem 1.25rem}.abe__header{flex-direction:column}}
      `}</style>
    </div>
  );
}
