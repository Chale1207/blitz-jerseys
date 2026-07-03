import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const prisma = tursoUrl
  ? new PrismaClient({
      adapter: new PrismaLibSQL(
        createClient({ url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN })
      ),
    })
  : new PrismaClient();

const SEASON = "2026/27";
const PRICE = 350;

type SeedProduct = {
  kitLabel: string; // e.g. "Home Kit", "Home Kit (Polo)", "Training Kit"
  stockByS: Record<"XS" | "S" | "M" | "L" | "XL" | "XXL", number>;
  featured?: boolean;
};

type SeedTeam = {
  slug: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  products: SeedProduct[];
};

type SeedLeague = {
  slug: string;
  name: string;
  country: string;
  teams: SeedTeam[];
};

const LEAGUES: SeedLeague[] = [
  {
    slug: "premier-league",
    name: "Premier League",
    country: "England",
    teams: [
      {
        slug: "arsenal",
        name: "Arsenal",
        shortName: "ARS",
        primaryColor: "#EF0107",
        secondaryColor: "#FFFFFF",
        products: [
          {
            kitLabel: "Home Kit",
            stockByS: { XS: 0, S: 1, M: 2, L: 2, XL: 0, XXL: 0 },
            featured: true,
          },
        ],
      },
      {
        slug: "chelsea",
        name: "Chelsea",
        shortName: "CHE",
        primaryColor: "#034694",
        secondaryColor: "#FDB913",
        products: [
          { kitLabel: "Home Kit (Polo)", stockByS: { XS: 0, S: 1, M: 1, L: 1, XL: 0, XXL: 0 } },
        ],
      },
      {
        slug: "manchester-united",
        name: "Manchester United",
        shortName: "MUN",
        primaryColor: "#DA291C",
        secondaryColor: "#FFFFFF",
        products: [
          {
            kitLabel: "Home Kit",
            stockByS: { XS: 0, S: 1, M: 3, L: 3, XL: 0, XXL: 0 },
            featured: true,
          },
        ],
      },
      {
        slug: "liverpool",
        name: "Liverpool",
        shortName: "LIV",
        primaryColor: "#C8102E",
        secondaryColor: "#FFFFFF",
        products: [
          { kitLabel: "Home Kit", stockByS: { XS: 0, S: 0, M: 2, L: 2, XL: 0, XXL: 0 } },
        ],
      },
    ],
  },
  {
    slug: "serie-a",
    name: "Serie A",
    country: "Italy",
    teams: [],
  },
  {
    slug: "la-liga",
    name: "LaLiga",
    country: "Spain",
    teams: [
      {
        slug: "barcelona",
        name: "Barcelona",
        shortName: "BAR",
        primaryColor: "#A50044",
        secondaryColor: "#004D98",
        products: [
          {
            kitLabel: "Home Kit",
            stockByS: { XS: 0, S: 1, M: 1, L: 1, XL: 0, XXL: 2 },
            featured: true,
          },
        ],
      },
      {
        slug: "real-madrid",
        name: "Real Madrid",
        shortName: "RMA",
        primaryColor: "#FFFFFF",
        secondaryColor: "#5F259F",
        products: [
          {
            kitLabel: "Home Kit",
            stockByS: { XS: 0, S: 1, M: 2, L: 2, XL: 2, XXL: 0 },
            featured: true,
          },
        ],
      },
    ],
  },
];

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.team.deleteMany();
  await prisma.league.deleteMany();

  for (const league of LEAGUES) {
    const createdLeague = await prisma.league.create({
      data: { slug: league.slug, name: league.name, country: league.country },
    });

    for (const team of league.teams) {
      const createdTeam = await prisma.team.create({
        data: {
          slug: team.slug,
          name: team.name,
          shortName: team.shortName,
          primaryColor: team.primaryColor,
          secondaryColor: team.secondaryColor,
          leagueId: createdLeague.id,
        },
      });

      for (const item of team.products) {
        const product = await prisma.product.create({
          data: {
            slug: `${team.slug}-${slugify(item.kitLabel)}-${SEASON.replace("/", "-")}`,
            name: item.kitLabel,
            kitType: item.kitLabel,
            season: SEASON,
            price: PRICE,
            description: `${item.kitLabel} for ${team.name}, ${SEASON} season. Breathable performance fabric built for match day and street wear alike.`,
            featured: Boolean(item.featured),
            teamId: createdTeam.id,
          },
        });

        await prisma.productVariant.createMany({
          data: (Object.entries(item.stockByS) as [string, number][]).map(([size, stock]) => ({
            size,
            stock,
            productId: product.id,
          })),
        });
      }
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
