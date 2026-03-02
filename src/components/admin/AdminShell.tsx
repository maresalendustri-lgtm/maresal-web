"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bell,
  Menu,
  X,
  LogOut,
  Info,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Hizmetler", href: "/admin/hizmetler", icon: Wrench },
  { label: "Hakkımızda", href: "/admin/hakkimizda", icon: Info },
  { label: "Galeri", href: "/admin/galeri", icon: ImageIcon },
  { label: "Mesajlar", href: "/admin/mesajlar", icon: MessageSquare, badge: 3 },
  { label: "Ayarlar", href: "/admin/ayarlar", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const pageTitle = NAV.find((n) => isActive(n))?.label ?? "Admin";
  const sideW = collapsed ? 72 : 260;

  return (
    <>
      <div className="adm">
        {/* Mobile overlay */}
        <div
          className={`adm__overlay ${mobileOpen ? "adm__overlay--open" : ""}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`adm__side ${collapsed ? "adm__side--collapsed" : ""} ${mobileOpen ? "adm__side--mobile-open" : ""}`}
          style={{ "--side-w": `${sideW}px` } as React.CSSProperties}
        >
          {/* Logo */}
          <div className="adm__side-logo">
            <Link href="/admin" className="adm__logo-link" onClick={() => setMobileOpen(false)}>
              <span className="adm__logo-icon">M</span>
              {!collapsed && (
                <div className="adm__logo-text">
                  <span className="adm__logo-brand">MARESAL</span>
                  <span className="adm__logo-sub">Yönetim Paneli</span>
                </div>
              )}
            </Link>
          </div>

          {/* Nav */}
          <nav className="adm__nav">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`adm__nav-link ${active ? "adm__nav-link--active" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={20} className="adm__nav-icon" />
                  {!collapsed && <span className="adm__nav-label">{item.label}</span>}
                  {item.badge && !collapsed && (
                    <span className="adm__nav-badge">{item.badge}</span>
                  )}
                  {item.badge && collapsed && <span className="adm__nav-dot" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="adm__side-bottom">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="adm__collapse-btn"
              title={collapsed ? "Genişlet" : "Daralt"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="adm__nav-link"
            >
              <ExternalLink size={20} className="adm__nav-icon" />
              {!collapsed && <span className="adm__nav-label">Siteyi Görüntüle</span>}
            </a>
          </div>
        </aside>

        {/* Main area */}
        <div className="adm__main" style={{ "--side-w": `${sideW}px` } as React.CSSProperties}>
          {/* Topbar */}
          <header className="adm__topbar">
            <div className="adm__topbar-left">
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="adm__burger"
                aria-label="Menü"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="adm__page-title">{pageTitle}</h1>
            </div>
            <div className="adm__topbar-right">
              <button className="adm__bell" title="Bildirimler">
                <Bell size={18} />
                <span className="adm__bell-dot" />
              </button>
              <div className="adm__avatar" title="Admin">A</div>
            </div>
          </header>

          {/* Content */}
          <main className="adm__content">{children}</main>
        </div>
      </div>

      <style>{`
        .adm {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg);
        }

        /* ─── Overlay ──── */
        .adm__overlay {
          position: fixed;
          inset: 0;
          z-index: 40;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .adm__overlay--open {
          opacity: 1;
          pointer-events: auto;
        }

        /* ─── Sidebar ──── */
        .adm__side {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          width: var(--side-w);
          display: flex;
          flex-direction: column;
          background: var(--color-bg-elevated);
          border-right: 1px solid var(--color-border);
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.3s cubic-bezier(0.22,1,0.36,1);
          overflow: hidden;
        }

        /* Desktop: always visible */
        @media (min-width: 768px) {
          .adm__side { transform: translateX(0); }
        }

        /* Mobile: slide in/out */
        @media (max-width: 767.98px) {
          .adm__side {
            width: 280px;
            transform: translateX(-100%);
            box-shadow: none;
          }
          .adm__side--mobile-open {
            transform: translateX(0);
            box-shadow: 16px 0 48px rgba(0,0,0,0.5);
          }
          .adm__side--collapsed { width: 280px; }
        }

        /* Logo */
        .adm__side-logo {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--color-border);
          flex-shrink: 0;
        }
        .adm__logo-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }
        .adm__logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 10px;
          background: var(--grad-accent);
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-bg);
          flex-shrink: 0;
        }
        .adm__logo-brand {
          display: block;
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--color-accent);
        }
        .adm__logo-sub {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-dim);
          margin-top: 1px;
        }

        /* Nav */
        .adm__nav {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .adm__nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--color-text-muted);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          overflow: hidden;
        }
        .adm__nav-link:hover {
          background: rgba(255,255,255,0.03);
          color: var(--color-text);
        }
        .adm__nav-link--active {
          background: var(--color-accent-dim);
          color: var(--color-accent);
        }
        .adm__nav-link--active:hover {
          background: var(--color-accent-dim);
          color: var(--color-accent);
        }
        .adm__nav-icon { flex-shrink: 0; }
        .adm__nav-label { flex: 1; }
        .adm__nav-badge {
          min-width: 20px;
          padding: 0.1rem 0.4rem;
          border-radius: 999px;
          background: var(--color-accent);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-bg);
          text-align: center;
        }
        .adm__nav-dot {
          position: absolute;
          top: 8px; right: 8px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--color-accent);
        }

        /* Sidebar bottom */
        .adm__side-bottom {
          border-top: 1px solid var(--color-border);
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-shrink: 0;
        }
        .adm__collapse-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.5rem;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-dim);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .adm__collapse-btn:hover {
          border-color: rgba(201,162,39,0.25);
          color: var(--color-accent);
        }
        @media (min-width: 768px) {
          .adm__collapse-btn { display: flex; }
        }

        /* ─── Main area ──── */
        .adm__main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          transition: margin-left 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        @media (min-width: 768px) {
          .adm__main { margin-left: var(--side-w); }
        }

        /* Topbar */
        .adm__topbar {
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          padding: 0 1.25rem;
          background: rgba(14,21,33,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--color-border);
        }
        @media (min-width: 768px) {
          .adm__topbar { padding: 0 1.75rem; }
        }
        .adm__topbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .adm__topbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .adm__burger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: background 0.15s;
        }
        .adm__burger:hover { background: rgba(255,255,255,0.04); }
        @media (min-width: 768px) {
          .adm__burger { display: none; }
        }
        .adm__page-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .adm__bell {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          background: rgba(255,255,255,0.02);
          color: var(--color-text-muted);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .adm__bell:hover {
          border-color: rgba(201,162,39,0.25);
          color: var(--color-accent);
        }
        .adm__bell-dot {
          position: absolute;
          top: 6px; right: 7px;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid var(--color-bg-elevated);
        }
        .adm__avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 50%;
          background: var(--grad-accent);
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-bg);
          cursor: pointer;
        }

        /* Content */
        .adm__content {
          flex: 1;
          padding: 1.5rem 1.25rem;
        }
        @media (min-width: 768px) {
          .adm__content { padding: 2rem 2rem; }
        }

        /* ─── Overlay mobile only ──── */
        @media (min-width: 768px) {
          .adm__overlay { display: none; }
        }
      `}</style>
    </>
  );
}
