"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createProduct(formData: FormData) {
  const teamId = formData.get("teamId") as string;
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
  const imagesJson = JSON.stringify(
    imageLines.map((src) => ({ src, alt: name }))
  );

  const sizes = formData.getAll("size") as string[];
  const stocks = formData.getAll("stock") as string[];

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error("Team not found");

  const slug = slugify(`${team.slug}-${kitType}-${season}`);

  await prisma.product.create({
    data: {
      slug,
      name,
      kitType,
      season,
      price,
      description,
      featured,
      onSale,
      imagesJson,
      teamId,
      variants: {
        create: sizes
          .map((size, i) => ({ size: size.trim(), stock: parseInt(stocks[i] ?? "10", 10) }))
          .filter((v) => v.size),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
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

  await prisma.$transaction([
    prisma.productVariant.deleteMany({ where: { productId: id } }),
    prisma.product.update({
      where: { id },
      data: {
        name,
        kitType,
        season,
        price,
        description,
        featured,
        onSale,
        imagesJson,
        variants: {
          create: sizes
            .map((size, i) => ({ size: size.trim(), stock: parseInt(stocks[i] ?? "10", 10) }))
            .filter((v) => v.size),
        },
      },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.productVariant.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function toggleFeatured(id: string, current: boolean) {
  await prisma.product.update({ where: { id }, data: { featured: !current } });
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function toggleOnSale(id: string, current: boolean) {
  await prisma.product.update({ where: { id }, data: { onSale: !current } });
  revalidatePath("/");
  revalidatePath("/promotions");
  revalidatePath("/admin/products");
}
