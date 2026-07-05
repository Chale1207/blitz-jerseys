import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "../../product-form";
import { updateProduct } from "../../actions";

export const metadata = { title: "Edit Kit — Admin" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, teams] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    }),
    prisma.team.findMany({
      include: { league: true },
      orderBy: [{ league: { name: "asc" } }, { name: "asc" }],
    }),
  ]);

  if (!product) notFound();

  const existingImages = product.imagesJson
    ? (JSON.parse(product.imagesJson) as { src: string }[]).map((i) => i.src).join("\n")
    : "";

  const action = updateProduct.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold uppercase text-ink-900">Edit kit</h1>
      <div className="rounded-2xl border border-border bg-white p-6">
        <ProductForm
          teams={teams}
          action={action}
          defaultValues={{
            teamId: product.teamId,
            name: product.name,
            kitType: product.kitType,
            season: product.season,
            price: product.price,
            description: product.description,
            featured: product.featured,
            onSale: product.onSale,
            imageUrls: existingImages,
            variants: product.variants.map((v) => ({ size: v.size, stock: v.stock })),
          }}
        />
      </div>
    </div>
  );
}
