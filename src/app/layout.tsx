import type { Metadata, Viewport } from "next";
import { Anton, Oswald, Archivo } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";
import { Navbar } from "@/components/layout/navbar";

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
const title = "Blitz Jerseys | Football Jerseys & Kits in Zambia";
const description =
  "Buy football jerseys in Zambia: Premier League, Serie A, and LaLiga kits, delivered nationwide to Lusaka, Ndola, Kitwe, and beyond. Order in seconds, confirm on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Blitz Jerseys" },
  description,
  keywords: [
    "Blitz Jerseys",
    "blitzjerseys",
    "blitz jerseys zambia",
    "jerseys in zambia",
    "football jerseys Zambia",
    "soccer jerseys Zambia",
    "buy jerseys online Zambia",
    "jersey shop Lusaka",
    "football kits Zambia",
    "Premier League jersey Zambia",
    "LaLiga jersey Zambia",
    "Serie A jersey Zambia",
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
  verification: {
    google: "sHLBhDN28gS-jQJw_-64OvPvGh1mcRByZb9HPeJBDHU",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportingGoodsStore",
  name: "Blitz Jerseys",
  alternateName: "blitzjerseys",
  description,
  url: siteUrl,
  areaServed: {
    "@type": "Country",
    name: "Zambia",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "ZM",
  },
  sameAs: [
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_TIKTOK_URL,
    process.env.NEXT_PUBLIC_TWITTER_URL,
  ].filter(Boolean),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SiteChrome navbar={<Navbar />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
