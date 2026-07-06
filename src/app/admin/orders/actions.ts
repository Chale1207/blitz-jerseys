"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(id: string, status: string) {
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}

export async function deleteOrder(id: string) {
  await prisma.orderItem.deleteMany({ where: { orderId: id } });
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}
