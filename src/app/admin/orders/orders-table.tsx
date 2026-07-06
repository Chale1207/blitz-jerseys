"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { StatusSelect } from "./status-select";
import { DeleteOrderButton } from "./delete-order-button";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-status";

type OrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  status: string;
  total: number;
  createdAt: Date;
  items: { id: string; productName: string; size: string; quantity: number }[];
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const matchesQuery =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, statusFilter]);

  return (
    <div>
      {/* Search + status filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order #, customer, phone, city…"
            className="admin-input pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              statusFilter === "all"
                ? "bg-ink-900 text-white"
                : "bg-surface-muted text-muted hover:text-ink-900"
            }`}
          >
            All ({orders.length})
          </button>
          {ORDER_STATUSES.map((s) => {
            const count = orders.filter((o) => o.status === s).length;
            if (count === 0) return null;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-ink-900 text-white"
                    : "bg-surface-muted text-muted hover:text-ink-900"
                }`}
              >
                {ORDER_STATUS_LABELS[s]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        {filtered.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted">
            {orders.length === 0 ? "No orders yet." : "No orders match your search."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
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
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((o) => (
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
                    <td className="px-4 py-3 text-right">
                      <DeleteOrderButton id={o.id} orderNumber={o.orderNumber} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
