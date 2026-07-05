import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, ClipboardList, Tag, TrendingUp } from "lucide-react";

export const metadata = { title: "Dashboard — Admin" };

export default async function DashboardPage() {
  const [productCount, orderCount, featuredCount, saleCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.product.count({ where: { featured: true } }),
    prisma.product.count({ where: { onSale: true } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: true },
  });

  const stats = [
    { label: "Total Products", value: productCount, icon: ShoppingBag, href: "/admin/products" },
    { label: "Total Orders", value: orderCount, icon: ClipboardList, href: "/admin/orders" },
    { label: "Featured Kits", value: featuredCount, icon: TrendingUp, href: "/admin/products" },
    { label: "On Sale", value: saleCount, icon: Tag, href: "/admin/products" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase text-ink-900">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
          >
            <s.icon className="h-5 w-5 text-brand-500" />
            <p className="mt-3 text-2xl font-bold text-ink-900">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-sm text-muted">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-surface-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Items</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">Total</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-surface-muted">
                    <td className="px-4 py-3 font-mono text-xs text-brand-600">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-ink-900">{o.customerName}</td>
                    <td className="px-4 py-3 text-muted">{o.items.length}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-900">K{o.total}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold capitalize text-brand-700">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
