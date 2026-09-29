"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

type Props = {
  content: Record<string, string>;
};

export function Hero({ content }: Props) {
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

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
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
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#about" className="btn-primary text-sm">
              {content.heroCta || "Μάθε περισσότερα →"}
            </a>
            <a href="#contact" className="btn-primary text-sm">
              Επικοινωνία ♡
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md image-reveal lg:max-w-lg lg:justify-self-end">
          <div className="torn-edge relative overflow-hidden rounded-[2rem]">
            <Image
              src="/hero-spa.jpg"
              alt="J’ADORA Girls Spa Party"
              width={1221}
              height={1600}
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
      </div>
    </section>
  );
}
