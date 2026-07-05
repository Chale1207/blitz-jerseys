import Link from "next/link";
import Image from "next/image";
import { JerseyArt } from "@/components/jersey/jersey-art";
import { formatPrice, numberFromSlug } from "@/lib/format";
import { totalStock } from "@/lib/products";
import { getProductImages } from "@/lib/product-images";

type CardProduct = {
  slug: string;
  name: string;
  kitType: string;
  season: string;
  price: number;
  onSale?: boolean;
  imagesJson?: string | null;
  team: { slug: string; name: string; shortName: string; primaryColor: string; secondaryColor: string; league: { name: string } };
  variants: { stock: number }[];
};

export function ProductCard({ product }: { product: CardProduct }) {
  const inStock = totalStock(product.variants) > 0;
  const images = getProductImages(product.slug, product.imagesJson);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="hover-glow group block overflow-hidden rounded-2xl bg-surface shadow-brand transition-all duration-200 hover:-translate-y-1"
    >
      <div className="shine-sweep relative aspect-[4/5] overflow-hidden bg-surface-muted">
        {images ? (
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
            className="object-contain p-3 transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <JerseyArt
            primaryColor={product.team.primaryColor}
            secondaryColor={product.team.secondaryColor}
            initials={product.team.shortName}
            number={numberFromSlug(product.slug)}
            className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-105"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-ink-900/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          {product.team.league.name}
        </span>
        {!inStock ? (
          <span className="absolute right-3 top-3 rounded-full bg-danger px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Sold Out
          </span>
        ) : product.onSale ? (
          <span className="absolute right-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-brand">
            Promo
          </span>
        ) : null}
      </div>
      <div className="h-[3px] bg-gradient-to-r from-brand-900 via-brand-500 to-brand-300" />
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-600">
          {product.team.name}
        </p>
        <h3 className="mt-1 font-head text-lg font-bold uppercase leading-tight text-ink-900">
          {product.name} {product.season}
        </h3>
        <p className="mt-3 font-head text-xl font-bold text-brand-600">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
