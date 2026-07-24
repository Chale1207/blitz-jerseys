const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const KITS = [
  {
    club: "Chelsea FC",
    kitName: "2026/27 Away Kit",
    fullName: "Chelsea FC 2026/27 Away Kit",
    imagesJson: JSON.stringify([
      "/images/pre-orders/chelsea-away-1-v2.jpg",
      "/images/pre-orders/chelsea-away-2-v2.jpg",
    ]),
    defaultImageIndex: 0,
    price: 850,
    status: "open",
    demandPercent: 73,
  },
  {
    club: "Manchester United",
    kitName: "2026/27 Away Kit",
    fullName: "Manchester United 2026/27 Away Kit",
    imagesJson: JSON.stringify([
      "/images/pre-orders/man-utd-away-1-v2.jpg",
      "/images/pre-orders/man-utd-away-2-v2.jpg",
    ]),
    defaultImageIndex: 1,
    price: 850,
    status: "open",
    demandPercent: 41,
  },
  {
    club: "Real Madrid",
    kitName: "2026/27 Away Kit",
    fullName: "Real Madrid 2026/27 Away Kit",
    imagesJson: JSON.stringify([
      "/images/pre-orders/real-madrid-away-1-v2.jpg",
      "/images/pre-orders/real-madrid-away-2-v2.jpg",
    ]),
    defaultImageIndex: 0,
    price: 850,
    status: "open",
    demandPercent: 29,
  },
  {
    club: "FC Barcelona",
    kitName: "2026/27 Away Kit",
    fullName: "FC Barcelona 2026/27 Away Kit",
    imagesJson: JSON.stringify([
      "/images/pre-orders/barcelona-away-1-v2.jpg",
      "/images/pre-orders/barcelona-away-2-v2.jpg",
    ]),
    defaultImageIndex: 0,
    price: 850,
    status: "notify",
    demandPercent: 0,
  },
];

async function main() {
  const existing = await prisma.preOrderKit.count();
  if (existing > 0) {
    console.log(`PreOrderKit already has ${existing} rows — skipping seed.`);
    return;
  }
  for (const kit of KITS) {
    await prisma.preOrderKit.create({ data: kit });
  }
  console.log(`Seeded ${KITS.length} pre-order kits.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
