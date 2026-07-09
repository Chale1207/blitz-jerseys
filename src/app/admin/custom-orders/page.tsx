import { prisma } from "@/lib/prisma";
import { CustomOrdersTable } from "./custom-orders-table";

export const metadata = { title: "Custom Orders — Admin" };
export const dynamic = "force-dynamic";

export default async function CustomOrdersPage() {
  const [customOrders, variants] = await Promise.all([
    prisma.customOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: { assignedVariant: { include: { product: { include: { team: true } } } } },
    }),
    prisma.productVariant.findMany({
      where: { stock: { gt: 0 } },
      include: { product: { include: { team: true } } },
      orderBy: [{ product: { team: { name: "asc" } } }, { size: "asc" }],
    }),
  ]);

  const stockOptions = variants.map((v) => ({
    id: v.id,
    stock: v.stock,
    size: v.size,
    productName: v.product.name,
    teamName: v.product.team.name,
    kitType: v.product.kitType,
  }));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold uppercase text-ink-900">Custom Orders</h1>
      <CustomOrdersTable customOrders={customOrders} stockOptions={stockOptions} />
    </div>
  );
}
