import type { Metadata } from "next";
import { Playfair_Display, Jost, Great_Vibes } from "next/font/google";
import "./globals.css";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  buildPageMetadata,
} from "@/lib/seo";
import { getSiteContentMap } from "@/lib/content";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getSiteContentMap();
    const rawTitle = content.seoTitle?.trim();
    const rawDescription = content.seoDescription?.trim();
    const title =
      !rawTitle || rawTitle === "J’ADORA | Luxury Girls Spa Parties"
        ? DEFAULT_TITLE
        : rawTitle;
    const description =
      !rawDescription ||
      rawDescription ===
        "Παιδικά spa parties για κορίτσια από 4 ετών. Boutique εμπειρίες ομορφιάς, δημιουργικότητας και χαμόγελου."
        ? DEFAULT_DESCRIPTION
        : rawDescription;

    return {
      metadataBase: new URL(SITE_URL),
      ...buildPageMetadata({ title, description, path: "/" }),
      title: {
        default: title,
        template: `%s | ${SITE_NAME}`,
      },
    };
  } catch {
    return {
      metadataBase: new URL(SITE_URL),
      ...buildPageMetadata(),
      title: {
        default: DEFAULT_TITLE,
        template: `%s | ${SITE_NAME}`,
      },
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el-GR">
      <body
        className={`${playfair.variable} ${jost.variable} ${greatVibes.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
