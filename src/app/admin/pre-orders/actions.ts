"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updatePreOrderStatus(id: string, status: string) {
  await prisma.preOrder.update({ where: { id }, data: { status } });
  revalidatePath("/admin/pre-orders");
}

export async function deletePreOrder(id: string) {
  await prisma.preOrder.delete({ where: { id } });
  revalidatePath("/admin/pre-orders");
}
