"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/format";

const customOrderSchema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name"),
  whatsapp: z.string().trim().min(7, "Enter a valid WhatsApp number"),
  club: z.string().trim().min(2, "Enter a club or team"),
  kitDescription: z.string().trim().min(2, "Enter kit details"),
  size: z.string().trim().min(1, "Enter a size"),
  quantity: z.string().trim().min(1),
  nameAndNumber: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type SubmitCustomOrderInput = z.infer<typeof customOrderSchema>;

export type SubmitCustomOrderResult =
  | { success: true; orderNumber: string }
  | { success: false; error: string };

export async function submitCustomOrder(
  input: SubmitCustomOrderInput
): Promise<SubmitCustomOrderResult> {
  const parsed = customOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request details" };
  }
  const data = parsed.data;
  const quantity = Math.max(1, parseInt(data.quantity, 10) || 1);

  const orderNumber = generateOrderNumber();

  await prisma.customOrder.create({
    data: {
      orderNumber,
      customerName: data.customerName,
      whatsapp: data.whatsapp,
      club: data.club,
      kitDescription: data.kitDescription,
      size: data.size,
      quantity,
      nameAndNumber: data.nameAndNumber || null,
      notes: data.notes || null,
    },
  });

  return { success: true, orderNumber };
}
