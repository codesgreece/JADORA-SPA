"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BOOKING_STATUSES,
  STATUS_LABELS,
  formatEuro,
  formatGreekDate,
  type BookingStatus,
} from "@/lib/utils";

type Booking = {
  id: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  girlsCount: number;
  totalPrice: number;
  adminNotes: string;
  customerNotes: string;
  packageId: string;
  customer: { name: string; email: string; phone: string; notes: string };
  package: { id: string; name: string };
};

type Package = { id: string; name: string; price: number };

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [form, setForm] = useState({
    status: "pending" as BookingStatus,
    date: "",
    timeSlot: "",
    packageId: "",
    girlsCount: 1,
    adminNotes: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then((b) => {
        setBooking(b);
        setForm({
          status: b.status,
          date: b.date,
          timeSlot: b.timeSlot,
          packageId: b.packageId,
          girlsCount: b.girlsCount,
          adminNotes: b.adminNotes || "",
        });
      });
    fetch("/api/admin/packages")
      .then((r) => r.json())
      .then(setPackages);
  }, [id]);

  const save = async () => {
    setMessage("");
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Σφάλμα");
      return;
    }
    setBooking(data);
    setMessage("Αποθηκεύτηκε επιτυχώς.");
  };

  const remove = async () => {
    if (!confirm("Διαγραφή κράτησης;")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    router.push("/admin/bookings");
  };

  if (!booking) return <p>Φόρτωση...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-dark-berry">Λεπτομέρειες κράτησης</h1>
        <p className="text-sm text-jadora-text/65">
          {formatGreekDate(booking.date)} · {booking.timeSlot}
        </p>
      </div>

      <div className="card-soft space-y-4 p-6">
        <div className="rounded-2xl bg-jadora-light/50 p-4 text-sm">
          <p className="font-medium text-dark-berry">{booking.customer.name}</p>
          <p>{booking.customer.email}</p>
          <p>{booking.customer.phone}</p>
          {booking.customerNotes && (
            <p className="mt-2 text-jadora-text/70">Σχόλιο: {booking.customerNotes}</p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Κατάσταση
            <select
              className="mt-1 w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as BookingStatus })
              }
            >
              {BOOKING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Πακέτο
            <select
              className="mt-1 w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2"
              value={form.packageId}
              onChange={(e) => setForm({ ...form, packageId: e.target.value })}
            >
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({formatEuro(p.price)})
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Ημερομηνία
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Ώρα
            <input
              className="mt-1 w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2"
              value={form.timeSlot}
              onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Κορίτσια
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2"
              value={form.girlsCount}
              onChange={(e) =>
                setForm({ ...form, girlsCount: Number(e.target.value) })
              }
            />
          </label>
        </div>

        <label className="block text-sm">
          Εσωτερικές σημειώσεις admin
          <textarea
            className="mt-1 w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2"
            rows={4}
            value={form.adminNotes}
            onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
          />
        </label>

        {message && <p className="text-sm text-mauve">{message}</p>}

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={save}>
            Αποθήκευση
          </button>
          <button
            type="button"
            className="rounded-full border border-deep-rose/40 px-4 py-2 text-sm text-deep-rose"
            onClick={remove}
          >
            Διαγραφή
          </button>
        </div>
      </div>
    </div>
  );
}
