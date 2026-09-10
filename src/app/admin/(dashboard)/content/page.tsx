"use client";

import { useEffect, useState } from "react";

const FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "brandName", label: "Brand name" },
  { key: "brandTagline", label: "Tagline" },
  { key: "brandByline", label: "Byline" },
  { key: "heroTitle", label: "Hero title", multiline: true },
  { key: "heroDescription", label: "Hero / About description", multiline: true },
  { key: "heroCta", label: "Hero CTA" },
  { key: "bookingTitle", label: "Booking title" },
  { key: "bookingSubtitle", label: "Booking subtitle" },
  { key: "vibeText", label: "Vibe text" },
  { key: "servicesTitle", label: "Services title" },
  { key: "packagesTitle", label: "Packages title" },
  { key: "galleryTitle", label: "Gallery title" },
  { key: "aboutTitle", label: "About title" },
  { key: "contactTitle", label: "Contact title" },
  { key: "contactEmail", label: "Contact email" },
  { key: "contactPhone", label: "Contact phone" },
  { key: "contactAddress", label: "Contact address" },
  { key: "socialInstagram", label: "Instagram URL" },
  { key: "socialFacebook", label: "Facebook URL" },
  { key: "ctaBook", label: "Book CTA" },
  { key: "footerText", label: "Footer text" },
  { key: "seoTitle", label: "SEO title" },
  { key: "seoDescription", label: "SEO description", multiline: true },
];

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then(setContent);
  }, []);

  const save = async () => {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setMessage(res.ok ? "Αποθηκεύτηκε επιτυχώς." : "Σφάλμα αποθήκευσης");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-dark-berry">Περιεχόμενο Site</h1>
          <p className="text-sm text-jadora-text/65">
            Επεξεργασία κειμένων χωρίς αλλαγή κώδικα
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={save}>
          Αποθήκευση όλων
        </button>
      </div>
      {message && <p className="text-sm text-mauve">{message}</p>}

      <div className="grid gap-4">
        {FIELDS.map((field) => (
          <label key={field.key} className="card-soft block p-4 text-sm">
            <span className="mb-1 block font-medium text-dark-berry">
              {field.label}
            </span>
            {field.multiline ? (
              <textarea
                className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2"
                rows={field.key === "heroDescription" ? 8 : 3}
                value={content[field.key] || ""}
                onChange={(e) =>
                  setContent({ ...content, [field.key]: e.target.value })
                }
              />
            ) : (
              <input
                className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2"
                value={content[field.key] || ""}
                onChange={(e) =>
                  setContent({ ...content, [field.key]: e.target.value })
                }
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
