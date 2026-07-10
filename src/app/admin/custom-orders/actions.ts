"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function revalidateAll() {
  revalidatePath("/admin/custom-orders");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/products");
}

export async function updateCustomOrderStatus(id: string, status: string) {
  await prisma.customOrder.update({ where: { id }, data: { status } });
  revalidateAll();
}

export async function deleteCustomOrder(id: string) {
  await prisma.customOrder.delete({ where: { id } });
  revalidateAll();
}

export async function setCustomOrderPrice(id: string, totalPrice: number | null) {
  if (totalPrice !== null && (!Number.isFinite(totalPrice) || totalPrice < 0)) {
    throw new Error("Enter a valid price.");
  }
  await prisma.customOrder.update({ where: { id }, data: { totalPrice } });
  revalidateAll();
}

// Assigns an already-stocked variant to a custom order (e.g. client only
// needed a name/number printed on a jersey we already carry). Decrements
// stock the same way a normal checkout would, inside a transaction so a
// concurrent admin action can't oversell the same units.
export async function assignStockToCustomOrder(customOrderId: string, variantId: string) {
  await prisma.$transaction(async (tx) => {
    const customOrder = await tx.customOrder.findUnique({ where: { id: customOrderId } });
    if (!customOrder) throw new Error("Custom order not found.");

    const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new Error("Product variant not found.");
    if (variant.stock < customOrder.quantity) {
      throw new Error(`Only ${variant.stock} left in stock for that size.`);
    }

    await tx.productVariant.update({
      where: { id: variantId },
      data: { stock: variant.stock - customOrder.quantity },
    });

    await tx.customOrder.update({
      where: { id: customOrderId },
      data: { assignedVariantId: variantId, status: "assigned" },
    });
  });

  revalidateAll();
}

// Reverts an assignment — restores the stock and clears the link, in case
// the admin picked the wrong item.
export async function unassignStockFromCustomOrder(customOrderId: string) {
  await prisma.$transaction(async (tx) => {
    const customOrder = await tx.customOrder.findUnique({ where: { id: customOrderId } });
    if (!customOrder?.assignedVariantId) return;

    const variant = await tx.productVariant.findUnique({
      where: { id: customOrder.assignedVariantId },
    });
    if (variant) {
      await tx.productVariant.update({
        where: { id: variant.id },
        data: { stock: variant.stock + customOrder.quantity },
      });
    }

    await tx.customOrder.update({
      where: { id: customOrderId },
      data: { assignedVariantId: null, status: "confirmed" },
    });
  });

  revalidateAll();
}
