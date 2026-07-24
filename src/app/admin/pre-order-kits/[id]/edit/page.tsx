import { notFound } from "next/navigation";
import { getPreOrderKit } from "@/lib/pre-order-kits";
import { KitForm } from "../../kit-form";

export const metadata = { title: "Edit Pre-order Kit — Admin" };

export default async function EditPreOrderKitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kit = await getPreOrderKit(id);
  if (!kit) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold uppercase text-ink-900">Edit pre-order kit</h1>
      <div className="rounded-2xl border border-border bg-white p-6">
        <KitForm
          kitId={kit.id}
          defaultValues={{
            club: kit.club,
            kitName: kit.kitName,
            price: kit.price,
            status: kit.status,
            demandPercent: kit.demandPercent,
            defaultImageIndex: kit.defaultImageIndex,
            imageUrls: kit.images.join("\n"),
          }}
        />
      </div>
    </div>
  );
}
