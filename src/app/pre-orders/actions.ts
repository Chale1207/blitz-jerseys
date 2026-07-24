"use server";

import { prisma } from "@/lib/prisma";
import { getPreOrderKit } from "@/lib/pre-order-kits";

function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `BJ-PO-${dateStr}-${rand}`;
}

export async function submitPreOrder(params: {
  customerName: string;
  whatsapp: string;
  kitId: string;
  size: string;
  sleeveType: string;
  quantity: number;
  notes?: string;
}): Promise<{ success: true; orderNumber: string } | { success: false; error: string }> {
  const kit = await getPreOrderKit(params.kitId);
  if (!kit) return { success: false, error: "Invalid kit selection." };
  if (kit.status === "notify") return { success: false, error: "This kit is not yet available for pre-order." };
  if (!params.customerName.trim()) return { success: false, error: "Name is required." };
  if (!params.whatsapp.trim()) return { success: false, error: "WhatsApp number is required." };
  if (!params.size) return { success: false, error: "Please select a size." };

  const orderNumber = generateOrderNumber();

  await prisma.preOrder.create({
    data: {
      orderNumber,
      customerName: params.customerName.trim(),
      whatsapp: params.whatsapp.trim(),
      kitId: params.kitId,
      kitName: kit.fullName,
      size: params.size,
      sleeveType: params.sleeveType,
      quantity: params.quantity,
      notes: params.notes?.trim() || null,
      status: "pending",
    },
  });

  return { success: true, orderNumber };
}

export async function submitNotifyMe(params: {
  customerName: string;
  whatsapp: string;
  kitId: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  const kit = await getPreOrderKit(params.kitId);
  if (!kit) return { success: false, error: "Invalid kit selection." };
  if (!params.customerName.trim()) return { success: false, error: "Name is required." };
  if (!params.whatsapp.trim()) return { success: false, error: "WhatsApp number is required." };

  const orderNumber = generateOrderNumber().replace("BJ-PO-", "BJ-WL-");

  await prisma.preOrder.create({
    data: {
      orderNumber,
      customerName: params.customerName.trim(),
      whatsapp: params.whatsapp.trim(),
      kitId: params.kitId,
      kitName: kit.fullName,
      size: "N/A",
      sleeveType: "short",
      quantity: 1,
      notes: "Notify-me signup — kit not yet confirmed.",
      status: "waitlist",
    },
  });

  return { success: true };
}
