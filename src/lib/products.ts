import { prisma } from "@/lib/prisma";

export type ProductFilters = {
  leagueSlug?: string;
  teamSlug?: string;
  kitType?: string;
};

export function getProducts(filters: ProductFilters = {}) {
  return prisma.product.findMany({
    where: {
      kitType: filters.kitType,
      team: {
        slug: filters.teamSlug,
        league: filters.leagueSlug ? { slug: filters.leagueSlug } : undefined,
      },
    },
    include: { team: { include: { league: true } }, variants: true },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });
}

export function getFeaturedProducts(take = 4) {
  return prisma.product.findMany({
    where: { featured: true },
    include: { team: { include: { league: true } }, variants: true },
    take,
  });
}

export function getPromoProducts() {
  return prisma.product.findMany({
    where: { onSale: true },
    include: { team: { include: { league: true } }, variants: true },
    orderBy: { createdAt: "asc" },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { team: { include: { league: true } }, variants: true },
  });
}

export async function getDistinctKitTypes(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    distinct: ["kitType"],
    select: { kitType: true },
    orderBy: { kitType: "asc" },
  });
  return rows.map((r) => r.kitType);
}

export function getLeaguesWithTeams() {
  return prisma.league.findMany({
    orderBy: { name: "asc" },
    include: { teams: { orderBy: { name: "asc" } } },
  });
}

export function getLeagueBySlug(slug: string) {
  return prisma.league.findUnique({ where: { slug } });
}

export function totalStock(variants: { stock: number }[]): number {
  return variants.reduce((sum, v) => sum + v.stock, 0);
}
