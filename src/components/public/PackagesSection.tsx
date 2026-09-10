import { Heart } from "lucide-react";
import { formatEuro, cn } from "@/lib/utils";

type Package = {
  id: string;
  name: string;
  maxGirls: number;
  durationHrs: number;
  price: number;
  description: string;
  featured: boolean;
};

export const PACKAGE_EXTRAS = [
  {
    id: "lunch-boxes",
    title: "Ατομικά lunch boxes",
    description: "Προσωπικά lunch boxes για κάθε παιδί του party.",
  },
  {
    id: "pro-photos",
    title: "Επαγγελματική φωτογράφιση + άλμπουμ",
    description: "Επαγγελματική φωτογράφιση και δώρο άλμπουμ 20 φωτογραφιών.",
  },
  {
    id: "candy-bar",
    title: "Candy bar",
    description: "Candy bar με cake pops και θεματικά μπισκότα.",
  },
  {
    id: "boys-activity",
    title: "Δημιουργική απασχόληση για αγόρια",
    description: "Δημιουργική απασχόληση για τα αγόρια του party.",
  },
] as const;

export function PackagesSection({
  title,
  packages,
  extrasTitle,
}: {
  title?: string;
  packages: Package[];
  extrasTitle?: string;
}) {
  return (
    <section id="packages" className="relative mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="text-center">
        <h2 className="section-title">{title || "Πακέτα & Τιμές"}</h2>
        <div className="heart-divider mx-auto justify-center">
          <span>♡</span>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
        {packages.map((pkg) => (
          <article
            key={pkg.id}
            className={cn(
              "relative flex flex-col items-center rounded-[20px] border bg-white px-6 py-8 text-center shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]",
              pkg.featured
                ? "border-[color:var(--dark-berry)]/40 scale-[1.02] shadow-[var(--shadow-card)]"
                : "border-[color:var(--gold)]/50"
            )}
          >
            {pkg.featured && (
              <span className="absolute -top-3 rounded-full bg-dark-berry px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                Πιο δημοφιλές
              </span>
            )}
            <p className="text-sm text-jadora-text">Έως {pkg.maxGirls} κορίτσια</p>
            <p className="mt-1 text-sm text-jadora-text/70">{pkg.durationHrs} ώρες</p>
            <p className="mt-5 font-serif text-4xl text-dark-berry">
              {formatEuro(pkg.price)}
            </p>
            {pkg.description && (
              <p className="mt-3 text-sm leading-relaxed text-jadora-text/65">
                {pkg.description}
              </p>
            )}
            <Heart size={18} className="mt-6 text-mauve" strokeWidth={1.5} />
            <a href="#booking" className="btn-primary mt-5 text-sm">
              Κράτηση
            </a>
          </article>
        ))}
      </div>

      <div id="extras" className="mx-auto mt-14 max-w-5xl">
        <div className="text-center">
          <h3 className="font-serif text-2xl text-dark-berry md:text-[1.75rem]">
            {extrasTitle || "Extras / Έξτρα υπηρεσίες"}
          </h3>
          <div className="heart-divider mx-auto justify-center">
            <span>♡</span>
          </div>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-jadora-text/70">
            Προαιρετικές προσθήκες που ανεβάζουν το κόστος του πακέτου.
            Η τελική τιμή είναι{" "}
            <span className="font-medium text-mauve">κατόπιν συνεννόησης</span>.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PACKAGE_EXTRAS.map((extra) => (
            <article
              key={extra.id}
              className="rounded-[20px] border border-[color:var(--soft-pink)]/50 bg-white px-5 py-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4
                    className="font-medium leading-snug"
                    style={{ color: "#542D3D" }}
                  >
                    {extra.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-jadora-text/70">
                    {extra.description}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-jadora-light px-3 py-1 text-[11px] font-medium text-mauve">
                  Κατόπιν συνεννόησης
                </span>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-jadora-text/60">
          Μπορείς να ζητήσεις extras κατά την κράτηση ή μέσω{" "}
          <a href="#contact" className="text-mauve hover:underline">
            επικοινωνίας
          </a>
          .
        </p>
      </div>
    </section>
  );
}
