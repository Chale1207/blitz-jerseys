"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { buildPreOrderWhatsAppLink } from "@/lib/whatsapp";
import { submitPreOrder, submitNotifyMe } from "./actions";
import type { PreOrderKit } from "@/lib/pre-order-kits";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const STATUS_BADGE: Record<PreOrderKit["status"], { label: string; className: string }> = {
  open: { label: "Pre-order open", className: "bg-brand-500/15 text-brand-600" },
  "coming-soon": { label: "Coming soon", className: "bg-amber-100 text-amber-700" },
  notify: { label: "Notify me", className: "bg-muted/20 text-muted" },
};

function KitCard({ kit }: { kit: PreOrderKit }) {
  const [activeImg, setActiveImg] = useState(kit.defaultImageIndex);
  const [sleeve, setSleeve] = useState<"short" | "long">("short");
  const [size, setSize] = useState("");
  const [form, setForm] = useState({ customerName: "", whatsapp: "", quantity: 1, notes: "" });
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notifyName, setNotifyName] = useState("");
  const [notifyPhone, setNotifyPhone] = useState("");
  const [notifySent, setNotifySent] = useState(false);
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);

  const badge = STATUS_BADGE[kit.status];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitPreOrder({
        customerName: form.customerName,
        whatsapp: form.whatsapp,
        kitId: kit.id,
        size,
        sleeveType: sleeve,
        quantity: form.quantity,
        notes: form.notes,
      });
      if (!result.success) { setError(result.error); return; }
      const link = buildPreOrderWhatsAppLink({
        orderNumber: result.orderNumber,
        customerName: form.customerName,
        kitName: kit.fullName,
        size,
        sleeveType: sleeve,
        quantity: form.quantity,
        notes: form.notes,
      });
      window.open(link, "_blank", "noopener,noreferrer");
      setDone(result.orderNumber);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    setNotifyError(null);
    setNotifySubmitting(true);
    try {
      const result = await submitNotifyMe({
        customerName: notifyName,
        whatsapp: notifyPhone,
        kitId: kit.id,
      });
      if (!result.success) { setNotifyError(result.error); return; }
      const link = buildPreOrderWhatsAppLink({
        orderNumber: "NOTIFY",
        customerName: notifyName,
        kitName: kit.fullName,
        size: "TBD",
        sleeveType: "short",
        quantity: 1,
        notes: "Please notify me when this kit is available.",
      });
      window.open(link, "_blank", "noopener,noreferrer");
      setNotifySent(true);
    } finally {
      setNotifySubmitting(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      {/* Image strip */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
        <Image
          src={kit.images[activeImg]}
          alt={kit.fullName}
          fill
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>
          {badge.label}
        </span>
        {kit.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {kit.images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${i === activeImg ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">{kit.club}</p>
        <h2 className="mt-0.5 font-display text-lg font-bold text-ink-900">{kit.kitName}</h2>
        <p className="mt-1 font-display text-xl font-bold text-brand-600">{formatPrice(kit.price)}</p>

        {/* Demand bar for open kits */}
        {kit.status === "open" && (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted">Stock reserved</span>
              <span className="font-semibold text-amber-600">{kit.demandPercent}% claimed</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: `${kit.demandPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Pre-order form */}
        {kit.status === "open" && (
          <div className="mt-4">
            {done ? (
              <div className="rounded-xl bg-brand-500/10 p-4 text-center">
                <p className="text-sm font-semibold text-brand-600">Pre-order submitted!</p>
                <p className="mt-1 text-xs text-muted">Ref: {done}</p>
                <p className="mt-1 text-xs text-muted">We&apos;ve opened WhatsApp — confirm there to secure your slot.</p>
              </div>
            ) : open ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Sleeve toggle */}
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-900">Sleeve</p>
                  <div className="flex gap-2">
                    {(["short", "long"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setSleeve(s); setSize(""); }}
                        className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                          sleeve === s
                            ? "border-brand-500 bg-brand-500 text-white"
                            : "border-border text-ink-900 hover:border-brand-400"
                        }`}
                      >
                        {s === "short" ? "Short sleeve" : "Long sleeve"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-900">Size</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`h-9 min-w-9 rounded-lg border px-2.5 text-xs font-semibold transition-colors ${
                          size === s
                            ? "border-brand-500 bg-brand-500 text-white"
                            : "border-border text-ink-900 hover:border-brand-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-900">Your name</label>
                    <input
                      required
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      placeholder="Full name"
                      className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-900">WhatsApp</label>
                    <input
                      required
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="e.g. 0976 123 456"
                      className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-900">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                      className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-900">Notes (optional)</label>
                    <input
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="e.g. name print, gift wrap"
                      className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting || !size}
                  className="w-full rounded-full bg-brand-600 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700 disabled:opacity-50"
                >
                  {submitting ? "Saving…" : "Pre-order via WhatsApp"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="w-full text-xs text-muted hover:text-ink-900">
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="hover-glow w-full rounded-full bg-brand-600 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-brand transition hover:bg-brand-700"
              >
                Pre-order now
              </button>
            )}
          </div>
        )}

        {/* Coming soon — just show demand */}
        {kit.status === "coming-soon" && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted">Interest registered</span>
              <span className="font-semibold text-amber-600">{kit.demandPercent}% claimed</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-amber-400" style={{ width: `${kit.demandPercent}%` }} />
            </div>
            <p className="mt-3 text-xs text-muted">
              Pre-orders will open shortly. Check back soon or message us on WhatsApp.
            </p>
          </div>
        )}

        {/* Notify me */}
        {kit.status === "notify" && (
          <div className="mt-4">
            {notifySent ? (
              <p className="text-center text-sm font-semibold text-brand-600">
                We&apos;ll message you when it drops!
              </p>
            ) : (
              <form onSubmit={handleNotify} className="space-y-2">
                <p className="text-xs text-muted">Not yet confirmed — leave your details and we&apos;ll notify you first.</p>
                <input
                  required
                  value={notifyName}
                  onChange={(e) => setNotifyName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                />
                <input
                  required
                  value={notifyPhone}
                  onChange={(e) => setNotifyPhone(e.target.value)}
                  placeholder="WhatsApp number"
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                />
                {notifyError && <p className="text-xs text-red-600">{notifyError}</p>}
                <button
                  type="submit"
                  disabled={notifySubmitting}
                  className="w-full rounded-full border border-brand-500 py-3 text-sm font-bold uppercase tracking-wide text-brand-600 transition hover:bg-brand-500 hover:text-white disabled:opacity-50"
                >
                  {notifySubmitting ? "Saving…" : "Notify me when available"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function PreOrdersClient({ kits }: { kits: PreOrderKit[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {kits.map((kit) => (
        <KitCard key={kit.id} kit={kit} />
      ))}
    </div>
  );
}
