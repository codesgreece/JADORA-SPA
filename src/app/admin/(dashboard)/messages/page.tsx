"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, Phone, Trash2, CheckCheck, Circle } from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === "unread") return messages.filter((m) => !m.read);
    return messages;
  }, [messages, filter]);

  const selected =
    filtered.find((m) => m.id === selectedId) ||
    messages.find((m) => m.id === selectedId) ||
    filtered[0] ||
    null;

  useEffect(() => {
    if (selected && selectedId !== selected.id) {
      setSelectedId(selected.id);
    }
  }, [selected, selectedId]);

  const markRead = async (id: string, read: boolean) => {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Διαγραφή μηνύματος;")) return;
    await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    if (selectedId === id) setSelectedId(null);
    await load();
  };

  const openMessage = async (m: Message) => {
    setSelectedId(m.id);
    if (!m.read) await markRead(m.id, true);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-dark-berry">Μηνύματα</h1>
          <p className="text-sm text-jadora-text/65">
            Εισερχόμενα από τη φόρμα επικοινωνίας του site
            {unreadCount > 0 ? ` · ${unreadCount} μη αναγνωσμένα` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-2 text-sm ${
              filter === "all"
                ? "bg-mauve text-white"
                : "border border-mauve/30 text-mauve"
            }`}
          >
            Όλα ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`rounded-full px-4 py-2 text-sm ${
              filter === "unread"
                ? "bg-mauve text-white"
                : "border border-mauve/30 text-mauve"
            }`}
          >
            Μη αναγνωσμένα ({unreadCount})
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-jadora-text/55">Φόρτωση...</p>
      ) : messages.length === 0 ? (
        <div className="card-soft p-8 text-center text-sm text-jadora-text/65">
          Δεν υπάρχουν ακόμα μηνύματα από τη φόρμα επικοινωνίας.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="card-soft overflow-hidden">
            <div className="max-h-[70vh] overflow-y-auto divide-y divide-[color:var(--soft-pink)]/30">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => openMessage(m)}
                  className={`block w-full px-4 py-3 text-left transition hover:bg-jadora-light/50 ${
                    selected?.id === m.id ? "bg-jadora-light/70" : ""
                  } ${!m.read ? "bg-jadora-light/30" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-dark-berry">
                        {!m.read && (
                          <Circle
                            size={8}
                            className="mr-1.5 inline fill-mauve text-mauve"
                          />
                        )}
                        {m.name}
                      </p>
                      <p className="truncate text-xs text-jadora-text/55">
                        {m.subject || "Χωρίς θέμα"}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-jadora-text/45">
                      {new Date(m.createdAt).toLocaleDateString("el-GR")}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-jadora-text/70">
                    {m.body}
                  </p>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="p-4 text-sm text-jadora-text/55">
                  Δεν υπάρχουν μη αναγνωσμένα.
                </p>
              )}
            </div>
          </div>

          <div className="card-soft p-5 md:p-6">
            {selected ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-jadora-text/45">
                      {new Date(selected.createdAt).toLocaleString("el-GR")}
                    </p>
                    <h2 className="mt-1 font-serif text-2xl text-dark-berry">
                      {selected.subject || "Χωρίς θέμα"}
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-mauve/30 px-3 py-1.5 text-xs text-mauve"
                      onClick={() => markRead(selected.id, !selected.read)}
                    >
                      <CheckCheck size={14} />
                      {selected.read ? "Μη αναγνωσμένο" : "Αναγνώστηκε"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-deep-rose/40 px-3 py-1.5 text-xs text-deep-rose"
                      onClick={() => remove(selected.id)}
                    >
                      <Trash2 size={14} />
                      Διαγραφή
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-jadora-light/50 p-4 text-sm">
                  <p className="font-medium text-dark-berry">{selected.name}</p>
                  <p className="mt-2 flex items-center gap-2 text-jadora-text/80">
                    <Mail size={14} className="text-mauve" />
                    <a
                      href={`mailto:${selected.email}`}
                      className="hover:text-mauve"
                    >
                      {selected.email}
                    </a>
                  </p>
                  {selected.phone ? (
                    <p className="mt-1 flex items-center gap-2 text-jadora-text/80">
                      <Phone size={14} className="text-mauve" />
                      <a
                        href={`tel:${selected.phone}`}
                        className="hover:text-mauve"
                      >
                        {selected.phone}
                      </a>
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-jadora-text/45">
                      Χωρίς τηλέφωνο
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-[color:var(--soft-pink)]/40 p-4 text-sm leading-relaxed text-jadora-text/85 whitespace-pre-wrap">
                  {selected.body}
                </div>
              </div>
            ) : (
              <p className="text-sm text-jadora-text/55">
                Επίλεξε ένα μήνυμα από τη λίστα.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
