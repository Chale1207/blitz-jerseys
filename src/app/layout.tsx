import type { Metadata, Viewport } from "next";
import { Anton, Oswald, Archivo } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blitzjerseys.com";
const title = "Blitz Jerseys | Premier League, Serie A & LaLiga Kits";
const description =
  "Match-night performance jerseys for the Premier League, Serie A, and LaLiga's biggest clubs. Order in seconds, confirm on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Blitz Jerseys" },
  description,
  keywords: [
    "football jerseys",
    "soccer kits",
    "Premier League jersey",
    "LaLiga jersey",
    "Serie A jersey",
    "Blitz Jerseys",
  ],
  openGraph: {
    title,
    description,
    siteName: "Blitz Jerseys",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b1211",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${oswald.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
