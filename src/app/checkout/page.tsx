"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { createOrder } from "@/app/actions";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clear = useCartStore((s) => s.clear);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    notes: "",
  });
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="container-page py-16" />;

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold uppercase text-ink-900">
          Nothing to Check Out
        </h1>
        <Link
          href="/shop"
          className="hover-glow mt-6 inline-flex rounded-full bg-brand-500 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-brand"
        >
          Shop Kits
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await createOrder({
      customerName: form.customerName,
      phone: form.phone,
      whatsapp: sameAsPhone ? form.phone : form.whatsapp,
      address: form.address,
      city: form.city,
      notes: form.notes,
      items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    clear();
    router.push(`/order-confirmation/${result.orderNumber}`);
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-bold uppercase text-ink-900">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-2">
          <div>
            <label htmlFor="customerName" className="text-sm font-semibold text-ink-900">
              Full Name
            </label>
            <input
              id="customerName"
              required
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="text-sm font-semibold text-ink-900">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="+260 XXX XXX XXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
            <p className="mt-1 text-xs text-muted">
              Include your country code so we can confirm your order on WhatsApp.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-ink-900">
              <input
                type="checkbox"
                checked={sameAsPhone}
                onChange={(e) => setSameAsPhone(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              My WhatsApp number is the same as my phone number
            </label>
            {!sameAsPhone ? (
              <input
                type="tel"
                required
                placeholder="+260 XXX XXX XXX"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="mt-2 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
              />
            ) : null}
          </div>

          <div>
            <label htmlFor="address" className="text-sm font-semibold text-ink-900">
              Delivery Address
            </label>
            <input
              id="address"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label htmlFor="city" className="text-sm font-semibold text-ink-900">
              City
            </label>
            <input
              id="city"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label htmlFor="notes" className="text-sm font-semibold text-ink-900">
              Order Notes (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="hover-glow w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-transform hover:scale-[1.01] hover:bg-brand-700 active:scale-95 disabled:opacity-60 disabled:shadow-none"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
          <p className="text-center text-xs text-muted">
            No payment is taken now. We&apos;ll confirm your order and delivery cost with you on
            WhatsApp.
          </p>
        </form>

        <div className="h-fit rounded-2xl border border-border bg-surface p-6 shadow-brand">
          <h2 className="text-lg font-bold uppercase text-ink-900">Order Summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.variantId} className="flex justify-between text-muted">
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
            <span className="font-head font-bold text-brand-600">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
