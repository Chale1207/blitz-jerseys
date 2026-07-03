import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { ProductGrid } from "@/components/product/product-grid";
import { getDistinctKitTypes, getLeaguesWithTeams, getProducts } from "@/lib/products";
import { LEAGUE_DOTS } from "@/lib/league-colors";

export const metadata = { title: "Shop All Kits" };

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
    <div>
      <section className="floodlight relative overflow-hidden bg-ink-900 py-10 text-white md:py-14">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
            Full Catalog
          </p>
          <h1 className="mt-1 font-display text-4xl uppercase leading-[0.95] md:text-6xl">
            All Kits
          </h1>
        </div>
      </section>

      <div className="container-page py-10">
        <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-6">
          <Link
            href="/shop"
            className="rounded-full bg-ink-900 px-4 py-2 font-head text-xs font-semibold uppercase tracking-wide text-white"
          >
            All Leagues
          </Link>
          {leagues.map((league) => (
            <Link
              key={league.slug}
              href={`/shop/${league.slug}`}
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-head text-xs font-semibold uppercase tracking-wide text-ink-900 transition-colors hover:border-brand-500 hover:text-brand-600"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: LEAGUE_DOTS[league.slug] ?? "var(--color-brand-500)" }}
                aria-hidden
              />
              {league.name}
            </Link>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`rounded-full px-4 py-1.5 font-head text-xs font-semibold uppercase tracking-wide transition-colors ${
              !kit ? "bg-brand-500 text-white" : "bg-surface-muted text-muted hover:text-ink-900"
            }`}
          >
            All Kits
          </Link>
          {kitTypes.map((type) => (
            <Link
              key={type}
              href={`/shop?kit=${encodeURIComponent(type)}`}
              className={`rounded-full px-4 py-1.5 font-head text-xs font-semibold uppercase tracking-wide transition-colors ${
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
    </div>
  );
}
