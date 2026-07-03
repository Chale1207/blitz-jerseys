import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ProductGrid } from "@/components/product/product-grid";
import { getLeagueBySlug, getLeaguesWithTeams, getProducts } from "@/lib/products";
import { LEAGUE_DOTS } from "@/lib/league-colors";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ league: string }>;
}) {
  const { league: leagueSlug } = await params;
  const league = await getLeagueBySlug(leagueSlug);
  return { title: league ? `${league.name} Kits` : undefined };
}

export default async function LeagueShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ league: string }>;
  searchParams: Promise<{ team?: string; kit?: string }>;
}) {
  const { league: leagueSlug } = await params;
  const { team, kit } = await searchParams;

  const [league, allLeagues] = await Promise.all([
    getLeagueBySlug(leagueSlug),
    getLeaguesWithTeams(),
  ]);

  if (!league) notFound();

  const currentLeague = allLeagues.find((l) => l.slug === leagueSlug)!;
  const products = await getProducts({ leagueSlug, teamSlug: team, kitType: kit });

  const dot = LEAGUE_DOTS[leagueSlug] ?? "var(--color-brand-500)";

  return (
    <div>
      <section className="floodlight relative overflow-hidden bg-ink-900 py-10 text-white md:py-14">
        <div className="container-page">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} aria-hidden />
            {league.country}
          </p>
          <h1 className="mt-1 font-display text-4xl uppercase leading-[0.95] md:text-6xl">
            {league.name} Kits
          </h1>
        </div>
      </section>

      <div className="container-page py-10">
        <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-6">
          <Link
            href="/shop"
            className="rounded-full border border-border px-4 py-2 font-head text-xs font-semibold uppercase tracking-wide text-ink-900 hover:border-brand-500 hover:text-brand-600"
          >
            All Leagues
          </Link>
          {allLeagues.map((l) => (
            <Link
              key={l.slug}
              href={`/shop/${l.slug}`}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 font-head text-xs font-semibold uppercase tracking-wide ${
                l.slug === leagueSlug
                  ? "bg-ink-900 text-white"
                  : "border border-border text-ink-900 hover:border-brand-500 hover:text-brand-600"
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: LEAGUE_DOTS[l.slug] ?? "var(--color-brand-500)" }}
                aria-hidden
              />
              {l.name}
            </Link>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href={`/shop/${leagueSlug}`}
            className={`rounded-full px-4 py-1.5 font-head text-xs font-semibold uppercase tracking-wide ${
              !team ? "bg-brand-500 text-white" : "bg-surface-muted text-muted hover:text-ink-900"
            }`}
          >
            All Clubs
          </Link>
          {currentLeague.teams.map((t) => (
            <Link
              key={t.slug}
              href={`/shop/${leagueSlug}?team=${t.slug}`}
              className={`rounded-full px-4 py-1.5 font-head text-xs font-semibold uppercase tracking-wide ${
                team === t.slug ? "bg-brand-500 text-white" : "bg-surface-muted text-muted hover:text-ink-900"
              }`}
            >
              {t.name}
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
