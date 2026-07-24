"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";

type Team = { id: string; name: string; league: { name: string } };
type Variant = { size: string; stock: number };

const KIT_TYPES = ["Home Kit", "Away Kit", "Third Kit", "Training Kit", "Goalkeeper Kit"];
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const LONG_SLEEVE_SIZES = ["XS-LS", "S-LS", "M-LS", "L-LS", "XL-LS", "XXL-LS"];

export function ProductForm({
  teams,
  action,
  productId,
  defaultValues,
}: {
  teams: Team[];
  action?: (formData: FormData) => Promise<void>;
  productId?: string;
  defaultValues?: {
    teamId?: string;
    name?: string;
    kitType?: string;
    season?: string;
    price?: number;
    description?: string;
    featured?: boolean;
    onSale?: boolean;
    imageUrls?: string;
    variants?: Variant[];
  };
}) {
  const router = useRouter();
  const [variants, setVariants] = useState<Variant[]>(
    defaultValues?.variants ?? DEFAULT_SIZES.map((size) => ({ size, stock: 10 }))
  );

  const [imageUrls, setImageUrls] = useState<string[]>(
    defaultValues?.imageUrls
      ? defaultValues.imageUrls.split("\n").map((u) => u.trim()).filter(Boolean)
      : []
  );

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!productId) return; // create mode uses the Server Action normally
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSaveError(data.error ?? "Failed to save changes.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setSaveError("Failed to save changes. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  function addVariant() {
    setVariants((v) => [...v, { size: "", stock: 10 }]);
  }

  function addLongSleeveSizes() {
    setVariants((v) => {
      const existingSizes = new Set(v.map((row) => row.size));
      const missing = LONG_SLEEVE_SIZES.filter((size) => !existingSizes.has(size));
      return [...v, ...missing.map((size) => ({ size, stock: 0 }))];
    });
  }

  function removeVariant(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  function updateVariant(i: number, field: keyof Variant, value: string) {
    setVariants((v) =>
      v.map((row, idx) =>
        idx === i ? { ...row, [field]: field === "stock" ? parseInt(value) || 0 : value } : row
      )
    );
  }

  return (
    <form
      action={productId ? undefined : action}
      onSubmit={productId ? handleEditSubmit : undefined}
      className="space-y-6"
    >
      {saveError ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</p>
      ) : null}
      {/* Team + basic info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-label">Team</label>
          <select name="teamId" defaultValue={defaultValues?.teamId ?? ""} required className="admin-input">
            <option value="" disabled>Select a team…</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.league.name})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label">Kit type</label>
          <select name="kitType" defaultValue={defaultValues?.kitType ?? ""} required className="admin-input">
            <option value="" disabled>Select type…</option>
            {KIT_TYPES.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="admin-label">Product name</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={defaultValues?.name ?? ""}
            placeholder="e.g. Arsenal Home Kit 2026/27"
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">Season</label>
          <input
            name="season"
            type="text"
            required
            defaultValue={defaultValues?.season ?? "2026/27"}
            placeholder="2026/27"
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
            defaultValue={defaultValues?.price ?? 350}
            className="admin-input"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="admin-label">Description</label>
          <textarea
            name="description"
            rows={3}
            required
            defaultValue={defaultValues?.description ?? ""}
            placeholder="Short product description…"
            className="admin-input resize-none"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-900">
          <input type="checkbox" name="featured" defaultChecked={defaultValues?.featured} className="h-4 w-4 accent-brand-500" />
          Featured on homepage
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-900">
          <input type="checkbox" name="onSale" defaultChecked={defaultValues?.onSale} className="h-4 w-4 accent-brand-500" />
          On sale / promotion
        </label>
      </div>

      {/* Images */}
      <div>
        <label className="admin-label">Product images</label>
        <ImageUploader urls={imageUrls} onChange={setImageUrls} />
        {/* Hidden field — serialises URLs for the server action */}
        <input type="hidden" name="imageUrls" value={imageUrls.join("\n")} />
        <p className="mt-2 text-xs text-muted">
          Drag &amp; drop or click to upload. You can also type URLs below — one per line.
        </p>
        <textarea
          rows={2}
          placeholder="/images/filler/filler-01.jpeg"
          className="admin-input mt-1 resize-none font-mono text-xs"
          value={imageUrls.join("\n")}
          onChange={(e) =>
            setImageUrls(e.target.value.split("\n").map((u) => u.trim()).filter(Boolean))
          }
        />
      </div>

      {/* Variants */}
      <div>
        <label className="admin-label">Sizes &amp; stock</label>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted">Size</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted">Stock</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {variants.map((v, i) => (
                <tr key={i}>
                  <td className="px-3 py-2">
                    <input
                      name="size"
                      value={v.size}
                      onChange={(e) => updateVariant(i, "size", e.target.value)}
                      placeholder="XL"
                      className="w-24 rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-500"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      name="stock"
                      type="number"
                      min={0}
                      value={v.stock}
                      onChange={(e) => updateVariant(i, "stock", e.target.value)}
                      className="w-24 rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-500"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="text-muted hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add size
          </button>
          <button
            type="button"
            onClick={addLongSleeveSizes}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add long sleeve sizes
          </button>
        </div>
        <p className="mt-1.5 text-xs text-muted">
          Long sleeve sizes appear as a separate option on the product page only once
          you set their stock above 0. Leave a size at 0 to keep it hidden from customers.
        </p>
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
          href="/admin/products"
          className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-muted hover:text-ink-900"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
