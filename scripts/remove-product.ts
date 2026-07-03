import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const tursoUrl = process.env.TURSO_DATABASE_URL;
if (!tursoUrl) {
  console.error("TURSO_DATABASE_URL is not set.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaLibSQL(
    createClient({ url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN })
  ),
});

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: tsx scripts/remove-product.ts <product-slug>");
  process.exit(1);
}

async function main() {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: { include: { orderItems: true } } },
  });

  if (!product) {
    console.log(`No product found with slug "${slug}" — nothing to do.`);
    return;
  }

  const orderCount = product.variants.reduce((sum, v) => sum + v.orderItems.length, 0);
  if (orderCount > 0) {
    console.error(
      `Refusing to delete: ${orderCount} order item(s) reference this product's variants. ` +
        `Investigate before removing.`
    );
    process.exit(1);
  }

  await prisma.productVariant.deleteMany({ where: { productId: product.id } });
  await prisma.product.delete({ where: { id: product.id } });
  console.log(`Deleted product "${product.name}" (${slug}) and its variants.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
