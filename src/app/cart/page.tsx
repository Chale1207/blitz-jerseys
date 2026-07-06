"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { JerseyArt } from "@/components/jersey/jersey-art";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice());

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="container-page py-16" />;

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold uppercase text-ink-900">
          Your Cart is Empty
        </h1>
        <p className="mt-2 text-sm text-muted">Pick a kit and get in the game.</p>
        <Link
          href="/shop"
          className="hover-glow mt-6 inline-flex rounded-full bg-brand-500 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-transform hover:scale-105"
        >
          Shop Kits
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-bold uppercase text-ink-900">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-muted p-2">
                {item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    alt={`${item.teamName} ${item.productName}`}
                    fill
                    sizes="96px"
                    className="object-contain p-1"
                  />
                ) : (
                  <JerseyArt
                    primaryColor={item.primaryColor}
                    secondaryColor={item.secondaryColor}
                    initials={item.initials}
                    className="h-full w-full"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {item.teamName}
                    </p>
                    <p className="font-head text-sm font-semibold text-ink-900">
                      {item.productName} &middot; Size {item.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    aria-label="Remove item"
                    className="text-muted transition-colors hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-surface-muted"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                      aria-label="Increase quantity"
                      disabled={item.quantity >= item.maxStock}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-surface-muted disabled:opacity-30"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-head text-base font-bold text-brand-600">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-border bg-surface p-6 shadow-brand">
          <h2 className="text-lg font-bold uppercase text-ink-900">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span className="font-semibold text-ink-900">{formatPrice(totalPrice)}</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            Delivery fee confirmed with you on WhatsApp based on your location.
          </p>
          <Link
            href="/checkout"
            className="hover-glow mt-6 block rounded-full bg-brand-600 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-transform hover:scale-[1.02] hover:bg-brand-700 active:scale-95"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
