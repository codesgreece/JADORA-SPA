"use client";

import { useState } from "react";

export function AboutContact({ content }: { content: Record<string, string> }) {
  const paragraphs = (content.heroDescription || "").split(/\n\n+/).filter(Boolean);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    body: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Σφάλμα αποστολής");
      setStatus("done");
      setForm({ name: "", email: "", phone: "", subject: "", body: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Σφάλμα");
    }
  };

  return (
    <>
      <section id="about" className="relative mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">
              {content.aboutTitle || "Σχετικά με εμάς"}
            </h2>
            <div className="heart-divider">
              <span>♡</span>
            </div>
            <div className="space-y-4 text-[0.95rem] leading-relaxed text-jadora-text/85">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
            </div>
          </div>

          <div id="contact" className="card-soft p-6 md:p-8">
            <h2 className="section-title text-[1.75rem]">
              {content.contactTitle || "Επικοινωνία"}
            </h2>
            <div className="mt-4 space-y-1 text-sm text-jadora-text/80">
              <p>{content.contactEmail}</p>
              <p>{content.contactPhone}</p>
              <p>{content.contactAddress}</p>
            </div>

            {status === "done" ? (
              <p className="mt-6 rounded-2xl bg-jadora-light/70 p-4 text-sm text-dark-berry">
                Το μήνυμά σου στάλθηκε! Θα επικοινωνήσουμε σύντομα ♡
              </p>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-3">
                <input
                  required
                  className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2.5 text-sm outline-none focus:border-mauve"
                  placeholder="Όνομα *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  required
                  type="email"
                  className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2.5 text-sm outline-none focus:border-mauve"
                  placeholder="Email *"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2.5 text-sm outline-none focus:border-mauve"
                  placeholder="Τηλέφωνο"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <input
                  className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2.5 text-sm outline-none focus:border-mauve"
                  placeholder="Θέμα"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                />
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2.5 text-sm outline-none focus:border-mauve"
                  placeholder="Μήνυμα *"
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                />
                {error && <p className="text-sm text-deep-rose">{error}</p>}
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Αποστολή..." : "Αποστολή μηνύματος"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
