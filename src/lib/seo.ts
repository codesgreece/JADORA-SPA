import type { Metadata } from "next";

/** Canonical production origin — no trailing slash */
export const SITE_URL = "https://jadoragirlspa.gr";

export const SITE_NAME = "J’ADORA Luxury Girls Spa Parties";

export const DEFAULT_TITLE =
  "J’ADORA Girls Spa Parties | Παιδικά Spa Party στην Αθήνα";

export const DEFAULT_DESCRIPTION =
  "Girls Spa Parties στην Αθήνα για μοναδικά παιδικά πάρτι. Μανικιούρ, glitter, χτενίσματα, παιδικό μακιγιάζ και θεματικά spa party πακέτα για αξέχαστες στιγμές.";

export const OG_IMAGE_PATH = "/hero-spa.jpg";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = OG_IMAGE_PATH,
  noIndex = false,
}: BuildMetadataInput = {}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    keywords: [
      "Girls Spa Party Αθήνα",
      "παιδικό spa party Αθήνα",
      "παιδικά πάρτι",
      "spa party για κορίτσια",
      "παιδικό πάρτι ομορφιάς",
      "J’ADORA",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "el_GR",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1221,
          height: 1600,
          alt: "J’ADORA Girls Spa Party — κορίτσια σε ροζ ρόμπες σε παιδικό spa party στην Αθήνα",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

type JsonLdContent = Record<string, string>;

type JsonLdPackage = {
  name: string;
  description: string;
  price: number;
  maxGirls: number;
  durationHrs: number;
};

type JsonLdService = {
  name: string;
  description: string;
};

/** Build Schema.org graph from real on-page content only (no invented ratings/hours). */
export function buildHomeJsonLd(input: {
  content: JsonLdContent;
  packages: JsonLdPackage[];
  services: JsonLdService[];
}) {
  const { content, packages, services } = input;
  const description =
    content.seoDescription?.trim() || DEFAULT_DESCRIPTION;
  const email = content.contactEmail?.trim() || undefined;
  const telephone = content.contactPhone?.trim() || undefined;
  const addressText = content.contactAddress?.trim() || undefined;
  const sameAs = [
    content.socialInstagram,
    content.socialFacebook,
  ].filter((u): u is string => Boolean(u?.startsWith("http")));

  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const businessId = `${SITE_URL}/#localbusiness`;

  const address = addressText
    ? {
        "@type": "PostalAddress",
        addressLocality: addressText.includes("Αθήνα")
          ? "Αθήνα"
          : addressText,
        addressCountry: "GR",
      }
    : undefined;

  const localBusiness = {
    "@type": "LocalBusiness",
    "@id": businessId,
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl(OG_IMAGE_PATH),
    description,
    ...(email ? { email } : {}),
    ...(telephone ? { telephone } : {}),
    ...(address ? { address } : {}),
    areaServed: {
      "@type": "City",
      name: "Athens",
      alternateName: "Αθήνα",
    },
    ...(sameAs.length ? { sameAs } : {}),
    priceRange: packages.length ? "€€" : undefined,
  };

  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl(OG_IMAGE_PATH),
    ...(email ? { email } : {}),
    ...(telephone ? { telephone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: SITE_URL,
    name: SITE_NAME,
    description,
    inLanguage: "el-GR",
    publisher: { "@id": organizationId },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: content.seoTitle?.trim() || DEFAULT_TITLE,
    description,
    isPartOf: { "@id": websiteId },
    about: { "@id": businessId },
    inLanguage: "el-GR",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(OG_IMAGE_PATH),
    },
  };

  const serviceNodes = services
    .filter((s) => s.name)
    .slice(0, 20)
    .map((s) => ({
      "@type": "Service",
      name: s.name,
      description: s.description || undefined,
      provider: { "@id": businessId },
      areaServed: {
        "@type": "City",
        name: "Athens",
        alternateName: "Αθήνα",
      },
    }));

  const offerCatalog =
    packages.length > 0
      ? {
          "@type": "OfferCatalog",
          name: content.packagesTitle || "Πακέτα & Τιμές",
          itemListElement: packages.map((pkg, index) => ({
            "@type": "Offer",
            position: index + 1,
            name: pkg.name,
            description:
              pkg.description ||
              `Έως ${pkg.maxGirls} κορίτσια · ${pkg.durationHrs} ώρες`,
            price: pkg.price,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/#packages`,
            itemOffered: {
              "@type": "Service",
              name: pkg.name,
              provider: { "@id": businessId },
            },
          })),
        }
      : null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      website,
      webPage,
      localBusiness,
      ...serviceNodes,
      ...(offerCatalog ? [offerCatalog] : []),
    ],
  };
}
