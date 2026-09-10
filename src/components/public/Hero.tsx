"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { BookingWidget } from "@/components/booking/BookingWidget";

type Package = {
  id: string;
  name: string;
  maxGirls: number;
  durationHrs: number;
  price: number;
  featured: boolean;
};

type Props = {
  content: Record<string, string>;
  packages: Package[];
};

export function Hero({ content, packages }: Props) {
  const titleLines = (content.heroTitle || "").split("\n").filter(Boolean);
  const paragraphs = (content.heroDescription || "")
    .split(/\n\n+/)
    .filter(Boolean)
    .slice(0, 2);

  return (
    <section id="home" className="relative overflow-hidden pb-8 pt-2 md:pb-12">
      <Image
        src="/floral-right.svg"
        alt=""
        width={420}
        height={520}
        className="floral-bg right-0 top-0 hidden w-[280px] md:block lg:w-[360px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-8 px-4 md:px-8 lg:grid-cols-[1.05fr_1fr_0.95fr] lg:gap-6">
        <div className="fade-in max-w-xl pt-4 lg:pt-8">
          <h1 className="font-serif text-[1.85rem] leading-[1.25] text-dark-berry md:text-[2.35rem] lg:text-[2.55rem]">
            {titleLines.map((line) => (
              <span key={line} className="block italic">
                {line}
              </span>
            ))}
          </h1>
          <div className="my-4 text-mauve">
            <Heart size={16} className="fill-mauve/30" />
          </div>
          <div className="space-y-3 text-[0.92rem] leading-relaxed text-jadora-text/85 md:text-[0.95rem]">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <a href="#about" className="btn-primary mt-6 text-sm">
            {content.heroCta || "Μάθε περισσότερα →"}
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-md image-reveal lg:max-w-none lg:pt-4">
          <div className="torn-edge relative overflow-hidden rounded-[2rem]">
            <Image
              src="/hero-spa.jpg"
              alt="J’ADORA Girls Spa Party"
              width={640}
              height={720}
              className="h-auto w-full object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-x-6 bottom-8 text-center">
              <div
                className="font-script text-2xl text-white drop-shadow md:text-3xl"
                style={{ textShadow: "0 0 12px #db55a9, 0 0 24px #ab4f82" }}
              >
                Girls Spa Party ♡
              </div>
            </div>
          </div>
        </div>

        <div id="booking" className="soft-scale lg:pt-2">
          <BookingWidget
            packages={packages}
            title={content.bookingTitle}
            subtitle={content.bookingSubtitle}
          />
        </div>
      </div>
    </section>
  );
}
