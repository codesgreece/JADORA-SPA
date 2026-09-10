"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  formatEuro,
  formatGreekDate,
  STATUS_LABELS,
  type BookingStatus,
} from "@/lib/utils";

type Booking = {
  id: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  girlsCount: number;
  totalPrice: number;
  customer: { name: string; email: string; phone: string };
  package: { name: string };
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const q = filter ? `?status=${filter}` : "";
    fetch(`/api/bookings${q}`)
      .then((r) => r.json())
      .then(setBookings);
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-dark-berry">Κρατήσεις</h1>
          <p className="text-sm text-jadora-text/65">Διαχείριση όλων των κρατήσεων</p>
        </div>
        <select
          className="rounded-full border border-[color:var(--soft-pink)]/50 bg-white px-4 py-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Όλες</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-jadora-light/50 text-xs uppercase tracking-wide text-jadora-text/60">
              <tr>
                <th className="px-4 py-3">Ημερομηνία</th>
                <th className="px-4 py-3">Πελάτης</th>
                <th className="px-4 py-3">Πακέτο</th>
                <th className="px-4 py-3">Κατάσταση</th>
                <th className="px-4 py-3">Τιμή</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-[color:var(--soft-pink)]/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-dark-berry">
                      {formatGreekDate(b.date)}
                    </div>
                    <div className="text-xs text-jadora-text/55">{b.timeSlot}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{b.customer.name}</div>
                    <div className="text-xs text-jadora-text/55">{b.customer.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {b.package.name}
                    <div className="text-xs text-jadora-text/55">
                      {b.girlsCount} κορίτσια
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] status-${b.status}`}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatEuro(b.totalPrice)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/bookings/${b.id}`} className="text-mauve">
                      Λεπτομέρειες →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
