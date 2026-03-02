import Link from "next/link";
import { getServices } from "@/lib/actions/services";
import {
  Wrench,
  Image as ImageIcon,
  MessageSquare,
  ExternalLink,
  CheckCircle,
  XCircle,
  Layers,
  TrendingUp,
  Clock,
} from "lucide-react";

export default async function AdminDashboard() {
  const services = await getServices();
  const activeCount = services.filter((s) => s.is_active).length;
  const inactiveCount = services.length - activeCount;

  return (
    <div className="adm-dash">
      {/* Welcome header */}
      <div className="adm-dash__header">
        <div>
          <h2 className="adm-dash__welcome">Hoş Geldiniz, Admin</h2>
          <p className="adm-dash__subtitle">
            Maresal Yönetim Paneli — sitenizin durumunu buradan takip edebilirsiniz.
          </p>
        </div>
        <span className="adm-dash__date">
          <Clock size={14} />
          {new Date().toLocaleDateString("tr-TR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Stats */}
      <div className="adm-dash__stats">
        <StatCard
          icon={<Layers size={22} />}
          label="Toplam Hizmet"
          value={String(services.length)}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle size={22} />}
          label="Aktif Hizmet"
          value={String(activeCount)}
          color="green"
        />
        <StatCard
          icon={<XCircle size={22} />}
          label="Pasif Hizmet"
          value={String(inactiveCount)}
          color="red"
        />
        <StatCard
          icon={<TrendingUp size={22} />}
          label="Özellik Sayısı"
          value={String(services.reduce((sum, s) => sum + s.features.length, 0))}
          color="gold"
        />
      </div>

      {/* Quick links */}
      <div className="adm-dash__quick">
        <h3 className="adm-dash__section-title">Hızlı İşlemler</h3>
        <div className="adm-dash__links">
          <QuickLink href="/admin/hizmetler" icon={<Wrench size={18} />} label="Hizmetleri Yönet" desc="Hizmet ekle, düzenle, sil" />
          <QuickLink href="/admin/galeri" icon={<ImageIcon size={18} />} label="Galeriyi Yönet" desc="Fotoğraf ve medya yönetimi" />
          <QuickLink href="/admin/mesajlar" icon={<MessageSquare size={18} />} label="Mesajları Gör" desc="İletişim formu mesajları" badge={3} />
          <QuickLink href="/" icon={<ExternalLink size={18} />} label="Siteyi Görüntüle" desc="Canlı siteyi aç" external />
        </div>
      </div>

      {/* Recent services */}
      {services.length > 0 && (
        <div className="adm-dash__recent">
          <div className="adm-dash__recent-header">
            <h3 className="adm-dash__section-title">Son Hizmetler</h3>
            <Link href="/admin/hizmetler" className="adm-dash__view-all">
              Tümünü Gör →
            </Link>
          </div>
          <div className="adm-dash__recent-list">
            {services.slice(0, 5).map((svc) => (
              <div key={svc.id} className="adm-dash__recent-item">
                <div className="adm-dash__recent-info">
                  <span className="adm-dash__recent-title">{svc.title}</span>
                  <span className="adm-dash__recent-slug">/{svc.slug}</span>
                </div>
                <div className="adm-dash__recent-meta">
                  <span className="adm-dash__recent-tag">{svc.tag}</span>
                  <span className={`adm-dash__recent-status ${svc.is_active ? "adm-dash__recent-status--active" : "adm-dash__recent-status--inactive"}`}>
                    {svc.is_active ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .adm-dash { max-width: 1100px; margin: 0 auto; }

        .adm-dash__header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .adm-dash__welcome {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
        }
        .adm-dash__subtitle {
          margin: 0.35rem 0 0;
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        .adm-dash__date {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          font-size: 0.8rem;
          color: var(--color-text-dim);
          white-space: nowrap;
        }

        /* Stats grid */
        .adm-dash__stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 900px) { .adm-dash__stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .adm-dash__stats { grid-template-columns: 1fr; } }

        .stat-card {
          position: relative;
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
          overflow: hidden;
          transition: border-color 0.25s, transform 0.25s;
        }
        .stat-card:hover {
          border-color: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }
        .stat-card__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px; height: 44px;
          border-radius: 12px;
          margin-bottom: 1rem;
        }
        .stat-card--blue .stat-card__icon  { background: rgba(59,130,246,0.12); color: #60a5fa; }
        .stat-card--green .stat-card__icon { background: rgba(34,197,94,0.12); color: #4ade80; }
        .stat-card--red .stat-card__icon   { background: rgba(239,68,68,0.12); color: #f87171; }
        .stat-card--gold .stat-card__icon  { background: var(--color-accent-dim); color: var(--color-accent); }
        .stat-card__value {
          display: block;
          font-family: var(--font-display);
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1;
          color: var(--color-text);
          margin-bottom: 0.35rem;
        }
        .stat-card__label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--color-text-dim);
          letter-spacing: 0.02em;
        }

        /* Quick links */
        .adm-dash__quick {
          margin-bottom: 2rem;
        }
        .adm-dash__section-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--color-text);
          margin: 0 0 1rem;
        }
        .adm-dash__links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        @media (max-width: 600px) { .adm-dash__links { grid-template-columns: 1fr; } }

        .quick-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.15rem 1.25rem;
          border-radius: 14px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .quick-link:hover {
          border-color: rgba(201,162,39,0.25);
          background: rgba(201,162,39,0.04);
          transform: translateX(3px);
        }
        .quick-link__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px; height: 42px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--color-border);
          color: var(--color-text-dim);
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .quick-link:hover .quick-link__icon {
          background: var(--color-accent-dim);
          border-color: rgba(201,162,39,0.3);
          color: var(--color-accent);
        }
        .quick-link__text { flex: 1; }
        .quick-link__label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 2px;
        }
        .quick-link__desc {
          display: block;
          font-size: 0.78rem;
          color: var(--color-text-dim);
        }
        .quick-link__badge {
          min-width: 22px;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          background: var(--color-accent);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-bg);
          text-align: center;
        }

        /* Recent services */
        .adm-dash__recent {
          border-radius: 16px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
          overflow: hidden;
        }
        .adm-dash__recent-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem 0;
        }
        .adm-dash__recent-header .adm-dash__section-title { margin: 0; }
        .adm-dash__view-all {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-accent);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .adm-dash__view-all:hover { opacity: 0.8; }

        .adm-dash__recent-list { padding: 1rem 0; }
        .adm-dash__recent-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          transition: background 0.15s;
        }
        .adm-dash__recent-item:hover { background: rgba(255,255,255,0.02); }
        .adm-dash__recent-title {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .adm-dash__recent-slug {
          font-size: 0.75rem;
          color: var(--color-text-dim);
        }
        .adm-dash__recent-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .adm-dash__recent-tag {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--color-accent);
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          background: var(--color-accent-dim);
          border: 1px solid rgba(201,162,39,0.2);
        }
        .adm-dash__recent-status {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
        }
        .adm-dash__recent-status--active {
          background: rgba(34,197,94,0.1);
          color: #4ade80;
        }
        .adm-dash__recent-status--inactive {
          background: rgba(239,68,68,0.1);
          color: #f87171;
        }
      `}</style>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "green" | "red" | "gold";
}) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">{icon}</div>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
  desc,
  badge,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  badge?: number;
  external?: boolean;
}) {
  const Tag = external ? "a" : Link;
  const extra = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Tag href={href} className="quick-link" {...extra}>
      <div className="quick-link__icon">{icon}</div>
      <div className="quick-link__text">
        <span className="quick-link__label">{label}</span>
        <span className="quick-link__desc">{desc}</span>
      </div>
      {badge && <span className="quick-link__badge">{badge}</span>}
    </Tag>
  );
}
