"use client";

import { useEffect, useState } from "react";

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

export default function AdminSettingsPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const load = () =>
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then(setMessages);

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-dark-berry">Ρυθμίσεις</h1>
        <p className="text-sm text-jadora-text/65">
          Μηνύματα επικοινωνίας και γενικές ρυθμίσεις
        </p>
      </div>

      <div id="messages" className="card-soft p-5">
        <h2 className="mb-4 font-serif text-xl text-dark-berry">Μηνύματα</h2>
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-4 ${
                m.read
                  ? "border-[color:var(--soft-pink)]/30"
                  : "border-mauve/40 bg-jadora-light/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-dark-berry">
                    {m.name} · {m.email}
                  </p>
                  <p className="text-xs text-jadora-text/55">
                    {m.subject || "Χωρίς θέμα"} ·{" "}
                    {new Date(m.createdAt).toLocaleString("el-GR")}
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    className="text-mauve"
                    onClick={async () => {
                      await fetch("/api/admin/messages", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: m.id, read: !m.read }),
                      });
                      load();
                    }}
                  >
                    {m.read ? "Unread" : "Mark read"}
                  </button>
                  <button
                    type="button"
                    className="text-deep-rose"
                    onClick={async () => {
                      await fetch(`/api/admin/messages?id=${m.id}`, {
                        method: "DELETE",
                      });
                      load();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-jadora-text/80">{m.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-soft p-5 text-sm text-jadora-text/75">
        <h2 className="mb-2 font-serif text-xl text-dark-berry">Λογαριασμός</h2>
        <p>
          Admin login: χρησιμοποιεί τα credentials από το περιβάλλον (
          <code>ADMIN_EMAIL</code> / <code>ADMIN_PASSWORD</code>).
        </p>
        <p className="mt-2">
          Default: <strong>admin@jadora.gr</strong> / <strong>jadora2026</strong>
        </p>
      </div>
    </div>
  );
}
