"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { X, Upload, Trash2, Plus, GripVertical, ChevronDown } from "lucide-react";
import Image from "next/image";
import type { Service, ServiceSpec, ServiceGalleryItem, ServiceProcessStep } from "@/types/service";
import { createService, updateService } from "@/lib/actions/services";
import { uploadServiceImage, deleteServiceImage } from "@/lib/actions/upload";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ServiceDrawer({
  service,
  onClose,
  onSaved,
}: {
  service: Service | null;
  onClose: () => void;
  onSaved: (svc: Service) => void;
}) {
  const isNew = !service;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(service?.title ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [tag, setTag] = useState(service?.tag ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [detailDescription, setDetailDescription] = useState(service?.detail_description ?? "");
  const [heroImage, setHeroImage] = useState(service?.hero_image ?? "");
  const [image, setImage] = useState(service?.image ?? "");
  const [uploading, setUploading] = useState<string | null>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);
  const [features, setFeatures] = useState(service?.features.join("\n") ?? "");
  const [isActive, setIsActive] = useState(service?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(service?.sort_order ?? 0);

  const [specs, setSpecs] = useState<ServiceSpec[]>(service?.specs ?? []);
  const [gallery, setGallery] = useState<ServiceGalleryItem[]>(service?.gallery ?? []);
  const [process, setProcess] = useState<ServiceProcessStep[]>(service?.process ?? []);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    specs: (service?.specs?.length ?? 0) > 0,
    gallery: (service?.gallery?.length ?? 0) > 0,
    process: (service?.process?.length ?? 0) > 0,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) setSlug(slugify(val));
  };

  const handleFileUpload = async (file: File, target: string) => {
    setUploading(target);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadServiceImage(fd);
      if (target === "hero") setHeroImage(url);
      else if (target === "card") setImage(url);
      else if (target.startsWith("gallery-")) {
        const idx = parseInt(target.split("-")[1]);
        setGallery((prev) => prev.map((g, i) => (i === idx ? { ...g, url } : g)));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Yükleme hatası.");
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = async (target: "hero" | "card") => {
    const url = target === "hero" ? heroImage : image;
    if (url) { try { await deleteServiceImage(url); } catch { /* noop */ } }
    if (target === "hero") { setHeroImage(""); if (heroInputRef.current) heroInputRef.current.value = ""; }
    else { setImage(""); if (cardInputRef.current) cardInputRef.current.value = ""; }
  };

  // Specs
  const addSpec = () => setSpecs((prev) => [...prev, { label: "", value: "" }]);
  const updateSpec = (i: number, field: keyof ServiceSpec, val: string) =>
    setSpecs((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  const removeSpec = (i: number) => setSpecs((prev) => prev.filter((_, idx) => idx !== i));

  // Gallery
  const addGalleryItem = () => setGallery((prev) => [...prev, { url: "", alt: "" }]);
  const updateGalleryAlt = (i: number, alt: string) =>
    setGallery((prev) => prev.map((g, idx) => (idx === i ? { ...g, alt } : g)));
  const removeGalleryItem = async (i: number) => {
    const item = gallery[i];
    if (item.url) { try { await deleteServiceImage(item.url); } catch { /* noop */ } }
    setGallery((prev) => prev.filter((_, idx) => idx !== i));
  };

  // Process
  const addStep = () => setProcess((prev) => [...prev, { title: "", desc: "" }]);
  const updateStep = (i: number, field: keyof ServiceProcessStep, val: string) =>
    setProcess((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  const removeStep = (i: number) => setProcess((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    setError(null);
    if (!title.trim() || !slug.trim() || !tag.trim() || !description.trim()) {
      setError("Lütfen zorunlu alanları doldurun.");
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      tag: tag.trim(),
      description: description.trim(),
      detail_description: detailDescription.trim() || null,
      hero_image: heroImage.trim() || null,
      image: image.trim() || null,
      features: features.split("\n").map((f) => f.trim()).filter(Boolean),
      specs: specs.filter((s) => s.label.trim() && s.value.trim()),
      gallery: gallery.filter((g) => g.url.trim()),
      process: process.filter((p) => p.title.trim()),
      is_active: isActive,
      sort_order: sortOrder,
    };

    startTransition(async () => {
      try {
        const result = isNew
          ? await createService(payload)
          : await updateService(service!.id, payload);
        onSaved(result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      }
    });
  };

  return (
    <>
      <div className="sd__backdrop" onClick={onClose} />
      <div className="sd animate-slide-in">
        {/* Header */}
        <div className="sd__header">
          <div>
            <h3 className="sd__title">{isNew ? "Yeni Hizmet" : "Hizmet Düzenle"}</h3>
            <p className="sd__title-sub">
              {isNew ? "Yeni bir hizmet kaydı oluşturun" : `"${service?.title}" düzenleniyor`}
            </p>
          </div>
          <button onClick={onClose} className="sd__close" aria-label="Kapat"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="sd__body">
          {error && <div className="sd__error">{error}</div>}

          {/* ── Basic Info ── */}
          <div className="sd__section-label">Temel Bilgiler</div>
          <div className="sd__field">
            <label className="sd__label">Hizmet Adı *</label>
            <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Örn: Alüminyum İşleme" className="sd__input" />
          </div>
          <div className="sd__row">
            <div className="sd__field">
              <label className="sd__label">Slug *</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="aluminyum-isleme" className="sd__input" />
            </div>
            <div className="sd__field">
              <label className="sd__label">Etiket *</label>
              <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Örn: CNC & Yüzey" className="sd__input" />
            </div>
          </div>
          <div className="sd__field">
            <label className="sd__label">Kısa Açıklama *</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Hizmet hakkında kısa açıklama..." className="sd__input sd__input--textarea" />
          </div>
          <div className="sd__field">
            <label className="sd__label">Detaylı Açıklama</label>
            <textarea rows={5} value={detailDescription} onChange={(e) => setDetailDescription(e.target.value)} placeholder="Detaylı açıklama..." className="sd__input sd__input--textarea" />
          </div>

          {/* ── Images ── */}
          <div className="sd__section-label">Görseller</div>
          <div className="sd__field">
            <label className="sd__label">Hero Görsel</label>
            {heroImage ? (
              <div className="sd__img-preview">
                <Image src={heroImage} alt="Hero" width={480} height={200} className="sd__img-preview-img" unoptimized />
                <button type="button" className="sd__img-remove" onClick={() => handleRemoveImage("hero")}><Trash2 size={14} /> Kaldır</button>
              </div>
            ) : (
              <label className={`sd__upload-area ${uploading === "hero" ? "sd__upload-area--busy" : ""}`}>
                <input ref={heroInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sd__file-input" disabled={uploading !== null} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, "hero"); }} />
                <Upload size={20} />
                <span>{uploading === "hero" ? "Yükleniyor..." : "Görsel seçin"}</span>
                <span className="sd__upload-hint">JPEG, PNG, WebP · Max 5MB</span>
              </label>
            )}
          </div>
          <div className="sd__field">
            <label className="sd__label">Kart Görseli</label>
            {image ? (
              <div className="sd__img-preview">
                <Image src={image} alt="Kart" width={480} height={200} className="sd__img-preview-img" unoptimized />
                <button type="button" className="sd__img-remove" onClick={() => handleRemoveImage("card")}><Trash2 size={14} /> Kaldır</button>
              </div>
            ) : (
              <label className={`sd__upload-area ${uploading === "card" ? "sd__upload-area--busy" : ""}`}>
                <input ref={cardInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sd__file-input" disabled={uploading !== null} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, "card"); }} />
                <Upload size={20} />
                <span>{uploading === "card" ? "Yükleniyor..." : "Görsel seçin"}</span>
                <span className="sd__upload-hint">JPEG, PNG, WebP · Max 5MB</span>
              </label>
            )}
          </div>

          {/* ── Features ── */}
          <div className="sd__section-label">Özellikler & Durum</div>
          <div className="sd__field">
            <label className="sd__label">Özellikler (her satır bir özellik)</label>
            <textarea rows={6} value={features} onChange={(e) => setFeatures(e.target.value)} placeholder={"Özellik 1\nÖzellik 2\nÖzellik 3"} className="sd__input sd__input--textarea" />
          </div>
          <div className="sd__row">
            <div className="sd__field">
              <label className="sd__label">Sıralama</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="sd__input" />
            </div>
            <div className="sd__field">
              <label className="sd__label">Durum</label>
              <button type="button" onClick={() => setIsActive((v) => !v)} className={`sd__toggle ${isActive ? "sd__toggle--active" : "sd__toggle--inactive"}`}>
                <span className="sd__toggle-dot" />
                {isActive ? "Aktif" : "Pasif"}
              </button>
            </div>
          </div>

          {/* ── Specs (Collapsible) ── */}
          <button type="button" className="sd__accordion" onClick={() => toggleSection("specs")}>
            <span>Teknik Spesifikasyonlar ({specs.length})</span>
            <ChevronDown size={16} className={`sd__accordion-icon ${openSections.specs ? "sd__accordion-icon--open" : ""}`} />
          </button>
          {openSections.specs && (
            <div className="sd__accordion-body">
              {specs.map((spec, i) => (
                <div key={i} className="sd__list-row">
                  <GripVertical size={14} className="sd__grip" />
                  <input type="text" value={spec.label} onChange={(e) => updateSpec(i, "label", e.target.value)} placeholder="Etiket" className="sd__input sd__input--sm" />
                  <input type="text" value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)} placeholder="Değer" className="sd__input sd__input--sm" />
                  <button type="button" onClick={() => removeSpec(i)} className="sd__list-remove"><Trash2 size={13} /></button>
                </div>
              ))}
              <button type="button" onClick={addSpec} className="sd__list-add"><Plus size={14} /> Spesifikasyon Ekle</button>
            </div>
          )}

          {/* ── Gallery (Collapsible) ── */}
          <button type="button" className="sd__accordion" onClick={() => toggleSection("gallery")}>
            <span>Galeri ({gallery.length})</span>
            <ChevronDown size={16} className={`sd__accordion-icon ${openSections.gallery ? "sd__accordion-icon--open" : ""}`} />
          </button>
          {openSections.gallery && (
            <div className="sd__accordion-body">
              {gallery.map((item, i) => (
                <div key={i} className="sd__gallery-item">
                  {item.url ? (
                    <div className="sd__gallery-preview">
                      <Image src={item.url} alt={item.alt || `Galeri ${i + 1}`} width={200} height={100} className="sd__gallery-thumb" unoptimized />
                      <button type="button" onClick={() => removeGalleryItem(i)} className="sd__img-remove sd__img-remove--sm"><Trash2 size={12} /></button>
                    </div>
                  ) : (
                    <label className={`sd__upload-area sd__upload-area--mini ${uploading === `gallery-${i}` ? "sd__upload-area--busy" : ""}`}>
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sd__file-input" disabled={uploading !== null} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, `gallery-${i}`); }} />
                      <Upload size={16} />
                      <span>{uploading === `gallery-${i}` ? "Yükleniyor..." : "Görsel seç"}</span>
                    </label>
                  )}
                  <input type="text" value={item.alt} onChange={(e) => updateGalleryAlt(i, e.target.value)} placeholder="Alt text (açıklama)" className="sd__input sd__input--sm" />
                </div>
              ))}
              <button type="button" onClick={addGalleryItem} className="sd__list-add"><Plus size={14} /> Galeri Görseli Ekle</button>
            </div>
          )}

          {/* ── Process (Collapsible) ── */}
          <button type="button" className="sd__accordion" onClick={() => toggleSection("process")}>
            <span>Üretim Süreci ({process.length})</span>
            <ChevronDown size={16} className={`sd__accordion-icon ${openSections.process ? "sd__accordion-icon--open" : ""}`} />
          </button>
          {openSections.process && (
            <div className="sd__accordion-body">
              {process.map((step, i) => (
                <div key={i} className="sd__process-item">
                  <div className="sd__process-header">
                    <span className="sd__process-num">{String(i + 1).padStart(2, "0")}</span>
                    <input type="text" value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)} placeholder="Adım başlığı" className="sd__input sd__input--sm" />
                    <button type="button" onClick={() => removeStep(i)} className="sd__list-remove"><Trash2 size={13} /></button>
                  </div>
                  <textarea rows={2} value={step.desc} onChange={(e) => updateStep(i, "desc", e.target.value)} placeholder="Açıklama..." className="sd__input sd__input--textarea sd__input--sm-textarea" />
                </div>
              ))}
              <button type="button" onClick={addStep} className="sd__list-add"><Plus size={14} /> Süreç Adımı Ekle</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sd__footer">
          <button onClick={handleSubmit} disabled={isPending} className="sd__submit">
            {isPending ? "Kaydediliyor..." : isNew ? "Oluştur" : "Güncelle"}
          </button>
          <button onClick={onClose} className="sd__cancel">İptal</button>
        </div>
      </div>

      <style>{`
        .sd__backdrop{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.55);backdrop-filter:blur(6px)}
        .sd{position:fixed;top:0;right:0;bottom:0;z-index:210;width:100%;max-width:580px;display:flex;flex-direction:column;background:var(--color-bg-elevated);border-left:1px solid var(--color-border);box-shadow:-16px 0 48px rgba(0,0,0,.4)}
        .sd__header{display:flex;align-items:flex-start;justify-content:space-between;padding:1.5rem 1.75rem;border-bottom:1px solid var(--color-border);flex-shrink:0}
        .sd__title{font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:var(--color-text);margin:0}
        .sd__title-sub{font-size:.78rem;color:var(--color-text-dim);margin:.25rem 0 0}
        .sd__close{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:1px solid var(--color-border);background:rgba(255,255,255,.03);color:var(--color-text-muted);cursor:pointer;transition:color .2s,border-color .2s;flex-shrink:0}
        .sd__close:hover{color:#f87171;border-color:rgba(239,68,68,.3)}
        .sd__body{flex:1;overflow-y:auto;padding:1.5rem 1.75rem;display:flex;flex-direction:column;gap:1rem}
        .sd__error{padding:.75rem 1rem;border-radius:10px;border:1px solid rgba(239,68,68,.3);background:rgba(239,68,68,.1);font-size:.85rem;color:#f87171}
        .sd__section-label{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:var(--color-accent);padding-top:.5rem;border-top:1px solid var(--color-border)}
        .sd__field{display:flex;flex-direction:column;gap:.4rem}
        .sd__label{font-size:.78rem;font-weight:600;color:var(--color-text-muted);letter-spacing:.02em}
        .sd__input{width:100%;padding:.65rem .85rem;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-text);font-family:var(--font-body);font-size:.88rem;outline:none;transition:border-color .2s,box-shadow .2s}
        .sd__input::placeholder{color:var(--color-text-dim)}
        .sd__input:focus{border-color:rgba(201,162,39,.4);box-shadow:0 0 0 3px rgba(201,162,39,.08)}
        .sd__input--textarea{resize:vertical;min-height:80px}
        .sd__input--sm{padding:.5rem .7rem;font-size:.82rem;border-radius:8px}
        .sd__input--sm-textarea{min-height:48px;margin-top:.35rem}
        .sd__row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}

        /* File upload */
        .sd__file-input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}
        .sd__upload-area{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4rem;padding:1.5rem 1rem;border-radius:12px;border:2px dashed var(--color-border);background:rgba(255,255,255,.02);color:var(--color-text-dim);font-size:.85rem;cursor:pointer;transition:border-color .2s,background .2s}
        .sd__upload-area:hover{border-color:rgba(201,162,39,.4);background:rgba(201,162,39,.04);color:var(--color-text-muted)}
        .sd__upload-area--busy{opacity:.6;pointer-events:none}
        .sd__upload-area--mini{padding:.75rem .5rem;font-size:.78rem;border-radius:10px}
        .sd__upload-hint{font-size:.72rem;color:var(--color-text-dim)}
        .sd__img-preview{position:relative;border-radius:12px;overflow:hidden;border:1px solid var(--color-border)}
        .sd__img-preview-img{width:100%;height:160px;object-fit:cover;display:block}
        .sd__img-remove{position:absolute;top:.5rem;right:.5rem;display:flex;align-items:center;gap:.35rem;padding:.35rem .65rem;border-radius:8px;border:none;background:rgba(0,0,0,.7);color:#f87171;font-size:.75rem;font-weight:600;cursor:pointer;backdrop-filter:blur(8px);transition:background .2s}
        .sd__img-remove:hover{background:rgba(239,68,68,.3)}
        .sd__img-remove--sm{padding:.25rem .5rem;font-size:.7rem}

        /* Toggle */
        .sd__toggle{display:flex;align-items:center;gap:.5rem;width:100%;padding:.65rem .85rem;border-radius:10px;border:1px solid;font-family:var(--font-body);font-size:.88rem;font-weight:600;cursor:pointer;transition:background .15s,border-color .15s}
        .sd__toggle--active{background:rgba(34,197,94,.08);border-color:rgba(34,197,94,.25);color:#4ade80}
        .sd__toggle--inactive{background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.25);color:#f87171}
        .sd__toggle-dot{width:8px;height:8px;border-radius:50%;background:currentColor}

        /* Accordion */
        .sd__accordion{display:flex;align-items:center;justify-content:space-between;width:100%;padding:.75rem 1rem;border-radius:10px;border:1px solid var(--color-border);background:rgba(255,255,255,.02);color:var(--color-text);font-family:var(--font-body);font-size:.85rem;font-weight:600;cursor:pointer;transition:border-color .2s,background .2s;margin-top:.25rem}
        .sd__accordion:hover{border-color:rgba(201,162,39,.3);background:rgba(201,162,39,.04)}
        .sd__accordion-icon{color:var(--color-text-dim);transition:transform .2s}
        .sd__accordion-icon--open{transform:rotate(180deg)}
        .sd__accordion-body{display:flex;flex-direction:column;gap:.75rem;padding:.75rem;border:1px solid var(--color-border);border-top:0;border-radius:0 0 10px 10px;background:rgba(0,0,0,.15)}

        /* List editors */
        .sd__list-row{display:flex;align-items:center;gap:.5rem}
        .sd__grip{color:var(--color-text-dim);flex-shrink:0;cursor:grab}
        .sd__list-remove{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;border:1px solid rgba(239,68,68,.2);background:rgba(239,68,68,.06);color:#f87171;cursor:pointer;flex-shrink:0;transition:background .15s,border-color .15s}
        .sd__list-remove:hover{background:rgba(239,68,68,.15);border-color:rgba(239,68,68,.4)}
        .sd__list-add{display:flex;align-items:center;gap:.4rem;padding:.5rem .85rem;border-radius:8px;border:1px dashed rgba(201,162,39,.3);background:rgba(201,162,39,.04);color:var(--color-accent);font-size:.8rem;font-weight:600;cursor:pointer;font-family:var(--font-body);transition:background .15s,border-color .15s}
        .sd__list-add:hover{background:rgba(201,162,39,.1);border-color:rgba(201,162,39,.5)}

        /* Gallery items */
        .sd__gallery-item{display:flex;flex-direction:column;gap:.5rem;padding:.75rem;border-radius:10px;border:1px solid var(--color-border);background:rgba(255,255,255,.02)}
        .sd__gallery-preview{position:relative;border-radius:8px;overflow:hidden;height:100px}
        .sd__gallery-thumb{width:100%;height:100%;object-fit:cover;display:block}

        /* Process items */
        .sd__process-item{display:flex;flex-direction:column;gap:0;padding:.75rem;border-radius:10px;border:1px solid var(--color-border);background:rgba(255,255,255,.02)}
        .sd__process-header{display:flex;align-items:center;gap:.5rem}
        .sd__process-num{font-family:var(--font-display);font-size:.8rem;font-weight:700;color:var(--color-accent);width:28px;height:28px;border-radius:50%;background:rgba(201,162,39,.1);border:1px solid rgba(201,162,39,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0}

        /* Footer */
        .sd__footer{display:flex;gap:.75rem;padding:1.25rem 1.75rem;border-top:1px solid var(--color-border);flex-shrink:0}
        .sd__submit{flex:1;padding:.7rem 1rem;border-radius:10px;border:none;background:var(--color-accent);color:var(--color-bg);font-family:var(--font-body);font-size:.9rem;font-weight:600;cursor:pointer;transition:background .2s,transform .2s}
        .sd__submit:hover:not(:disabled){background:var(--color-accent-lt);transform:translateY(-1px)}
        .sd__submit:disabled{opacity:.5;cursor:not-allowed}
        .sd__cancel{padding:.7rem 1.25rem;border-radius:10px;border:1px solid var(--color-border);background:transparent;color:var(--color-text-muted);font-family:var(--font-body);font-size:.9rem;cursor:pointer;transition:color .2s,border-color .2s}
        .sd__cancel:hover{color:var(--color-text);border-color:rgba(255,255,255,.15)}
      `}</style>
    </>
  );
}
