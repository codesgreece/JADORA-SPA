import { ServiceIcon } from "./ServiceIcon";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const showcaseIcons = [
  "manicure",
  "mask",
  "hair",
  "makeup",
  "glitter",
  "mirror",
  "photo",
];

export function ServicesSection({
  title,
  services,
}: {
  title?: string;
  services: Service[];
}) {
  const showcase = showcaseIcons
    .map((icon) => services.find((s) => s.icon === icon))
    .filter(Boolean) as Service[];

  const display =
    showcase.length >= 5
      ? showcase.slice(0, 7)
      : services.slice(0, 7);

  return (
    <section id="services" className="relative mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="max-w-3xl">
        <h2 className="section-title">{title || "Οι υπηρεσίες μας"}</h2>
        <div className="heart-divider">
          <span>♡</span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {display.map((service) => (
          <div
            key={service.id}
            className="group flex flex-col items-center text-center"
          >
            <div className="mb-3 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[color:var(--light)] text-mauve shadow-[var(--shadow-soft)] transition group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-card)]">
              <ServiceIcon name={service.icon} className="h-9 w-9" />
            </div>
            <p className="text-sm leading-snug text-jadora-text">
              {service.title}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <a
          href="#all-services"
          className="text-sm text-mauve transition hover:text-dark-berry"
        >
          Δες όλες τις παροχές →
        </a>
      </div>

      <div id="all-services" className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={`full-${service.id}`}
            className="card-soft flex gap-4 p-5 transition hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-jadora-light text-mauve">
              <ServiceIcon name={service.icon} className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-dark-berry">{service.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-jadora-text/75">
                {service.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
