"use client";

import { useState, useCallback } from "react";
import { GALLERY_CATEGORIES } from "@/lib/gallery";
import type { GalleryImage } from "@/lib/gallery";
import { saveGalleryImages } from "@/lib/actions/gallery";

const CATEGORIES = GALLERY_CATEGORIES.filter((c) => c !== "Tümü");

function AddImageModal({
  categories,
  onAdd,
  onClose,
}: {
  categories: readonly string[];
  onAdd: (img: { url: string; alt: string; cat: string }) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [cat, setCat] = useState(categories[0] || "Metal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAdd({ url: url.trim(), alt: alt.trim() || "Yeni görsel", cat });
    setUrl("");
    setAlt("");
  };

  return (
    <>
      <div className="ag__modal-overlay" onClick={onClose} />
      <div className="ag__modal ag__modal--add">
        <button type="button" className="ag__modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="ag__modal-info">
          <h3 className="ag__modal-title">Görsel Ekle (URL)</h3>
          <p className="ag__modal-desc">
            Görsel URL&apos;si girin. Harici linkler (örn. Unsplash) desteklenir.
          </p>
          <form onSubmit={handleSubmit} className="ag__add-form">
            <label className="ag__modal-field">
              <span>Görsel URL *</span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </label>
            <label className="ag__modal-field">
              <span>Başlık / Alt metin</span>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Görsel açıklaması"
              />
            </label>
            <label className="ag__modal-field">
              <span>Kategori</span>
              <select value={cat} onChange={(e) => setCat(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <div className="ag__add-actions">
              <button type="button" className="ag__add-cancel" onClick={onClose}>
                İptal
              </button>
              <button type="submit" className="ag__add-submit">
                Ekle
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default function AdminGalleryClient({
  initialImages,
}: {
  initialImages: GalleryImage[];
}) {
  const [images, setImages] = useState<GalleryImage[]>(() =>
    initialImages.map((img) => ({ ...img }))
  );
  const [filter, setFilter] = useState("Tümü");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [viewImg, setViewImg] = useState<GalleryImage | null>(null);
  const [viewIdx, setViewIdx] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const filtered =
    filter === "Tümü" ? images : images.filter((i) => i.cat === filter);

  const persist = useCallback(async (newImages: GalleryImage[]) => {
    setSaving(true);
    try {
      await saveGalleryImages(newImages);
    } catch (err) {
      console.error("Galeri kaydetme hatası:", err);
    } finally {
      setSaving(false);
    }
  }, []);

  const toggleSelect = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const updateImage = useCallback((idx: number, updates: Partial<GalleryImage>) => {
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? { ...img, ...updates } : img))
    );
    setViewImg((v) => (v ? { ...v, ...updates } : null));
  }, []);

  const openView = (img: GalleryImage, idx: number) => {
    setViewImg(img);
    setViewIdx(idx);
  };

  const closeView = useCallback(async () => {
    if (viewIdx !== null && viewImg) {
      const newImages = images.map((img, i) =>
        i === viewIdx ? { ...viewImg } : img
      );
      await persist(newImages);
    }
    setViewImg(null);
    setViewIdx(null);
  }, [viewIdx, viewImg, images, persist]);

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    const toRemove = new Set(selected);
    const newImages = images.filter((_, i) => !toRemove.has(i));
    setImages(newImages);
    setSelected(new Set());
    setViewImg(null);
    setViewIdx(null);
    await persist(newImages);
  };

  const deleteImage = async (idx: number) => {
    const newImages = images.filter((_, i) => i !== idx);
    setImages(newImages);
    setSelected(new Set());
    setViewImg(null);
    setViewIdx(null);
    await persist(newImages);
  };

  const addImage = async (newImg: { url: string; alt: string; cat: string }) => {
    const newImages = [...images, { ...newImg, span: "normal" as const }];
    setImages(newImages);
    setShowAddModal(false);
    await persist(newImages);
  };

  return (
    <div className="ag">
      {saving && (
        <div className="ag__saving" aria-live="polite">
          Kaydediliyor...
        </div>
      )}
      {/* Header */}
      <div className="ag__header">
        <div>
          <h2 className="ag__title">Galeri Yönetimi</h2>
          <p className="ag__subtitle">
            {images.length} görsel · {selected.size} seçili
          </p>
        </div>
        <div className="ag__header-actions">
          {selected.size > 0 && (
            <button type="button" className="ag__del-btn" onClick={deleteSelected}>
              Seçilenleri Sil ({selected.size})
            </button>
          )}
          <button type="button" className="ag__upload-btn" onClick={() => setShowAddModal(true)}>
            Görsel Yükle
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="ag__filters">
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`ag__filter ${filter === cat ? "ag__filter--active" : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
        <span className="ag__filter-count">{filtered.length} sonuç</span>
      </div>

      {/* Grid */}
      <div className="ag__grid">
        <button type="button" className="ag__upload-card" onClick={() => setShowAddModal(true)}>
          <span>Görsel Yükle</span>
          <span className="ag__upload-hint">URL ile ekle</span>
        </button>

        {filtered.map((img, i) => {
          const globalIdx = images.indexOf(img);
          const isSelected = selected.has(globalIdx);
          return (
            <div
              key={`${img.alt}-${i}`}
              className={`ag__item ${isSelected ? "ag__item--selected" : ""}`}
            >
              <div
                className="ag__item-img"
                onClick={() => openView(img, globalIdx)}
                onKeyDown={(e) => e.key === "Enter" && openView(img, globalIdx)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={img.url.replace("1200", "400")}
                  alt={img.alt}
                  loading="lazy"
                />
                <div className="ag__item-overlay">
                  <span aria-hidden>🔍</span>
                </div>
              </div>
              <div className="ag__item-footer">
                <button
                  type="button"
                  className={`ag__check ${isSelected ? "ag__check--active" : ""}`}
                  onClick={() => toggleSelect(globalIdx)}
                  aria-label="Seç"
                >
                  {isSelected && "✓"}
                </button>
                <div className="ag__item-info">
                  <span className="ag__item-alt">{img.alt}</span>
                  <span className="ag__item-cat">{img.cat}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View modal */}
      {viewImg && (
        <>
          <div className="ag__modal-overlay" onClick={closeView} />
          <div className="ag__modal">
            <button
              type="button"
              className="ag__modal-close"
              onClick={closeView}
              aria-label="Kapat"
            >
              ✕
            </button>
            <img src={viewImg.url} alt={viewImg.alt} className="ag__modal-img" />
            <div className="ag__modal-info">
              <div className="ag__modal-fields">
                <label className="ag__modal-field">
                  <span>Başlık / Alt metin</span>
                  <input
                    type="text"
                    value={viewImg.alt}
                    onChange={(e) =>
                      viewIdx !== null &&
                      updateImage(viewIdx, { alt: e.target.value })
                    }
                  />
                </label>
                <label className="ag__modal-field">
                  <span>Kategori</span>
                  <select
                    value={viewImg.cat}
                    onChange={(e) =>
                      viewIdx !== null &&
                      updateImage(viewIdx, { cat: e.target.value })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="ag__modal-actions">
                <button
                  type="button"
                  className="ag__modal-del"
                  onClick={() => viewIdx !== null && deleteImage(viewIdx)}
                >
                  Bu görseli sil
                </button>
                <span className="ag__modal-hint">
                  Değişiklikler kapatıldığında kaydedilir.
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {showAddModal && (
        <AddImageModal
          categories={CATEGORIES}
          onAdd={addImage}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <style>{`
        .ag{max-width:1200px;position:relative}
        .ag__saving{position:fixed;top:1rem;right:1rem;z-index:300;padding:.5rem 1rem;background:var(--color-accent);color:var(--color-bg);font-size:.8rem;font-weight:600;border-radius:var(--radius);animation:agPulse 1.5s ease infinite}
        @keyframes agPulse{0%,100%{opacity:1}50%{opacity:.8}}
        .ag__header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem}
        .ag__title{font-family:var(--font-display);font-size:1.5rem;font-weight:700;margin:0 0 .2rem}
        .ag__subtitle{font-size:.82rem;color:var(--color-text-dim);margin:0}
        .ag__header-actions{display:flex;gap:.6rem;flex-wrap:wrap}
        .ag__del-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.55rem 1rem;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:var(--radius);font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s}
        .ag__del-btn:hover{background:rgba(239,68,68,.2)}
        .ag__upload-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.55rem 1.15rem;background:var(--color-accent);color:var(--color-bg);border:none;border-radius:var(--radius);font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s}
        .ag__upload-btn:hover{background:var(--color-accent-lt);transform:translateY(-1px)}

        .ag__filters{display:flex;gap:.4rem;align-items:center;flex-wrap:wrap;margin-bottom:1.25rem}
        .ag__filter{padding:.4rem .85rem;background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-pill);color:var(--color-text-muted);font-size:.78rem;font-weight:500;cursor:pointer;transition:all .2s}
        .ag__filter:hover{color:var(--color-accent);border-color:rgba(201,162,39,.25)}
        .ag__filter--active{background:var(--color-accent);color:var(--color-bg);border-color:var(--color-accent);font-weight:700}
        .ag__filter-count{margin-left:auto;font-size:.75rem;color:var(--color-text-dim)}

        .ag__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.85rem}
        .ag__upload-card{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;min-height:180px;background:var(--color-bg-elevated);border:2px dashed var(--color-border);border-radius:var(--radius-lg);color:var(--color-text-dim);cursor:pointer;transition:all .3s}
        .ag__upload-card span:first-of-type{font-size:.85rem;font-weight:600}
        .ag__upload-hint{font-size:.68rem;color:var(--color-text-dim)}
        .ag__upload-card:hover{border-color:rgba(201,162,39,.3);color:var(--color-accent);background:rgba(201,162,39,.03)}

        .ag__item{background:var(--color-bg-elevated);border:1px solid var(--color-border);border-radius:var(--radius-lg);overflow:hidden;transition:border-color .25s,transform .25s}
        .ag__item:hover{border-color:rgba(255,255,255,.12);transform:translateY(-2px)}
        .ag__item--selected{border-color:var(--color-accent);box-shadow:0 0 0 1px var(--color-accent)}
        .ag__item-img{position:relative;height:150px;cursor:pointer;overflow:hidden}
        .ag__item-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
        .ag__item:hover .ag__item-img img{transform:scale(1.05)}
        .ag__item-overlay{position:absolute;inset:0;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:white;opacity:0;transition:opacity .3s}
        .ag__item-img:hover .ag__item-overlay{opacity:1}

        .ag__item-footer{display:flex;align-items:flex-start;gap:.65rem;padding:.75rem}
        .ag__check{width:22px;height:22px;border-radius:6px;background:rgba(255,255,255,.03);border:2px solid var(--color-border);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:.1rem;color:transparent;transition:all .2s}
        .ag__check--active{background:var(--color-accent);border-color:var(--color-accent);color:var(--color-bg)}
        .ag__item-info{display:flex;flex-direction:column;min-width:0}
        .ag__item-alt{font-size:.78rem;font-weight:600;color:var(--color-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .ag__item-cat{font-size:.68rem;color:var(--color-text-dim);margin-top:.1rem}

        .ag__modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.7);backdrop-filter:blur(6px)}
        .ag__modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:210;max-width:900px;width:90%;background:var(--color-bg-elevated);border:1px solid var(--color-border);border-radius:var(--radius-lg);overflow:hidden;animation:agFadeIn .25s ease forwards}
        @keyframes agFadeIn{from{opacity:0}to{opacity:1}}
        .ag__modal-close{position:absolute;top:1rem;right:1rem;z-index:5;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.1);color:var(--color-text-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
        .ag__modal-close:hover{color:#ef4444}
        .ag__modal-img{width:100%;max-height:65vh;object-fit:contain;display:block}
        .ag__modal-info{padding:1.25rem;border-top:1px solid var(--color-border)}
        .ag__modal-fields{display:flex;flex-direction:column;gap:1rem;margin-bottom:.75rem}
        .ag__modal-field{display:flex;flex-direction:column;gap:.35rem}
        .ag__modal-field>span{font-size:.72rem;font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.06em}
        .ag__modal-field input,.ag__modal-field select{padding:.6rem .85rem;background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius);color:var(--color-text);font-size:.88rem}
        .ag__modal-actions{display:flex;flex-wrap:wrap;align-items:center;gap:1rem;margin-top:.5rem}
        .ag__modal-del{padding:.4rem .8rem;font-size:.78rem;font-weight:600;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:var(--radius);cursor:pointer;transition:background .2s}
        .ag__modal-del:hover{background:rgba(239,68,68,.2)}
        .ag__modal-hint{font-size:.7rem;color:var(--color-text-dim)}

        .ag__modal--add .ag__modal-info{padding:1.5rem}
        .ag__modal-title{font-family:var(--font-display);font-size:1.2rem;font-weight:700;margin:0 0 .5rem}
        .ag__modal-desc{font-size:.88rem;color:var(--color-text-muted);margin:0 0 1.25rem;line-height:1.5}
        .ag__add-form{display:flex;flex-direction:column;gap:1rem}
        .ag__add-actions{display:flex;gap:.75rem;margin-top:.5rem}
        .ag__add-cancel{padding:.6rem 1.25rem;background:transparent;border:1px solid var(--color-border);color:var(--color-text-muted);border-radius:var(--radius);font-size:.88rem;font-weight:600;cursor:pointer;transition:all .2s}
        .ag__add-cancel:hover{border-color:var(--color-accent);color:var(--color-accent)}
        .ag__add-submit{padding:.6rem 1.25rem;background:var(--color-accent);color:var(--color-bg);border:none;border-radius:var(--radius);font-size:.88rem;font-weight:600;cursor:pointer;transition:all .2s}
        .ag__add-submit:hover{background:var(--color-accent-lt);transform:translateY(-1px)}

        @media(max-width:600px){.ag__grid{grid-template-columns:1fr 1fr}}
      `}</style>
    </div>
  );
}
