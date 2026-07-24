import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const formData = await request.formData();

  const name = (formData.get("name") as string).trim();
  const kitType = (formData.get("kitType") as string).trim();
  const season = (formData.get("season") as string).trim();
  const price = parseInt(formData.get("price") as string, 10);
  const description = (formData.get("description") as string).trim();
  const featured = formData.get("featured") === "on";
  const onSale = formData.get("onSale") === "on";

  const imageLines = ((formData.get("imageUrls") as string) ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const imagesJson = imageLines.length
    ? JSON.stringify(imageLines.map((src) => ({ src, alt: name })))
    : null;

  const sizes = formData.getAll("size") as string[];
  const stocks = formData.getAll("stock") as string[];
  const submittedVariants = sizes
    .map((size, i) => ({ size: size.trim(), stock: parseInt(stocks[i] ?? "10", 10) }))
    .filter((v) => v.size);

  const existingVariants = await prisma.productVariant.findMany({ where: { productId: id } });
  const submittedSizes = new Set(submittedVariants.map((v) => v.size));
  const removedVariants = existingVariants.filter((v) => !submittedSizes.has(v.size));

  await prisma.$transaction(async (tx) => {
    // Variants can't just be wiped and recreated — a size that's ever been
    // ordered has an OrderItem pointing at its row, and deleting it violates
    // that foreign key. Only remove sizes with no order history; upsert the
    // rest so existing variant IDs (and their order references) survive.
    for (const variant of removedVariants) {
      const hasOrders = await tx.orderItem.findFirst({ where: { variantId: variant.id } });
      if (!hasOrders) {
        await tx.productVariant.delete({ where: { id: variant.id } });
      }
    }

    for (const variant of submittedVariants) {
      const existing = existingVariants.find((v) => v.size === variant.size);
      if (existing) {
        await tx.productVariant.update({
          where: { id: existing.id },
          data: { stock: variant.stock },
        });
      } else {
        await tx.productVariant.create({
          data: { productId: id, size: variant.size, stock: variant.stock },
        });
      }
    }

    await tx.product.update({
      where: { id },
      data: { name, kitType, season, price, description, featured, onSale, imagesJson },
    });
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");

  return NextResponse.json({ success: true });
}
