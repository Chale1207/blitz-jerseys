import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Star, Tag } from "lucide-react";
import { toggleFeatured, toggleOnSale } from "./actions";
import { DeleteButton } from "./delete-button";

export const metadata = { title: "Products — Admin" };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { team: { include: { league: true } }, variants: true },
    orderBy: [{ team: { name: "asc" } }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase text-ink-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          Add kit
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        {products.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted">
            No products yet.{" "}
            <Link href="/admin/products/new" className="font-semibold text-brand-600">
              Add your first kit →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
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
              {products.map((p) => {
                const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-surface-muted">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink-900">{p.name}</p>
                      <p className="text-xs text-muted">{p.kitType}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">{p.team.league.name}</td>
                    <td className="px-4 py-3 text-muted">{p.season}</td>
                    <td className="px-4 py-3 font-semibold text-ink-900">K{p.price}</td>
                    <td className="px-4 py-3 text-muted">{totalStock}</td>
                    <td className="px-4 py-3 text-center">
                      <form action={toggleFeatured.bind(null, p.id, p.featured)}>
                        <button
                          type="submit"
                          title={p.featured ? "Remove from featured" : "Mark as featured"}
                          className={`rounded-lg p-1.5 transition-colors ${p.featured ? "text-brand-500 hover:text-brand-700" : "text-muted hover:text-brand-500"}`}
                        >
                          <Star className="h-4 w-4" fill={p.featured ? "currentColor" : "none"} />
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <form action={toggleOnSale.bind(null, p.id, p.onSale)}>
                        <button
                          type="submit"
                          title={p.onSale ? "Remove from sale" : "Put on sale"}
                          className={`rounded-lg p-1.5 transition-colors ${p.onSale ? "text-accent-500 hover:text-accent-600" : "text-muted hover:text-accent-500"}`}
                        >
                          <Tag className="h-4 w-4" fill={p.onSale ? "currentColor" : "none"} />
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-ink-900"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </Link>
                        <DeleteButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
