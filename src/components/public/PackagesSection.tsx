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

export function PackagesSection({
  title,
  packages,
}: {
  title?: string;
  packages: Package[];
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
            <Heart
              size={18}
              className="mt-6 text-mauve"
              strokeWidth={1.5}
            />
            <a href="#booking" className="btn-primary mt-5 text-sm">
              Κράτηση
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
