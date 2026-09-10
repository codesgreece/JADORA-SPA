const PARTNERS = [
  {
    name: "Τέλης Κικέρης",
    location: "Γλυφάδα",
    note: "Συνεργάτης ομορφιάς",
  },
  {
    name: "Νυχομανία",
    location: "Πειραιάς",
    note: "Nail art & περιποίηση",
  },
  {
    name: "Eternal Passion",
    location: "Κερατσίνι",
    note: "Beauty studio",
  },
  {
    name: "Belisse",
    location: "Περιστέρι",
    note: "Beauty & style",
  },
  {
    name: "Wow the Beauty Project",
    location: "Σε όλη την Αττική",
    note: "Mobile beauty experiences",
  },
] as const;

export function PartnersSection({ title }: { title?: string }) {
  return (
    <section
      id="partners"
      className="relative mx-auto max-w-7xl px-4 py-12 md:px-8"
    >
      <div className="text-center">
        <h2 className="section-title">{title || "Οι συνεργάτες μας"}</h2>
        <div className="heart-divider mx-auto justify-center">
          <span>♡</span>
        </div>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-jadora-text/70">
          Επιλεγμένα beauty studios και επαγγελματίες με τους οποίους δημιουργούμε
          μοναδικές Girls Spa Party εμπειρίες.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.map((partner) => (
          <article
            key={partner.name}
            className="group relative overflow-hidden rounded-[20px] border border-[color:var(--gold)]/40 bg-white px-6 py-7 text-center shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
          >
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full font-serif text-xl text-mauve"
              style={{ background: "#FCE0E8" }}
              aria-hidden
            >
              {partner.name.charAt(0)}
            </div>
            <h3
              className="font-serif text-xl leading-snug"
              style={{ color: "#542D3D" }}
            >
              {partner.name}
            </h3>
            <p className="mt-2 text-sm font-medium tracking-wide text-mauve">
              {partner.location}
            </p>
            <p className="mt-2 text-xs text-jadora-text/55">{partner.note}</p>
            <div className="mt-4 text-mauve opacity-60 transition group-hover:opacity-100">
              ♡
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
