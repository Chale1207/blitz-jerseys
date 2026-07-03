import Link from "next/link";
import { ShieldCheck, MessageCircle, Truck } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { ProductCard } from "@/components/product/product-card";
import { ProductGrid } from "@/components/product/product-grid";
import { getFeaturedProducts, getLeaguesWithTeams } from "@/lib/products";

export default async function Home() {
  const [featured, leagues] = await Promise.all([
    getFeaturedProducts(8),
    getLeaguesWithTeams(),
  ]);

  return (
    <div>
      <Hero />

      <section className="border-b border-border bg-surface">
        <div className="container-page grid grid-cols-1 gap-8 py-10 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-brand-500" />
            <div>
              <p className="text-sm font-semibold text-ink-900">Quality Match Fabric</p>
              <p className="text-xs text-muted">Breathable, built to move</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-brand-500" />
            <div>
              <p className="text-sm font-semibold text-ink-900">Nationwide Delivery</p>
              <p className="text-xs text-muted">Tracked, door to door</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-brand-500" />
            <div>
              <p className="text-sm font-semibold text-ink-900">WhatsApp Order Support</p>
              <p className="text-xs text-muted">Real replies, real fast</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Shop by League
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase text-ink-900 md:text-3xl">
              Pick Your Competition
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {leagues.map((league) => (
            <Link
              key={league.slug}
              href={`/shop/${league.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-ink-900 p-8 text-white transition-transform duration-200 hover:-translate-y-1"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
                {league.country}
              </p>
              <p className="mt-2 font-display text-xl font-bold uppercase">
                {league.name}
              </p>
              <p className="mt-4 text-sm text-white/60">
                {league.teams.length} clubs available &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="floodlight border-y border-border bg-ink-900 py-14 text-white">
        <div className="container-page flex flex-col items-center gap-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
            Not in the Shop Yet?
          </p>
          <h2 className="max-w-xl font-display text-2xl font-bold uppercase leading-tight md:text-3xl">
            Any Club, Any Kit &mdash; We&apos;ll Source It
          </h2>
          <p className="max-w-md text-sm text-white/70">
            Retro seasons, national teams, name and number printing &mdash; tell
            us what you want and we&apos;ll get it made.
          </p>
          <Link
            href="/custom-order"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-accent-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-900 transition-transform duration-200 hover:scale-105 hover:bg-accent-400 active:scale-95"
          >
            Start a Custom Order
          </Link>
        </div>
      </section>

      <section className="container-page pt-14 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Featured
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase text-ink-900 md:text-3xl">
              Latest Drops
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold uppercase tracking-wide text-brand-600 hover:text-brand-700"
          >
            View All
          </Link>
        </div>
        <ProductGrid>
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      </section>
    </div>
  );
}
