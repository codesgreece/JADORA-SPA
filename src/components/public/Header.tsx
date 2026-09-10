"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type Props = {
  content: Record<string, string>;
};

const links = [
  { href: "#home", key: "navHome", fallback: "Αρχική" },
  { href: "#services", key: "navServices", fallback: "Υπηρεσίες" },
  { href: "#packages", key: "navPackages", fallback: "Πακέτα" },
  { href: "#booking", key: "navCalendar", fallback: "Ημερολόγιο" },
  { href: "#about", key: "navAbout", fallback: "Σχετικά" },
  { href: "#contact", key: "navContact", fallback: "Επικοινωνία" },
];

export function Header({ content }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-4">
        <Link href="/" className="relative z-10 shrink-0" aria-label="J’ADORA Home">
          <Image
            src="/logo.png"
            alt="J’ADORA Luxury Girls Spa Parties by jo"
            width={512}
            height={512}
            className="h-[72px] w-[72px] object-contain md:h-[88px] md:w-[88px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-dark-berry transition hover:text-mauve"
            >
              {content[l.key] || l.fallback}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#booking" className="btn-primary hidden text-sm sm:inline-flex">
            {content.ctaBook || "Κράτηση τώρα ♡"}
          </a>
          <button
            type="button"
            className="rounded-full p-2 text-dark-berry lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[color:var(--soft-pink)]/40 bg-pearl px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-dark-berry"
                onClick={() => setOpen(false)}
              >
                {content[l.key] || l.fallback}
              </a>
            ))}
            <a
              href="#booking"
              className="btn-primary mt-2 text-center text-sm"
              onClick={() => setOpen(false)}
            >
              {content.ctaBook || "Κράτηση τώρα ♡"}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
