"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Search } from "lucide-react";
import { ToggleFeaturedButton, ToggleOnSaleButton } from "./toggle-buttons";
import { DeleteButton } from "./delete-button";

type ProductRow = {
  id: string;
  name: string;
  kitType: string;
  season: string;
  price: number;
  featured: boolean;
  onSale: boolean;
  team: { name: string; league: { name: string } };
  variants: { stock: number }[];
};

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const [query, setQuery] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("all");

  const leagues = useMemo(
    () => Array.from(new Set(products.map((p) => p.team.league.name))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesLeague = leagueFilter === "all" || p.team.league.name === leagueFilter;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.team.name.toLowerCase().includes(q) ||
        p.kitType.toLowerCase().includes(q);
      return matchesLeague && matchesQuery;
    });
  }, [products, query, leagueFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search team, kit type…"
            className="admin-input pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setLeagueFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              leagueFilter === "all" ? "bg-ink-900 text-white" : "bg-surface-muted text-muted hover:text-ink-900"
            }`}
          >
            All ({products.length})
          </button>
          {leagues.map((league) => {
            const count = products.filter((p) => p.team.league.name === league).length;
            return (
              <button
                key={league}
                type="button"
                onClick={() => setLeagueFilter(league)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  leagueFilter === league ? "bg-ink-900 text-white" : "bg-surface-muted text-muted hover:text-ink-900"
                }`}
              >
                {league} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted">
            {products.length === 0 ? (
              <>
                No products yet.{" "}
                <Link href="/admin/products/new" className="font-semibold text-brand-600">
                  Add your first kit →
                </Link>
              </>
            ) : (
              "No kits match your search."
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-border bg-surface-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Kit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">League</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Season</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted">Featured</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted">Sale</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => {
                  const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
                  const fullName = `${p.team.name} ${p.name}`;
                  return (
                    <tr key={p.id} className="hover:bg-surface-muted">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-ink-900">{fullName}</p>
                        <p className="text-xs text-muted">{p.kitType} · {p.season}</p>
                      </td>
                      <td className="px-4 py-3 text-muted">{p.team.league.name}</td>
                      <td className="px-4 py-3 text-muted">{p.season}</td>
                      <td className="px-4 py-3 font-semibold text-ink-900">K{p.price}</td>
                      <td className="px-4 py-3 text-muted">{totalStock}</td>
                      <td className="px-4 py-3 text-center">
                        <ToggleFeaturedButton id={p.id} name={fullName} featured={p.featured} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <ToggleOnSaleButton id={p.id} name={fullName} onSale={p.onSale} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-ink-900"
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </Link>
                          <DeleteButton id={p.id} name={fullName} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
