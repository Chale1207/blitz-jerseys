import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { ProductGrid } from "@/components/product/product-grid";
import { getDistinctKitTypes, getLeaguesWithTeams, getProducts } from "@/lib/products";

export const metadata = { title: "Shop All Kits | Blitz Jerseys" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ kit?: string }>;
}) {
  const { kit } = await searchParams;
  const [products, leagues, kitTypes] = await Promise.all([
    getProducts({ kitType: kit }),
    getLeaguesWithTeams(),
    getDistinctKitTypes(),
  ]);

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Full Catalog
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold uppercase text-ink-900 md:text-4xl">
          All Kits
        </h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-6">
        <Link
          href="/shop"
          className="rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
        >
          All Leagues
        </Link>
        {leagues.map((league) => (
          <Link
            key={league.slug}
            href={`/shop/${league.slug}`}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-900 transition-colors hover:border-brand-500 hover:text-brand-600"
          >
            {league.name}
          </Link>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
            !kit ? "bg-brand-500 text-white" : "bg-surface-muted text-muted hover:text-ink-900"
          }`}
        >
          All Kits
        </Link>
        {kitTypes.map((type) => (
          <Link
            key={type}
            href={`/shop?kit=${encodeURIComponent(type)}`}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
              kit === type ? "bg-brand-500 text-white" : "bg-surface-muted text-muted hover:text-ink-900"
            }`}
          >
            {type}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-muted">No kits match these filters yet.</p>
      ) : (
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      )}
    </div>
  );
}
