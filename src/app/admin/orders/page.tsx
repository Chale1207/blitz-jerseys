import { prisma } from "@/lib/prisma";
import { StatusSelect } from "./status-select";

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

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        {orders.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Order #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">City</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Items</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">Total</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-surface-muted">
                  <td className="px-4 py-3 font-mono text-xs text-brand-600">{o.orderNumber}</td>
                  <td className="px-4 py-3 font-medium text-ink-900">{o.customerName}</td>
                  <td className="px-4 py-3 text-muted">{o.phone}</td>
                  <td className="px-4 py-3 text-muted">{o.city}</td>
                  <td className="px-4 py-3 text-muted">
                    {o.items.map((item) => (
                      <span key={item.id} className="block text-xs">
                        {item.productName} — {item.size} × {item.quantity}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-ink-900">K{o.total}</td>
                  <td className="px-4 py-3 text-right">
                    <StatusSelect id={o.id} status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted">
                    {new Date(o.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
