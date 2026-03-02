"use client";

import { useState } from "react";
import { markMessageRead } from "@/lib/actions/messages";
import type { Message } from "@/lib/actions/messages";

export default function AdminMessagesClient({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");

  const filtered =
    filterRead === "all"
      ? messages
      : filterRead === "unread"
        ? messages.filter((m) => !m.read)
        : messages.filter((m) => m.read);

  const selected = messages.find((m) => m.id === selectedId) ?? null;
  const unreadCount = messages.filter((m) => !m.read).length;

  const handleMarkAsRead = async (id: string) => {
    await markMessageRead(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  const openMessage = async (msg: Message) => {
    setSelectedId(msg.id);
    if (!msg.read) await handleMarkAsRead(msg.id);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
    });

  const formatDateLong = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="am">
      <div className="am__header">
        <div>
          <h2 className="am__title">Mesajlar</h2>
          <p className="am__subtitle">
            {messages.length} mesaj · {unreadCount} okunmamış
          </p>
        </div>
        <div className="am__tabs">
          {[
            ["all", "Tümü"] as const,
            ["unread", "Okunmamış"] as const,
            ["read", "Okunmuş"] as const,
          ].map(([key, label]) => (
            <button
              key={key}
              className={`am__tab ${filterRead === key ? "am__tab--active" : ""}`}
              onClick={() => setFilterRead(key)}
            >
              {label}
              {key === "unread" && unreadCount > 0 && (
                <span className="am__tab-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="am__body">
        <div className="am__list">
          {filtered.map((msg) => (
            <button
              key={msg.id}
              type="button"
              className={`am__msg ${selectedId === msg.id ? "am__msg--active" : ""} ${!msg.read ? "am__msg--unread" : ""}`}
              onClick={() => openMessage(msg)}
            >
              <div className="am__msg-top">
                <span className="am__msg-name">{msg.name}</span>
                <span className="am__msg-date">
                  {formatDate(msg.created_at)}
                </span>
              </div>
              <span className="am__msg-subject">
                {msg.subject || "Konu belirtilmemiş"}
              </span>
              <span className="am__msg-preview">
                {msg.message.substring(0, 80)}
                {msg.message.length > 80 ? "..." : ""}
              </span>
              {!msg.read && <span className="am__msg-unread-dot" />}
            </button>
          ))}
        </div>

        <div className="am__detail">
          {selected ? (
            <>
              <div className="am__detail-head">
                <h3 className="am__detail-subject">
                  {selected.subject || "Konu belirtilmemiş"}
                </h3>
                <span className="am__detail-date">
                  {formatDateLong(selected.created_at)}
                </span>
              </div>
              <div className="am__detail-sender">
                <div className="am__detail-avatar">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <span className="am__detail-name">{selected.name}</span>
                  <span className="am__detail-email">{selected.email}</span>
                </div>
                {selected.phone && (
                  <span className="am__detail-phone">{selected.phone}</span>
                )}
              </div>
              <div className="am__detail-body">
                <p>{selected.message}</p>
              </div>
              <div className="am__detail-actions">
                <a
                  href={`mailto:${selected.email}`}
                  className="am__reply-btn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 17 4 12 9 7" />
                    <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                  </svg>
                  Yanıtla
                </a>
              </div>
            </>
          ) : (
            <div className="am__empty">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p>Görüntülemek için bir mesaj seçin</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .am { max-width: 1200px; }
        .am__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem; }
        .am__title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; }
        .am__subtitle { font-size: 0.82rem; color: var(--color-text-dim); margin: 0; }
        .am__tabs { display: flex; gap: 0.35rem; }
        .am__tab { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.9rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-pill); color: var(--color-text-muted); font-size: 0.78rem; font-weight: 500; font-family: var(--font-body); cursor: pointer; transition: all 0.2s; }
        .am__tab:hover { color: var(--color-accent); border-color: rgba(201,162,39,0.25); }
        .am__tab--active { background: var(--color-accent); color: var(--color-bg); border-color: var(--color-accent); font-weight: 700; }
        .am__tab-badge { font-size: 0.65rem; font-weight: 700; background: rgba(255,255,255,0.2); padding: 0.05rem 0.35rem; border-radius: var(--radius-pill); line-height: 1.3; }
        .am__tab--active .am__tab-badge { background: rgba(8,12,18,0.2); }
        .am__body { display: grid; grid-template-columns: 380px 1fr; gap: 0; min-height: 65vh; background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
        .am__list { border-right: 1px solid var(--color-border); overflow-y: auto; max-height: 70vh; }
        .am__msg { display: flex; flex-direction: column; gap: 0.25rem; width: 100%; padding: 1rem 1.25rem; text-align: left; background: none; border: none; border-bottom: 1px solid var(--color-border); cursor: pointer; font-family: var(--font-body); transition: background 0.15s; position: relative; }
        .am__msg:hover { background: rgba(255,255,255,0.02); }
        .am__msg--active { background: rgba(201,162,39,0.05) !important; }
        .am__msg--unread { background: rgba(59,130,246,0.03); }
        .am__msg-top { display: flex; justify-content: space-between; align-items: center; }
        .am__msg-name { font-size: 0.88rem; font-weight: 600; color: var(--color-text); }
        .am__msg--unread .am__msg-name { color: var(--color-accent); }
        .am__msg-date { font-size: 0.68rem; color: var(--color-text-dim); }
        .am__msg-subject { font-size: 0.82rem; color: var(--color-text-muted); font-weight: 500; }
        .am__msg-preview { font-size: 0.75rem; color: var(--color-text-dim); line-height: 1.4; }
        .am__msg-unread-dot { position: absolute; top: 50%; left: 6px; transform: translateY(-50%); width: 6px; height: 6px; border-radius: 50%; background: #3b82f6; }
        .am__detail { padding: 1.5rem; overflow-y: auto; }
        .am__detail-head { margin-bottom: 1.25rem; }
        .am__detail-subject { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; margin: 0 0 0.3rem; }
        .am__detail-date { font-size: 0.75rem; color: var(--color-text-dim); }
        .am__detail-sender { display: flex; align-items: center; gap: 0.85rem; padding: 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); margin-bottom: 1.5rem; }
        .am__detail-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--color-accent), var(--color-accent-lt)); color: var(--color-bg); font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .am__detail-name { display: block; font-size: 0.9rem; font-weight: 600; color: var(--color-text); }
        .am__detail-email { font-size: 0.78rem; color: var(--color-text-muted); }
        .am__detail-phone { margin-left: auto; font-size: 0.78rem; color: var(--color-text-dim); background: var(--color-bg-elevated); padding: 0.3rem 0.7rem; border-radius: var(--radius-pill); border: 1px solid var(--color-border); }
        .am__detail-body { padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); margin-bottom: 1.25rem; }
        .am__detail-body p { font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.8; margin: 0; }
        .am__detail-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
        .am__reply-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1rem; border-radius: var(--radius); font-size: 0.82rem; font-weight: 600; font-family: var(--font-body); cursor: pointer; transition: all 0.2s; text-decoration: none; background: var(--color-accent); color: var(--color-bg); border: none; }
        .am__reply-btn:hover { background: var(--color-accent-lt); }
        .am__empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--color-text-dim); gap: 0.75rem; }
        .am__empty p { font-size: 0.88rem; margin: 0; }
        @media (max-width: 900px) { .am__body { grid-template-columns: 1fr; } .am__list { max-height: 40vh; border-right: none; border-bottom: 1px solid var(--color-border); } }
      `}</style>
    </div>
  );
}
