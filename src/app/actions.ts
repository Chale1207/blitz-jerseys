"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/format";

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  whatsapp: z.string().trim().min(7, "Enter a valid WhatsApp number"),
  address: z.string().trim().min(4, "Enter your delivery address"),
  city: z.string().trim().min(2, "Enter your city"),
  notes: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, "Your cart is empty"),
});

export type CreateOrderInput = z.infer<typeof orderSchema>;

export type CreateOrderResult =
  | { success: true; orderNumber: string }
  | { success: false; error: string };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid order details" };
  }
  const data = parsed.data;

  try {
    const orderNumber = await prisma.$transaction(async (tx) => {
      const variants = await tx.productVariant.findMany({
        where: { id: { in: data.items.map((i) => i.variantId) } },
        include: { product: { include: { team: true } } },
      });

      let total = 0;
      const orderItemsData: {
        variantId: string;
        productName: string;
        teamName: string;
        size: string;
        kitType: string;
        price: number;
        quantity: number;
      }[] = [];

      for (const item of data.items) {
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant) {
          throw new Error("One of the items in your cart is no longer available.");
        }
        if (variant.stock < item.quantity) {
          throw new Error(
            `Only ${variant.stock} left in stock for ${variant.product.team.name} (${variant.size}).`
          );
        }
        total += variant.product.price * item.quantity;
        orderItemsData.push({
          variantId: variant.id,
          productName: variant.product.name,
          teamName: variant.product.team.name,
          size: variant.size,
          kitType: variant.product.kitType,
          price: variant.product.price,
          quantity: item.quantity,
        });
      }

      const number = generateOrderNumber();

      await tx.order.create({
        data: {
          orderNumber: number,
          customerName: data.customerName,
          phone: data.phone,
          whatsapp: data.whatsapp,
          address: data.address,
          city: data.city,
          notes: data.notes || null,
          total,
          items: { create: orderItemsData },
        },
      });

      for (const item of data.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return number;
    });

    return { success: true, orderNumber };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not place order.";
    return { success: false, error: message };
  }
}
