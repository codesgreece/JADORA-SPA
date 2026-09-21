"use client";

import { useEffect, useState } from "react";
import { GalleryImage } from "@/components/GalleryImage";

type ImageItem = {
  id: string;
  url: string;
  caption: string;
  active: boolean;
  sortOrder: number;
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = () =>
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then(setImages);

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    if (!file || uploading) return;
    setMessage("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("caption", caption);
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.error || "Σφάλμα ανεβάσματος");
        return;
      }
      setFile(null);
      setCaption("");
      setMessage("Ανέβηκε επιτυχώς και θα εμφανιστεί στο site.");
      load();
    } catch {
      setMessage("Σφάλμα ανεβάσματος. Δοκιμάστε ξανά.");
    } finally {
      setUploading(false);
    }
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = images.findIndex((i) => i.id === id);
    const swap = idx + dir;
    if (swap < 0 || swap >= images.length) return;
    const next = [...images];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    await fetch("/api/admin/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: next.map((img, i) => ({ id: img.id, sortOrder: i + 1 })),
      }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-dark-berry">Φωτογραφίες</h1>
        <p className="text-sm text-jadora-text/65">Gallery διαχείριση</p>
      </div>

      <div className="card-soft space-y-3 p-5">
        <h2 className="font-serif text-xl text-dark-berry">Ανέβασμα</h2>
        <p className="text-xs text-jadora-text/60">
          JPG, PNG, WEBP ή GIF — έως 2.5MB ανά φωτογραφία.
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <input
          className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2 text-sm"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button
          type="button"
          className="btn-primary disabled:opacity-60"
          onClick={upload}
          disabled={!file || uploading}
        >
          {uploading ? "Ανέβασμα..." : "Upload"}
        </button>
        {message && <p className="text-sm text-mauve">{message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <div key={img.id} className="card-soft overflow-hidden">
            <GalleryImage
              src={img.url}
              alt={img.caption}
              width={600}
              height={400}
              className="h-48 w-full object-cover"
            />
            <div className="space-y-2 p-3">
              <input
                className="w-full rounded-lg border border-[color:var(--soft-pink)]/40 px-2 py-1 text-sm"
                value={img.caption}
                onChange={async (e) => {
                  const caption = e.target.value;
                  setImages((prev) =>
                    prev.map((i) =>
                      i.id === img.id ? { ...i, caption } : i
                    )
                  );
                }}
                onBlur={async (e) => {
                  await fetch(`/api/admin/gallery/${img.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ caption: e.target.value }),
                  });
                }}
              />
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={img.active}
                    onChange={async (e) => {
                      await fetch(`/api/admin/gallery/${img.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ active: e.target.checked }),
                      });
                      load();
                    }}
                  />
                  Ενεργή
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => move(img.id, -1)}>
                    ↑
                  </button>
                  <button type="button" onClick={() => move(img.id, 1)}>
                    ↓
                  </button>
                  <button
                    type="button"
                    className="text-deep-rose"
                    onClick={async () => {
                      if (!confirm("Διαγραφή;")) return;
                      await fetch(`/api/admin/gallery/${img.id}`, {
                        method: "DELETE",
                      });
                      load();
                    }}
                  >
                    Διαγραφή
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
