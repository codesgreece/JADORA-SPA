import { ServiceIcon } from "./ServiceIcon";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const SHOWCASE_ORDER = [
  "manicure",
  "mask",
  "hair",
  "makeup",
  "glitter",
  "mirror",
  "photo",
] as const;

/** Labels matching the mockup / design reference */
const SHOWCASE_LABELS: Record<string, string> = {
  manicure: "Μανικιούρ",
  mask: "Μάσκα προσώπου",
  hair: "Λαμπερά χτενίσματα",
  makeup: "Απαλό παιδικό μακιγιάζ",
  glitter: "Glitter bar",
  mirror: "Καθρεφτάκια-δώρο",
  photo: "Photo corner + props",
};

export function ServicesSection({
  title,
  services,
}: {
  title?: string;
  services: Service[];
}) {
  const byIcon = Object.fromEntries(services.map((s) => [s.icon, s]));

  const display = SHOWCASE_ORDER.map((icon) => {
    const service = byIcon[icon];
    return {
      id: service?.id || icon,
      icon,
      title: SHOWCASE_LABELS[icon],
      description: service?.description || "",
    };
  });

  return (
    <section
      id="services"
      className="relative mx-auto max-w-7xl px-4 py-12 md:px-8"
    >
      <div className="max-w-3xl">
        <h2 className="section-title">{title || "Οι υπηρεσίες μας"}</h2>
        <div className="heart-divider">
          <span>♡</span>
        </div>
      </div>

      {/* Showcase: 2-col mobile, 7-col desktop — large soft circles */}
      <div className="mt-6 grid grid-cols-2 justify-items-center gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-7 lg:gap-x-3 lg:gap-y-8">
        {display.map((service) => (
          <div
            key={service.id}
            className="group flex w-full max-w-[188px] flex-col items-center text-center"
          >
            <div
              className="service-icon-circle mb-4 flex aspect-square w-full items-center justify-center rounded-full transition duration-300 group-hover:-translate-y-1"
              style={{
                background: "#FCE0E8",
                boxShadow: "0 6px 20px rgba(171, 79, 130, 0.06)",
              }}
            >
              <ServiceIcon
                name={service.icon}
                className="h-[36%] w-[36%]"
              />
            </div>
            <p
              className="max-w-[11rem] text-[0.95rem] font-medium leading-snug tracking-[-0.01em]"
              style={{ color: "#542D3D" }}
            >
              {service.title}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-right">
        <a
          href="#all-services"
          className="text-sm text-mauve transition hover:text-dark-berry"
        >
          Δες όλες τις παροχές →
        </a>
      </div>

      <div
        id="all-services"
        className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((service) => (
          <article
            key={`full-${service.id}`}
            className="card-soft flex gap-4 p-5 transition hover:-translate-y-0.5"
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
              style={{ background: "#FCE0E8" }}
            >
              <ServiceIcon name={service.icon} className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-medium" style={{ color: "#542D3D" }}>
                {service.title}
              </h3>
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
