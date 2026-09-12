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

  return (
    <main className="relative min-h-screen bg-pearl">
      <Header content={content} />
      <Hero content={content} packages={packages} />
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
