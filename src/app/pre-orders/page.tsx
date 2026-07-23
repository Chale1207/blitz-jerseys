import { Metadata } from "next";
import { PreOrdersClient } from "./pre-orders-client";
import { PRE_ORDER_KITS } from "@/lib/pre-order-kits";

export const metadata: Metadata = {
  title: "Pre-orders — 2026/27 Away Kits",
  description:
    "Secure your 2026/27 away kit before it arrives. Limited pre-order slots for Chelsea, Barcelona, Man United, and Real Madrid.",
};

export default function PreOrdersPage() {
  return (
    <div className="container-page py-10">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Dropping soon
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold uppercase text-ink-900 md:text-4xl">
          Pre-order 2026/27 Away Kits
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Secure yours before stock arrives. We&apos;ll confirm your order on WhatsApp and
          contact you the moment your kit is in — no payment until it lands.
        </p>
      </div>
      <PreOrdersClient kits={PRE_ORDER_KITS} />
    </div>
  );
}
