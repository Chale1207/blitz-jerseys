import { prisma } from "@/lib/prisma";
import { OrdersTable } from "./orders-table";

export const metadata = { title: "Orders — Admin" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold uppercase text-ink-900">Orders</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
