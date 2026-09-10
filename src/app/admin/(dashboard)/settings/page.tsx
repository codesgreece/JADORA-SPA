"use client";

import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-dark-berry">Ρυθμίσεις</h1>
        <p className="text-sm text-jadora-text/65">
          Γενικές ρυθμίσεις λογαριασμού admin
        </p>
      </div>

      <div className="card-soft p-5 text-sm text-jadora-text/75">
        <h2 className="mb-2 font-serif text-xl text-dark-berry">Μηνύματα</h2>
        <p>
          Τα μηνύματα από τη φόρμα επικοινωνίας εμφανίζονται στη σελίδα{" "}
          <Link href="/admin/messages" className="text-mauve underline">
            Μηνύματα
          </Link>
          .
        </p>
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
