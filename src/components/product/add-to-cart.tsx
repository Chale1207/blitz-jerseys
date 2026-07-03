"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

type Variant = { id: string; size: string; stock: number };

export function AddToCart({
  productSlug,
  productName,
  teamName,
  kitType,
  price,
  primaryColor,
  secondaryColor,
  initials,
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
  variants: Variant[];
}) {
  const inStockVariants = variants.filter((v) => v.stock > 0);
  const [selected, setSelected] = useState<string>(inStockVariants[0]?.id ?? "");
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const selectedVariant = variants.find((v) => v.id === selected);

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
      maxStock: selectedVariant.stock,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-ink-900">Size</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((variant) => {
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
              {variant.size}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!selectedVariant || selectedVariant.stock === 0}
        className="mt-6 w-full rounded-full bg-accent-500 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-900 transition-transform duration-150 hover:scale-[1.02] hover:bg-accent-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {inStockVariants.length === 0 ? "Sold Out" : justAdded ? "Added to Cart" : "Add to Cart"}
      </button>

      {justAdded ? (
        <p className="mt-3 text-center text-sm text-brand-600">
          Added! <Link href="/cart" className="font-semibold underline">View cart &rarr;</Link>
        </p>
      ) : null}
    </div>
  );
}
