import { ProductCard } from "@/components/product/product-card";
import { ProductGrid } from "@/components/product/product-grid";
import { getPromoProducts } from "@/lib/products";

export const metadata = { title: "Promotions" };

export default async function PromotionsPage() {
  const products = await getPromoProducts();

  return (
    <div>
      <section className="floodlight relative overflow-hidden bg-ink-900 py-10 text-white md:py-14">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
            Limited Stock &middot; Last Season
          </p>
          <h1 className="mt-1 font-display text-4xl uppercase leading-[0.95] md:text-6xl">
            Promotions
          </h1>
          <p className="mt-3 max-w-md text-sm text-white/70">
            2025/26 season kits at clearance prices while stock lasts. Once
            they&apos;re gone, they&apos;re gone. No restocks.
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        {products.length === 0 ? (
          <p className="py-16 text-center text-muted">No promotions running right now. Check back soon.</p>
        ) : (
          <ProductGrid>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        )}
      </div>
    </div>
  );
}
