"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  _count: { bookings: number };
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const load = () =>
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then(setCustomers);

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-dark-berry">Πελάτες</h1>
        <p className="text-sm text-jadora-text/65">Καρτέλες πελατών και ιστορικό</p>
      </div>

      <div className="card-soft overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-jadora-light/50 text-xs uppercase tracking-wide text-jadora-text/60">
            <tr>
              <th className="px-4 py-3">Όνομα</th>
              <th className="px-4 py-3">Επικοινωνία</th>
              <th className="px-4 py-3">Κρατήσεις</th>
              <th className="px-4 py-3">Σημειώσεις</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-[color:var(--soft-pink)]/30">
                <td className="px-4 py-3 font-medium text-dark-berry">{c.name}</td>
                <td className="px-4 py-3">
                  <div>{c.email}</div>
                  <div className="text-xs text-jadora-text/55">{c.phone}</div>
                </td>
                <td className="px-4 py-3">{c._count.bookings}</td>
                <td className="px-4 py-3">
                  <input
                    className="w-full rounded-lg border border-[color:var(--soft-pink)]/40 px-2 py-1 text-sm"
                    defaultValue={c.notes}
                    onBlur={async (e) => {
                      await fetch("/api/admin/customers", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: c.id,
                          name: c.name,
                          phone: c.phone,
                          notes: e.target.value,
                        }),
                      });
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
