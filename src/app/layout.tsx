import type { Metadata } from "next";
import { Playfair_Display, Jost, Great_Vibes } from "next/font/google";
import "./globals.css";
import { getSiteContentMap } from "@/lib/content";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getSiteContentMap();
    return {
      title: content.seoTitle || "J’ADORA | Luxury Girls Spa Parties",
      description:
        content.seoDescription ||
        "Παιδικά spa parties για κορίτσια από 4 ετών.",
    };
  } catch {
    return {
      title: "J’ADORA | Luxury Girls Spa Parties",
      description: "Παιδικά spa parties για κορίτσια από 4 ετών.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body
        className={`${playfair.variable} ${jost.variable} ${greatVibes.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
