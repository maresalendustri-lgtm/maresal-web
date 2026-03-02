"use client";

import { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Monitor,
} from "lucide-react";
import type { Service } from "@/types/service";
import { deleteService, toggleServiceActive } from "@/lib/actions/services";
import ServiceDrawer from "./ServiceDrawer";

export default function ServiceList({
  initialServices,
}: {
  initialServices: Service[];
}) {
  const [services, setServices] = useState(initialServices);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (!search.trim()) return services;
    const q = search.toLowerCase();
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q) ||
        s.slug.includes(q)
    );
  }, [services, search]);

  const handleEdit = (svc: Service) => {
    setEditingService(svc);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingService(null);
    setDrawerOpen(true);
  };

  const handleDelete = (svc: Service) => {
    if (!confirm(`"${svc.title}" hizmetini silmek istediğinize emin misiniz?`))
      return;
    startTransition(async () => {
      await deleteService(svc.id);
      setServices((prev) => prev.filter((s) => s.id !== svc.id));
    });
  };

  const handleToggleActive = (svc: Service) => {
    startTransition(async () => {
      await toggleServiceActive(svc.id, !svc.is_active);
      setServices((prev) =>
        prev.map((s) =>
          s.id === svc.id ? { ...s, is_active: !s.is_active } : s
        )
      );
    });
  };

  const handleSaved = (saved: Service) => {
    setServices((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    setDrawerOpen(false);
    setEditingService(null);
  };

  return (
    <div className="svc-list">
      {/* Header */}
      <div className="svc-list__header">
        <div>
          <h2 className="svc-list__title">Hizmet Yönetimi</h2>
          <p className="svc-list__subtitle">
            {services.length} hizmet kayıtlı ·{" "}
            {services.filter((s) => s.is_active).length} aktif
          </p>
        </div>
        <button onClick={handleCreate} className="svc-list__add-btn">
          <Plus size={16} />
          Yeni Hizmet
        </button>
      </div>

      {/* Search */}
      <div className="svc-list__search">
        <Search size={16} className="svc-list__search-icon" />
        <input
          type="text"
          placeholder="Hizmet ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="svc-list__search-input"
        />
      </div>

      {/* Table (desktop) / Cards (mobile) */}
      <div className={`svc-list__table-wrap ${isPending ? "svc-list__table-wrap--loading" : ""}`}>
        {/* Desktop table */}
        <table className="svc-list__table">
          <thead>
            <tr>
              <th>Görsel</th>
              <th>Hizmet</th>
              <th>Etiket</th>
              <th>Durum</th>
              <th>Özellik</th>
              <th className="svc-list__th-actions">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((svc) => (
              <tr key={svc.id}>
                <td>
                  <div className="svc-list__img-wrap">
                    {svc.image && (
                      <Image
                        src={svc.image}
                        alt={svc.title}
                        fill
                        className="svc-list__img"
                        sizes="56px"
                      />
                    )}
                  </div>
                </td>
                <td>
                  <span className="svc-list__name">{svc.title}</span>
                  <span className="svc-list__slug">/{svc.slug}</span>
                </td>
                <td>
                  <span className="svc-list__tag">{svc.tag}</span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleActive(svc)}
                    className={`svc-list__status ${svc.is_active ? "svc-list__status--active" : "svc-list__status--inactive"}`}
                  >
                    {svc.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                    {svc.is_active ? "Aktif" : "Pasif"}
                  </button>
                </td>
                <td>
                  <span className="svc-list__features">{svc.features.length} özellik</span>
                </td>
                <td>
                  <div className="svc-list__actions">
                    <button onClick={() => handleEdit(svc)} title="Düzenle" className="svc-list__action-btn svc-list__action-btn--edit">
                      <Pencil size={14} />
                    </button>
                    <a href={`/hizmetler/${svc.slug}`} target="_blank" rel="noopener noreferrer" title="Görüntüle" className="svc-list__action-btn svc-list__action-btn--view">
                      <ExternalLink size={14} />
                    </a>
                    <a href={`/hizmetler/${svc.slug}/sunum`} target="_blank" rel="noopener noreferrer" title="Sunum Modu" className="svc-list__action-btn svc-list__action-btn--pres">
                      <Monitor size={14} />
                    </a>
                    <button onClick={() => handleDelete(svc)} title="Sil" className="svc-list__action-btn svc-list__action-btn--delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="svc-list__empty">
                  {search ? "Arama sonucu bulunamadı." : "Henüz hizmet eklenmemiş."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className={`svc-list__cards ${isPending ? "svc-list__cards--loading" : ""}`}>
        {filtered.map((svc) => (
          <div key={svc.id} className="svc-card">
            <div className="svc-card__top">
              <div className="svc-card__img-wrap">
                {svc.image && (
                  <Image src={svc.image} alt={svc.title} fill className="svc-list__img" sizes="48px" />
                )}
              </div>
              <div className="svc-card__info">
                <span className="svc-card__name">{svc.title}</span>
                <span className="svc-card__slug">/{svc.slug}</span>
              </div>
              <button
                onClick={() => handleToggleActive(svc)}
                className={`svc-list__status ${svc.is_active ? "svc-list__status--active" : "svc-list__status--inactive"}`}
              >
                {svc.is_active ? "Aktif" : "Pasif"}
              </button>
            </div>
            <div className="svc-card__bottom">
              <span className="svc-list__tag">{svc.tag}</span>
              <div className="svc-list__actions">
                <button onClick={() => handleEdit(svc)} className="svc-list__action-btn svc-list__action-btn--edit"><Pencil size={14} /></button>
                <a href={`/hizmetler/${svc.slug}`} target="_blank" rel="noopener noreferrer" className="svc-list__action-btn svc-list__action-btn--view"><ExternalLink size={14} /></a>
                <a href={`/hizmetler/${svc.slug}/sunum`} target="_blank" rel="noopener noreferrer" className="svc-list__action-btn svc-list__action-btn--pres"><Monitor size={14} /></a>
                <button onClick={() => handleDelete(svc)} className="svc-list__action-btn svc-list__action-btn--delete"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="svc-list__empty-card">
            {search ? "Arama sonucu bulunamadı." : "Henüz hizmet eklenmemiş."}
          </div>
        )}
      </div>

      {drawerOpen && (
        <ServiceDrawer
          service={editingService}
          onClose={() => { setDrawerOpen(false); setEditingService(null); }}
          onSaved={handleSaved}
        />
      )}

      <style>{`
        .svc-list { max-width: 1200px; margin: 0 auto; }
        .svc-list__header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .svc-list__title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
        }
        .svc-list__subtitle {
          margin: 0.25rem 0 0;
          font-size: 0.85rem;
          color: var(--color-text-dim);
        }
        .svc-list__add-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.25rem;
          border-radius: 12px;
          border: none;
          background: var(--color-accent);
          color: var(--color-bg);
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .svc-list__add-btn:hover {
          background: var(--color-accent-lt);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(201,162,39,0.3);
        }

        /* Search */
        .svc-list__search {
          position: relative;
          margin-bottom: 1.25rem;
        }
        .svc-list__search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-dim);
          pointer-events: none;
        }
        .svc-list__search-input {
          width: 100%;
          padding: 0.7rem 1rem 0.7rem 2.75rem;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
          color: var(--color-text);
          font-family: var(--font-body);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .svc-list__search-input::placeholder { color: var(--color-text-dim); }
        .svc-list__search-input:focus { border-color: rgba(201,162,39,0.4); }

        /* Table (desktop) */
        .svc-list__table-wrap {
          border-radius: 16px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
          overflow: hidden;
        }
        .svc-list__table-wrap--loading { opacity: 0.5; pointer-events: none; }
        .svc-list__table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }
        .svc-list__table thead tr {
          border-bottom: 1px solid var(--color-border);
          background: rgba(255,255,255,0.015);
        }
        .svc-list__table th {
          padding: 0.85rem 1rem;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-dim);
        }
        .svc-list__th-actions { text-align: right; }
        .svc-list__table tbody tr {
          border-bottom: 1px solid var(--color-border);
          transition: background 0.15s;
        }
        .svc-list__table tbody tr:last-child { border-bottom: none; }
        .svc-list__table tbody tr:hover { background: rgba(255,255,255,0.015); }
        .svc-list__table td { padding: 0.75rem 1rem; }

        .svc-list__img-wrap {
          position: relative;
          width: 56px; height: 40px;
          border-radius: 8px;
          overflow: hidden;
          background: var(--color-surface);
        }
        .svc-list__img { object-fit: cover; }
        .svc-list__name {
          display: block;
          font-weight: 600;
          color: var(--color-text);
        }
        .svc-list__slug { font-size: 0.75rem; color: var(--color-text-dim); }
        .svc-list__tag {
          display: inline-block;
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--color-accent);
          background: var(--color-accent-dim);
          border: 1px solid rgba(201,162,39,0.2);
        }
        .svc-list__status {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          transition: background 0.15s;
        }
        .svc-list__status--active { background: rgba(34,197,94,0.1); color: #4ade80; }
        .svc-list__status--active:hover { background: rgba(34,197,94,0.2); }
        .svc-list__status--inactive { background: rgba(239,68,68,0.1); color: #f87171; }
        .svc-list__status--inactive:hover { background: rgba(239,68,68,0.2); }
        .svc-list__features { color: var(--color-text-muted); font-size: 0.85rem; }

        .svc-list__actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.35rem;
        }
        .svc-list__action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: rgba(255,255,255,0.02);
          color: var(--color-text-dim);
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }
        .svc-list__action-btn--edit:hover { border-color: rgba(201,162,39,0.3); background: var(--color-accent-dim); color: var(--color-accent); }
        .svc-list__action-btn--view:hover { border-color: rgba(59,130,246,0.3); background: rgba(59,130,246,0.1); color: #60a5fa; }
        .svc-list__action-btn--pres:hover { border-color: rgba(168,85,247,0.3); background: rgba(168,85,247,0.1); color: #c084fc; }
        .svc-list__action-btn--delete:hover { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); color: #f87171; }

        .svc-list__empty {
          padding: 3rem 1rem;
          text-align: center;
          color: var(--color-text-dim);
        }

        /* Mobile cards - hidden on desktop */
        .svc-list__cards { display: none; }
        .svc-list__cards--loading { opacity: 0.5; pointer-events: none; }

        @media (max-width: 768px) {
          .svc-list__table-wrap { display: none; }
          .svc-list__cards {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
        }

        .svc-card {
          border-radius: 14px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
          padding: 1rem;
        }
        .svc-card__top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .svc-card__img-wrap {
          position: relative;
          width: 48px; height: 36px;
          border-radius: 8px;
          overflow: hidden;
          background: var(--color-surface);
          flex-shrink: 0;
        }
        .svc-card__info { flex: 1; min-width: 0; }
        .svc-card__name {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .svc-card__slug { font-size: 0.72rem; color: var(--color-text-dim); }
        .svc-card__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--color-border);
        }
        .svc-list__empty-card {
          padding: 3rem 1rem;
          text-align: center;
          color: var(--color-text-dim);
          border-radius: 14px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
        }
      `}</style>
    </div>
  );
}
