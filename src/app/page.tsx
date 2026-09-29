import { getPublicData } from "@/lib/content";
import { Header } from "@/components/public/Header";
import { Hero } from "@/components/public/Hero";
import { FeatureBar } from "@/components/public/FeatureBar";
import { ServicesSection } from "@/components/public/ServicesSection";
import { PackagesSection } from "@/components/public/PackagesSection";
import { PartnersSection } from "@/components/public/PartnersSection";
import { GallerySection } from "@/components/public/GallerySection";
import { AboutContact } from "@/components/public/AboutContact";
import { Footer } from "@/components/public/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  buildHomeJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let content: Record<string, string> = {};
  let packages: Awaited<ReturnType<typeof getPublicData>>["packages"] = [];
  let services: Awaited<ReturnType<typeof getPublicData>>["services"] = [];
  let gallery: Awaited<ReturnType<typeof getPublicData>>["gallery"] = [];

  try {
    const data = await getPublicData();
    content = data.content;
    packages = data.packages;
    services = data.services;
    gallery = data.gallery;
  } catch (err) {
    console.error("Failed to load public data:", err);
  }

  // Prefer curated SEO defaults when CMS still has the short seed strings
  if (
    !content.seoTitle ||
    content.seoTitle === "J’ADORA | Luxury Girls Spa Parties"
  ) {
    content = { ...content, seoTitle: DEFAULT_TITLE };
  }
  if (
    !content.seoDescription ||
    content.seoDescription ===
      "Παιδικά spa parties για κορίτσια από 4 ετών. Boutique εμπειρίες ομορφιάς, δημιουργικότητας και χαμόγελου."
  ) {
    content = { ...content, seoDescription: DEFAULT_DESCRIPTION };
  }

  const jsonLd = buildHomeJsonLd({
    content,
    packages: packages.map((p) => ({
      name: p.name,
      description: p.description,
      price: p.price,
      maxGirls: p.maxGirls,
      durationHrs: p.durationHrs,
    })),
    services: services.map((s) => ({
      name: s.title,
      description: s.description,
    })),
  });

  return (
    <main className="relative min-h-screen bg-pearl">
      <JsonLd data={jsonLd} />
      <Header content={content} />
      <Hero content={content} />
      <FeatureBar vibeText={content.vibeText} />
      <ServicesSection title={content.servicesTitle} services={services} />
      <PackagesSection
        title={content.packagesTitle}
        packages={packages}
        extrasTitle={content.extrasTitle}
      />
      <PartnersSection title={content.partnersTitle} />
      <GallerySection title={content.galleryTitle} images={gallery} />
      <AboutContact content={content} />
      <Footer content={content} />
    </main>
  );
}
