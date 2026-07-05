import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { buildOrderWhatsAppLink } from "@/lib/whatsapp";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { ORDER_STATUS_LABELS, ORDER_STATUS_MESSAGES } from "@/lib/order-status";

export const dynamic = "force-dynamic";

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

  const copy = ORDER_STATUS_MESSAGES[order.status] ?? ORDER_STATUS_MESSAGES.pending;
  const firstName = order.customerName.split(" ")[0];

  return (
    <div className="container-page flex flex-col items-center py-16 text-center">
      <OrderStatusBadge status={order.status} label={ORDER_STATUS_LABELS[order.status]} />
      <h1 className="mt-4 font-display text-3xl font-bold uppercase text-ink-900 md:text-4xl">
        {copy.heading(firstName)}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        {copy.body(order.orderNumber)}
      </p>
      <p className="mt-1 text-xs text-muted">
        Bookmark this page or save your order number — you can check your order status anytime at{" "}
        <Link href="/track-order" className="font-semibold text-brand-600 hover:text-brand-700">
          Track Order
        </Link>
        .
      </p>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="h-5 w-5" /> {copy.whatsappLabel}
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
