import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type IconProps = { className?: string };

function IconShell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-[#AB4F82]", className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Nail polish bottle — thin line */
export function IconManicure({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M26 8h12v8H26z" />
      <path d="M28 16h8v4c0 1-1 2-2 2h-4c-1 0-2-1-2-2v-4z" />
      <path d="M24 22h16c1.5 0 3 1.5 3 3.5V48c0 3-2.5 5.5-5.5 5.5h-11C23.5 53.5 21 51 21 48V25.5c0-2 1.5-3.5 3-3.5z" />
      <path d="M24 34h19" />
    </IconShell>
  );
}

/** Face with spa headband / cucumber mask */
export function IconMask({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <ellipse cx="32" cy="34" rx="16" ry="18" />
      <path d="M18 24c4-8 10-11 14-11s10 3 14 11" />
      <path d="M20 22c3-2 7-3 12-3s9 1 12 3" />
      <circle cx="25" cy="34" r="4.5" />
      <circle cx="39" cy="34" r="4.5" />
      <path d="M27 44c2 2.5 5 3.5 5 3.5s3-1 5-3.5" />
    </IconShell>
  );
}

/** Flowing hairstyle swish */
export function IconHair({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M20 14c2 6 3 14 2 24" />
      <path d="M28 10c1.5 8 2 18 1 30" />
      <path d="M36 12c2 10 3 20 2 28" />
      <path d="M44 16c1 8 0 18-2 26" />
      <path d="M18 38c6 8 14 12 22 10" />
      <path d="M24 22c6-4 14-4 20 0" />
    </IconShell>
  );
}

/** Angled makeup / blush brush */
export function IconMakeup({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M40 12c4 2 8 8 8 12 0 2-1 3-3 3l-10-10c0-2 1-4 5-5z" />
      <path d="M34 18l12 12" />
      <path d="M32 20l12 12" />
      <path d="M31 22L14 48c-1 1.5 0 4 2 4.5 1.5.4 3-.5 4-2L39 28" />
    </IconShell>
  );
}

/** Magic wand + glitter sparkles */
export function IconGlitter({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M18 48L38 22" />
      <path d="M42 12l1.8 5.2L49 19l-5.2 1.8L42 26l-1.8-5.2L35 19l5.2-1.8L42 12z" />
      <path d="M50 10v5M52.5 12.5l-3.5 3.5" />
      <path d="M28 14v4M30 16h-4" />
      <path d="M48 30v3M49.5 31.5l-2 2" />
      <path d="M22 28l2 2M24 28l-2 2" />
    </IconShell>
  );
}

/** Classic oval hand mirror */
export function IconMirror({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <ellipse cx="32" cy="26" rx="14" ry="17" />
      <ellipse cx="32" cy="26" rx="10" ry="13" />
      <path d="M27 18c2-2 5-3 8-2" />
      <path d="M32 43v11" />
      <path d="M27 54h10" />
    </IconShell>
  );
}

/** Classic camera */
export function IconPhoto({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <rect x="10" y="22" width="44" height="30" rx="5" />
      <path d="M22 22V18c0-1.5 1-3 3-3h8c2 0 3 1.5 3 3v4" />
      <circle cx="32" cy="37" r="9" />
      <circle cx="32" cy="37" r="5" />
      <circle cx="46" cy="30" r="2" />
    </IconShell>
  );
}

/** Fallback sparkle */
export function IconSparkles({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M32 10l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9z" />
      <path d="M48 36l1.5 4.5L54 42l-4.5 1.5L48 48l-1.5-4.5L42 42l4.5-1.5L48 36z" />
    </IconShell>
  );
}

const ICON_MAP: Record<string, (p: IconProps) => ReactNode> = {
  manicure: IconManicure,
  mask: IconMask,
  hair: IconHair,
  makeup: IconMakeup,
  glitter: IconGlitter,
  mirror: IconMirror,
  photo: IconPhoto,
  sparkles: IconSparkles,
  decor: IconSparkles,
  robe: IconMirror,
  ribbon: IconGlitter,
  music: IconSparkles,
  champagne: IconGlitter,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Comp = ICON_MAP[name] || IconSparkles;
  return <>{Comp({ className })}</>;
}
