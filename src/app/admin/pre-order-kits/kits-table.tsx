"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Pencil } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { PreOrderKit } from "@/lib/pre-order-kits";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-brand-100 text-brand-700",
  "coming-soon": "bg-amber-100 text-amber-700",
  notify: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Pre-order open",
  "coming-soon": "Coming soon",
  notify: "Notify me",
};

export function KitsTable({ kits }: { kits: PreOrderKit[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, fullName: string) {
    if (!confirm(`Delete "${fullName}"? This removes it from the public pre-orders page.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/pre-order-kits/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete kit.");
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (kits.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-12 text-center text-sm text-muted">
        No pre-order kits yet. Add one to show it on the public /pre-orders page.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {kits.map((kit) => (
        <div key={kit.id} className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="relative aspect-[4/5] bg-surface-muted">
            {kit.images[kit.defaultImageIndex] ? (
              <Image
                src={kit.images[kit.defaultImageIndex]}
                alt={kit.fullName}
                fill
                className="object-contain p-4"
                sizes="300px"
              />
            ) : null}
            <span
              className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[kit.status] ?? "bg-gray-100 text-gray-600"}`}
            >
              {STATUS_LABELS[kit.status] ?? kit.status}
            </span>
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{kit.club}</p>
            <p className="font-display text-base font-bold text-ink-900">{kit.kitName}</p>
            <p className="mt-1 text-sm font-semibold text-ink-900">{formatPrice(kit.price)}</p>
            <p className="mt-1 text-xs text-muted">{kit.demandPercent}% demand shown &middot; {kit.images.length} image{kit.images.length !== 1 ? "s" : ""}</p>

            <div className="mt-3 flex gap-2">
              <Link
                href={`/admin/pre-order-kits/${kit.id}/edit`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-semibold text-ink-900 hover:bg-surface-muted"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
              <button
                type="button"
                disabled={deletingId === kit.id}
                onClick={() => handleDelete(kit.id, kit.fullName)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
