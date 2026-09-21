import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

/** Renders local, remote, blob, and data-URL gallery images safely. */
export function GalleryImage({ src, alt, width, height, className }: Props) {
  const isData = src.startsWith("data:");
  const isRemote = src.startsWith("http://") || src.startsWith("https://");

  if (isData) {
    return (
      // next/image cannot optimize data URLs
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={isRemote}
    />
  );
}
