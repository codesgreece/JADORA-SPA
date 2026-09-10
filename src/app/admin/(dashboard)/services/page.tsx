"use client";

import { useEffect, useState } from "react";
import { ServiceIcon } from "@/components/public/ServiceIcon";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  active: boolean;
  sortOrder: number;
};

const icons = [
  "manicure",
  "mask",
  "hair",
  "makeup",
  "glitter",
  "mirror",
  "photo",
  "decor",
  "robe",
  "ribbon",
  "music",
  "champagne",
  "sparkles",
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "sparkles",
    active: true,
    sortOrder: 0,
  });
  const [editing, setEditing] = useState<string | null>(null);

  const load = () =>
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then(setServices);

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (editing) {
      await fetch(`/api/admin/services/${editing}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setEditing(null);
    setForm({
      title: "",
      description: "",
      icon: "sparkles",
      active: true,
      sortOrder: 0,
    });
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = services.findIndex((s) => s.id === id);
    const swap = idx + dir;
    if (swap < 0 || swap >= services.length) return;
    const next = [...services];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    const order = next.map((s, i) => ({ id: s.id, sortOrder: i + 1 }));
    await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-dark-berry">Υπηρεσίες</h1>
        <p className="text-sm text-jadora-text/65">
          Προσθήκη, επεξεργασία και αναδιάταξη υπηρεσιών
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.id} className="card-soft flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-jadora-light text-mauve">
                <ServiceIcon name={s.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-dark-berry">
                  {s.title} {!s.active && <span className="text-xs opacity-50">(off)</span>}
                </p>
                <p className="truncate text-xs text-jadora-text/60">{s.description}</p>
              </div>
              <div className="flex gap-1 text-xs">
                <button type="button" onClick={() => move(s.id, -1)}>
                  ↑
                </button>
                <button type="button" onClick={() => move(s.id, 1)}>
                  ↓
                </button>
                <button
                  type="button"
                  className="text-mauve"
                  onClick={() => {
                    setEditing(s.id);
                    setForm({
                      title: s.title,
                      description: s.description,
                      icon: s.icon,
                      active: s.active,
                      sortOrder: s.sortOrder,
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-deep-rose"
                  onClick={async () => {
                    if (!confirm("Διαγραφή;")) return;
                    await fetch(`/api/admin/services/${s.id}`, {
                      method: "DELETE",
                    });
                    load();
                  }}
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card-soft space-y-3 p-5">
          <h2 className="font-serif text-xl text-dark-berry">
            {editing ? "Επεξεργασία" : "Νέα υπηρεσία"}
          </h2>
          <input
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2 text-sm"
            placeholder="Τίτλος"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2 text-sm"
            rows={3}
            placeholder="Περιγραφή"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2 text-sm"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          >
            {icons.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Ενεργή
          </label>
          <button type="button" className="btn-primary" onClick={save}>
            Αποθήκευση
          </button>
        </div>
      </div>
    </div>
  );
}
