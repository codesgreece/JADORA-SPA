import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Only real public canonical URLs.
 * The marketing site is a single-page experience at `/`
 * (services, packages, about, contact are in-page sections).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
