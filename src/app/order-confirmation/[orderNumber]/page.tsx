import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { buildOrderWhatsAppLink } from "@/lib/whatsapp";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) notFound();

  const whatsappLink = buildOrderWhatsAppLink({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    address: order.address,
    city: order.city,
    total: order.total,
    items: order.items.map((item) => ({
      teamName: item.teamName,
      productName: item.productName,
      kitType: item.kitType,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    })),
  });

  return (
    <div className="container-page flex flex-col items-center py-16 text-center">
      <span className="rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
        Order Received
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold uppercase text-ink-900 md:text-4xl">
        Thanks, {order.customerName.split(" ")[0]}!
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Your order <span className="font-semibold text-ink-900">{order.orderNumber}</span> has
        been saved. Tap below to send us your order on WhatsApp so we can confirm sizes, delivery
        cost, and timing.
      </p>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="h-5 w-5" /> Confirm via WhatsApp
      </a>

      <div className="mt-10 w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-left shadow-brand">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-900">
          Order Summary
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-muted">
              <span>
                {item.teamName} {item.productName} ({item.size}) x{item.quantity}
              </span>
              <span className="font-semibold text-ink-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm">
          <span className="font-semibold text-ink-900">Total</span>
          <span className="font-head font-bold text-brand-600">{formatPrice(order.total)}</span>
        </div>
      </div>

      <Link href="/shop" className="mt-8 text-sm font-semibold text-brand-600 hover:text-brand-700">
        &larr; Continue Shopping
      </Link>
    </div>
  );
}
