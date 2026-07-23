"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

type Variant = { id: string; size: string; stock: number };

const SIZE_ORDER = ["S", "M", "L", "XL", "XXL"];

function isLongSleeve(size: string) {
  return size.endsWith("-LS");
}

function displaySize(size: string) {
  return size.replace(/-LS$/, "");
}

export function AddToCart({
  productSlug,
  productName,
  teamName,
  kitType,
  price,
  primaryColor,
  secondaryColor,
  initials,
  imageSrc,
  variants,
}: {
  productSlug: string;
  productName: string;
  teamName: string;
  kitType: string;
  price: number;
  primaryColor: string;
  secondaryColor: string;
  initials: string;
  imageSrc?: string;
  variants: Variant[];
}) {
  const shortVariants = variants.filter((v) => !isLongSleeve(v.size));
  const longVariants = variants.filter((v) => isLongSleeve(v.size));
  const hasLongSleeve = longVariants.length > 0;

  const [sleeve, setSleeve] = useState<"short" | "long">("short");
  const activeVariants = sleeve === "long" ? longVariants : shortVariants;
  const inStockActive = activeVariants.filter((v) => v.stock > 0);

  const [selected, setSelected] = useState<string>(
    shortVariants.find((v) => v.stock > 0)?.id ?? shortVariants[0]?.id ?? ""
  );
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const selectedVariant = variants.find((v) => v.id === selected);
  const allInStock = variants.filter((v) => v.stock > 0);

  function handleSleeveChange(next: "short" | "long") {
    setSleeve(next);
    const nextVariants = next === "long" ? longVariants : shortVariants;
    const firstInStock = nextVariants.find((v) => v.stock > 0);
    setSelected(firstInStock?.id ?? nextVariants[0]?.id ?? "");
  }

  function handleAdd() {
    if (!selectedVariant || selectedVariant.stock === 0) return;
    addItem({
      variantId: selectedVariant.id,
      productSlug,
      productName,
      teamName,
      kitType,
      size: selectedVariant.size,
      price,
      primaryColor,
      secondaryColor,
      initials,
      imageSrc,
      maxStock: selectedVariant.stock,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <div>
      {/* Sleeve toggle — only shown when long sleeve stock exists */}
      {hasLongSleeve && (
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-900">Sleeve</p>
          <div className="mt-2 flex gap-2">
            {(["short", "long"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSleeveChange(s)}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                  sleeve === s
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-border text-ink-900 hover:border-brand-500"
                }`}
              >
                {s === "short" ? "Short sleeve" : "Long sleeve"}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm font-semibold uppercase tracking-wide text-ink-900">Size</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {activeVariants.map((variant) => {
          const disabled = variant.stock === 0;
          const active = selected === variant.id;
          return (
            <button
              key={variant.id}
              type="button"
              disabled={disabled}
              onClick={() => setSelected(variant.id)}
              className={`h-11 min-w-11 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                disabled
                  ? "cursor-not-allowed border-border text-border line-through"
                  : active
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-border text-ink-900 hover:border-brand-500"
              }`}
            >
              {displaySize(variant.size)}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!selectedVariant || selectedVariant.stock === 0}
        className="hover-glow mt-6 w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-transform duration-150 hover:scale-[1.02] hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
      >
        {allInStock.length === 0 ? "Sold Out" : justAdded ? "Added to Cart" : "Add to Cart"}
      </button>

      {justAdded ? (
        <p className="mt-3 text-center text-sm text-brand-600">
          Added! <Link href="/cart" className="font-semibold underline">View cart &rarr;</Link>
        </p>
      ) : null}
    </div>
  );
}
