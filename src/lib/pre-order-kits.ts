import { prisma } from "@/lib/prisma";

export type PreOrderKitStatus = "open" | "coming-soon" | "notify";

export type PreOrderKit = {
  id: string;
  club: string;
  kitName: string;
  fullName: string;
  images: string[];
  defaultImageIndex: number;
  price: number;
  status: PreOrderKitStatus;
  demandPercent: number;
};

function parseKit(row: {
  id: string;
  club: string;
  kitName: string;
  fullName: string;
  imagesJson: string;
  defaultImageIndex: number;
  price: number;
  status: string;
  demandPercent: number;
}): PreOrderKit {
  return {
    id: row.id,
    club: row.club,
    kitName: row.kitName,
    fullName: row.fullName,
    images: JSON.parse(row.imagesJson) as string[],
    defaultImageIndex: row.defaultImageIndex,
    price: row.price,
    status: row.status as PreOrderKitStatus,
    demandPercent: row.demandPercent,
  };
}

export async function getAllPreOrderKits(): Promise<PreOrderKit[]> {
  const rows = await prisma.preOrderKit.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(parseKit);
}

export async function getPreOrderKit(id: string): Promise<PreOrderKit | undefined> {
  const row = await prisma.preOrderKit.findUnique({ where: { id } });
  return row ? parseKit(row) : undefined;
}
