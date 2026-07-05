"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildCustomOrderWhatsAppLink } from "@/lib/whatsapp";

export default function CustomOrderPage() {
  const [form, setForm] = useState({
    customerName: "",
    whatsapp: "",
    club: "",
    kitDescription: "",
    size: "",
    nameAndNumber: "",
    quantity: "1",
    notes: "",
  });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const link = buildCustomOrderWhatsAppLink(form);
    window.open(link, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Not in the Catalog?
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold uppercase text-ink-900 md:text-4xl">
          Custom Club Orders
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Any club, any kit, retro or current season &mdash; if it&apos;s not in
          our shop yet, tell us what you&apos;re after and we&apos;ll source it.
          Add a name and number for printing, or send a reference photo
          directly on WhatsApp after submitting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
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
            <label htmlFor="whatsapp" className="text-sm font-semibold text-ink-900">
              WhatsApp Number
            </label>
            <input
              id="whatsapp"
              type="tel"
              required
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="club" className="text-sm font-semibold text-ink-900">
            Club / Team
          </label>
          <input
            id="club"
            required
            placeholder="e.g. AC Milan, Zambia National Team, Ajax"
            value={form.club}
            onChange={(e) => setForm({ ...form, club: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label htmlFor="kitDescription" className="text-sm font-semibold text-ink-900">
            Kit Details
          </label>
          <input
            id="kitDescription"
            required
            placeholder="e.g. Home kit 2025/26, or a retro season"
            value={form.kitDescription}
            onChange={(e) => setForm({ ...form, kitDescription: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="size" className="text-sm font-semibold text-ink-900">
              Size
            </label>
            <input
              id="size"
              required
              placeholder="e.g. M, XL, Kids 26"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="text-sm font-semibold text-ink-900">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              required
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="nameAndNumber" className="text-sm font-semibold text-ink-900">
            Name &amp; Number for Printing (optional)
          </label>
          <input
            id="nameAndNumber"
            placeholder="e.g. CHISULO 10"
            value={form.nameAndNumber}
            onChange={(e) => setForm({ ...form, nameAndNumber: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label htmlFor="notes" className="text-sm font-semibold text-ink-900">
            Additional Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
        </div>

        <button
          type="submit"
          className="hover-glow inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-transform hover:scale-[1.01] hover:bg-brand-700 active:scale-95 sm:w-auto sm:px-8"
        >
          <MessageCircle className="h-5 w-5" /> Send Request on WhatsApp
        </button>
        {sent ? (
          <p className="text-sm text-brand-600">
            Opened WhatsApp with your request &mdash; send it over and attach a
            reference photo if you have one.
          </p>
        ) : (
          <p className="text-xs text-muted">
            This opens WhatsApp with your details filled in. No payment is
            taken here &mdash; we&apos;ll confirm price and delivery with you directly.
          </p>
        )}
      </form>
    </div>
  );
}
