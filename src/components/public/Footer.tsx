import Image from "next/image";
import Link from "next/link";

export function Footer({ content }: { content: Record<string, string> }) {
  return (
    <footer className="relative mt-8 border-t border-[color:var(--soft-pink)]/40 bg-white/60">
      <Image
        src="/floral-left.svg"
        alt=""
        width={240}
        height={300}
        className="floral-bg bottom-0 left-0 w-40 opacity-40"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center md:px-8">
        <div className="font-serif text-2xl text-dark-berry">
          {content.brandName || "J’ADORA"}
        </div>
        <p className="text-sm uppercase tracking-[0.2em] text-jadora-text/60">
          {content.brandTagline || "Luxury Girls Spa Parties"}
        </p>
        <div className="flex gap-4 text-sm text-mauve">
          {content.socialInstagram && (
            <a href={content.socialInstagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
          {content.socialFacebook && (
            <a href={content.socialFacebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          )}
          <Link href="/admin/login" className="text-jadora-text/40 hover:text-mauve">
            Admin
          </Link>
        </div>
        <p className="text-xs text-jadora-text/55">
          {content.footerText ||
            "© J’ADORA Luxury Girls Spa Parties — Με αγάπη, by Jo"}
        </p>
      </div>
    </footer>
  );
}
