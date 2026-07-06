import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductsTable } from "./products-table";

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

      <ProductsTable products={products} />
    </div>
  );
}
