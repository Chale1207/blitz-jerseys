import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";
import { createProduct } from "../actions";

export const metadata = { title: "Add Kit — Admin" };

export default async function NewProductPage() {
  const teams = await prisma.team.findMany({
    include: { league: true },
    orderBy: [{ league: { name: "asc" } }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold uppercase text-ink-900">Add kit</h1>
      <div className="rounded-2xl border border-border bg-white p-6">
        <ProductForm teams={teams} action={createProduct} />
      </div>
    </div>
  );
}
