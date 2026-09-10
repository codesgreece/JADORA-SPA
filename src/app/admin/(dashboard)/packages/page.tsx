"use client";

import { useEffect, useState } from "react";
import { formatEuro } from "@/lib/utils";

type Package = {
  id: string;
  name: string;
  maxGirls: number;
  durationHrs: number;
  price: number;
  description: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

const empty: Omit<Package, "id"> = {
  name: "",
  maxGirls: 8,
  durationHrs: 2,
  price: 220,
  description: "",
  featured: false,
  active: true,
  sortOrder: 0,
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = () =>
    fetch("/api/admin/packages")
      .then((r) => r.json())
      .then(setPackages);

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setMessage("");
    if (editing) {
      await fetch(`/api/admin/packages/${editing}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm(empty);
    setEditing(null);
    setMessage("Αποθηκεύτηκε.");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Διαγραφή πακέτου;")) return;
    await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-dark-berry">Πακέτα & Τιμές</h1>
        <p className="text-sm text-jadora-text/65">Δημιουργία και επεξεργασία πακέτων</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="card-soft p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-dark-berry">
                    {pkg.name}{" "}
                    {pkg.featured && (
                      <span className="text-xs text-glam">· δημοφιλές</span>
                    )}
                    {!pkg.active && (
                      <span className="text-xs text-jadora-text/45">· ανενεργό</span>
                    )}
                  </p>
                  <p className="text-sm text-jadora-text/70">
                    Έως {pkg.maxGirls} · {pkg.durationHrs}ώ · {formatEuro(pkg.price)}
                  </p>
                </div>
                <div className="flex gap-2 text-sm">
                  <button
                    type="button"
                    className="text-mauve"
                    onClick={() => {
                      setEditing(pkg.id);
                      setForm({
                        name: pkg.name,
                        maxGirls: pkg.maxGirls,
                        durationHrs: pkg.durationHrs,
                        price: pkg.price,
                        description: pkg.description,
                        featured: pkg.featured,
                        active: pkg.active,
                        sortOrder: pkg.sortOrder,
                      });
                    }}
                  >
                    Επεξεργασία
                  </button>
                  <button
                    type="button"
                    className="text-deep-rose"
                    onClick={() => remove(pkg.id)}
                  >
                    Διαγραφή
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-soft space-y-3 p-5">
          <h2 className="font-serif text-xl text-dark-berry">
            {editing ? "Επεξεργασία" : "Νέο πακέτο"}
          </h2>
          <input
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2 text-sm"
            placeholder="Όνομα"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              className="rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2 text-sm"
              placeholder="Κορίτσια"
              value={form.maxGirls}
              onChange={(e) =>
                setForm({ ...form, maxGirls: Number(e.target.value) })
              }
            />
            <input
              type="number"
              className="rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2 text-sm"
              placeholder="Ώρες"
              value={form.durationHrs}
              onChange={(e) =>
                setForm({ ...form, durationHrs: Number(e.target.value) })
              }
            />
            <input
              type="number"
              className="rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2 text-sm"
              placeholder="Τιμή"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </div>
          <textarea
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2 text-sm"
            rows={3}
            placeholder="Περιγραφή"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Δημοφιλές / Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Ενεργό
          </label>
          <div className="flex gap-2">
            <button type="button" className="btn-primary" onClick={save}>
              Αποθήκευση
            </button>
            {editing && (
              <button
                type="button"
                className="rounded-full border border-mauve/30 px-4 py-2 text-sm"
                onClick={() => {
                  setEditing(null);
                  setForm(empty);
                }}
              >
                Ακύρωση
              </button>
            )}
          </div>
          {message && <p className="text-sm text-mauve">{message}</p>}
        </div>
      </div>
    </div>
  );
}
