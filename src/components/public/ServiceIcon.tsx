import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const paths: Record<string, ReactNode> = {
  manicure: (
    <>
      <path d="M9 3v10a3 3 0 1 0 6 0V3" />
      <path d="M9 7h6" />
      <path d="M12 16v5" />
    </>
  ),
  mask: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M8 13c.8 1.2 1.8 2 4 2s3.2-.8 4-2" />
      <circle cx="9" cy="10" r="0.8" fill="currentColor" />
      <circle cx="15" cy="10" r="0.8" fill="currentColor" />
    </>
  ),
  hair: (
    <>
      <path d="M6 18c2-6 4-10 6-12 2 2 4 6 6 12" />
      <path d="M8 14c1.5-2 2.5-3 4-4 1.5 1 2.5 2 4 4" />
    </>
  ),
  makeup: (
    <>
      <path d="M7 20l3-10 7 7-10 3z" />
      <path d="M14 7l3 3" />
      <circle cx="17.5" cy="5.5" r="1.5" />
    </>
  ),
  glitter: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  mirror: (
    <>
      <ellipse cx="12" cy="10" rx="5" ry="7" />
      <path d="M12 17v4M9 21h6" />
    </>
  ),
  photo: (
    <>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M8 6l1.5-2h5L16 6" />
    </>
  ),
  decor: (
    <>
      <path d="M12 4c3 3 6 6 6 10a6 6 0 1 1-12 0c0-4 3-7 6-10z" />
    </>
  ),
  robe: (
    <>
      <path d="M8 4c0 2 1.5 3 4 3s4-1 4-3" />
      <path d="M8 4l-3 16h14L16 4" />
      <path d="M12 7v13" />
    </>
  ),
  ribbon: (
    <>
      <path d="M12 12c-4-4-7-2-7 1s3 4 7 1c4 3 7 2 7-1s-3-5-7-1z" />
      <path d="M12 12v8" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="16" r="2" />
    </>
  ),
  champagne: (
    <>
      <path d="M9 3h6l-1 8a3 3 0 1 1-4 0L9 3z" />
      <path d="M12 14v6M9 20h6" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </>
  ),
};

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden
    >
      {paths[name] || paths.sparkles}
    </svg>
  );
}
