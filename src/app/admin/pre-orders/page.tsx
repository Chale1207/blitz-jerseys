import { prisma } from "@/lib/prisma";
import { PreOrdersTable } from "./pre-orders-table";

export const dynamic = "force-dynamic";

export default async function AdminPreOrdersPage() {
  const preOrders = await prisma.preOrder.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Pre-orders</h1>
        <p className="mt-1 text-sm text-muted">{preOrders.length} pre-order{preOrders.length !== 1 ? "s" : ""}</p>
      </div>
      <PreOrdersTable preOrders={preOrders} />
    </div>
  );
}
