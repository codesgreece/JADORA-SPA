import Image from "next/image";

type ImageItem = {
  id: string;
  url: string;
  caption: string;
};

export function GallerySection({
  title,
  images,
}: {
  title?: string;
  images: ImageItem[];
}) {
  return (
    <section id="gallery" className="relative mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="text-center">
        <h2 className="section-title">{title || "Στιγμές J’ADORA"}</h2>
        <div className="heart-divider mx-auto justify-center">
          <span>♡</span>
        </div>
      </div>

      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((img, i) => (
          <figure
            key={img.id}
            className="gallery-item mb-4 break-inside-avoid overflow-hidden rounded-[20px] shadow-[var(--shadow-soft)]"
          >
            <Image
              src={img.url}
              alt={img.caption || "J’ADORA gallery"}
              width={800}
              height={i % 3 === 0 ? 1000 : 800}
              className="h-auto w-full object-cover"
            />
            {img.caption && (
              <figcaption className="bg-white px-4 py-3 text-sm text-jadora-text/75">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
