import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatWhatsAppDisplay } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import {
  CUSTOM_ORDER_STATUS_LABELS,
  CUSTOM_ORDER_STATUS_MESSAGES,
  CUSTOM_ORDER_STATUS_STYLES,
} from "@/lib/custom-order-status";

export const dynamic = "force-dynamic";

export default async function TrackCustomOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await prisma.customOrder.findUnique({
    where: { orderNumber },
    include: { assignedVariant: { include: { product: { include: { team: true } } } } },
  });

  if (!order) notFound();

  const copy = CUSTOM_ORDER_STATUS_MESSAGES[order.status] ?? CUSTOM_ORDER_STATUS_MESSAGES.new;
  const firstName = order.customerName.split(" ")[0];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi Blitz Jerseys! Checking in on my custom order ${order.orderNumber}.`
  )}`;

  return (
    <div className="container-page flex flex-col items-center py-16 text-center">
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
          CUSTOM_ORDER_STATUS_STYLES[order.status] ?? "bg-surface-muted text-muted"
        }`}
      >
        {CUSTOM_ORDER_STATUS_LABELS[order.status] ?? order.status}
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold uppercase text-ink-900 md:text-4xl">
        {copy.heading(firstName)}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">{copy.body(order.orderNumber)}</p>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="h-5 w-5" /> Message Us on WhatsApp
      </a>
      <p className="mt-2 text-xs text-muted">
        Or message us directly: {formatWhatsAppDisplay(whatsappNumber)}
      </p>

      <div className="mt-10 w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-left shadow-brand">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-900">
          Request Details
        </h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <dt>Club</dt>
            <dd className="font-medium text-ink-900">{order.club}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Kit</dt>
            <dd className="font-medium text-ink-900">{order.kitDescription}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Size</dt>
            <dd className="font-medium text-ink-900">{order.size}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Quantity</dt>
            <dd className="font-medium text-ink-900">{order.quantity}</dd>
          </div>
          {order.nameAndNumber ? (
            <div className="flex justify-between text-muted">
              <dt>Name/Number</dt>
              <dd className="font-medium text-ink-900">{order.nameAndNumber}</dd>
            </div>
          ) : null}
          {order.assignedVariant ? (
            <div className="flex justify-between border-t border-border pt-2 text-muted">
              <dt>Matched Item</dt>
              <dd className="font-medium text-brand-700">
                {order.assignedVariant.product.team.name}{" "}
                {order.assignedVariant.product.name} ({order.assignedVariant.size})
              </dd>
            </div>
          ) : null}
          {order.totalPrice != null ? (
            <div className="flex justify-between border-t border-border pt-3 text-sm">
              <dt className="font-semibold text-ink-900">Total Cost</dt>
              <dd className="font-head text-base font-bold text-brand-600">
                {formatPrice(order.totalPrice)}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      <Link href="/custom-order" className="mt-8 text-sm font-semibold text-brand-600 hover:text-brand-700">
        &larr; Submit Another Request
      </Link>
    </div>
  );
}
