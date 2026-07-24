"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/image-uploader";

const STATUSES = [
  { value: "open", label: "Pre-order open" },
  { value: "coming-soon", label: "Coming soon" },
  { value: "notify", label: "Notify me (unconfirmed)" },
];

export function KitForm({
  kitId,
  defaultValues,
}: {
  kitId?: string;
  defaultValues?: {
    club?: string;
    kitName?: string;
    price?: number;
    status?: string;
    demandPercent?: number;
    defaultImageIndex?: number;
    imageUrls?: string;
  };
}) {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>(
    defaultValues?.imageUrls
      ? defaultValues.imageUrls.split("\n").map((u) => u.trim()).filter(Boolean)
      : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const url = kitId ? `/api/admin/pre-order-kits/${kitId}` : "/api/admin/pre-order-kits";
      const res = await fetch(url, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? "Failed to save.");
        return;
      }
      router.push("/admin/pre-order-kits");
      router.refresh();
    } catch {
      setError("Failed to save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-label">Club</label>
          <input
            name="club"
            type="text"
            required
            defaultValue={defaultValues?.club ?? ""}
            placeholder="e.g. Chelsea FC"
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">Kit name</label>
          <input
            name="kitName"
            type="text"
            required
            defaultValue={defaultValues?.kitName ?? ""}
            placeholder="e.g. 2026/27 Away Kit"
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">Price (K)</label>
          <input
            name="price"
            type="number"
            required
            min={1}
            defaultValue={defaultValues?.price ?? 850}
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">Status</label>
          <select
            name="status"
            required
            defaultValue={defaultValues?.status ?? "open"}
            className="admin-input"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label">Demand shown (%)</label>
          <input
            name="demandPercent"
            type="number"
            min={0}
            max={100}
            defaultValue={defaultValues?.demandPercent ?? 0}
            className="admin-input"
          />
          <p className="mt-1 text-xs text-muted">The "stock reserved / claimed" bar shown to customers.</p>
        </div>
        <div>
          <label className="admin-label">Default image index</label>
          <input
            name="defaultImageIndex"
            type="number"
            min={0}
            defaultValue={defaultValues?.defaultImageIndex ?? 0}
            className="admin-input"
          />
          <p className="mt-1 text-xs text-muted">Which uploaded image (0 = first) shows by default.</p>
        </div>
      </div>

      <div>
        <label className="admin-label">Kit images</label>
        <ImageUploader urls={imageUrls} onChange={setImageUrls} />
        <input type="hidden" name="imageUrls" value={imageUrls.join("\n")} />
        <p className="mt-2 text-xs text-muted">
          Drag &amp; drop or click to upload. You can also type paths below — one per line.
        </p>
        <textarea
          rows={2}
          placeholder="/images/pre-orders/chelsea-away-1.jpg"
          className="admin-input mt-1 resize-none font-mono text-xs"
          value={imageUrls.join("\n")}
          onChange={(e) =>
            setImageUrls(e.target.value.split("\n").map((u) => u.trim()).filter(Boolean))
          }
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-600 active:scale-95 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save kit"}
        </button>
        <a
          href="/admin/pre-order-kits"
          className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-muted hover:text-ink-900"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
