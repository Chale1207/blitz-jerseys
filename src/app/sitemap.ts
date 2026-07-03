import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blitzjerseys.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, leagues] = await Promise.all([
    prisma.product.findMany({ select: { slug: true } }),
    prisma.league.findMany({ select: { slug: true } }),
  ]);

  const staticRoutes = ["", "/shop", "/about", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const leagueRoutes = leagues.map((league) => ({
    url: `${siteUrl}/shop/${league.slug}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...leagueRoutes, ...productRoutes];
}
