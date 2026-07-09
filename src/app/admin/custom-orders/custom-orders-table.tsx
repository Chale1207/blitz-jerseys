"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { StatusSelect } from "./status-select";
import { DeleteButton } from "./delete-button";
import { AssignStockDialog } from "./assign-stock-dialog";
import { CUSTOM_ORDER_STATUSES, CUSTOM_ORDER_STATUS_LABELS } from "@/lib/custom-order-status";

type StockOption = {
  id: string;
  stock: number;
  size: string;
  productName: string;
  teamName: string;
  kitType: string;
};

type CustomOrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  whatsapp: string;
  club: string;
  kitDescription: string;
  size: string;
  quantity: number;
  nameAndNumber: string | null;
  status: string;
  createdAt: Date;
  assignedVariant: {
    size: string;
    product: { name: string; team: { name: string } };
  } | null;
};

export function CustomOrdersTable({
  customOrders,
  stockOptions,
}: {
  customOrders: CustomOrderRow[];
  stockOptions: StockOption[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customOrders.filter((o) => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const matchesQuery =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.whatsapp.toLowerCase().includes(q) ||
        o.club.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [customOrders, query, statusFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search request #, customer, club…"
            className="admin-input pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              statusFilter === "all" ? "bg-ink-900 text-white" : "bg-surface-muted text-muted hover:text-ink-900"
            }`}
          >
            All ({customOrders.length})
          </button>
          {CUSTOM_ORDER_STATUSES.map((s) => {
            const count = customOrders.filter((o) => o.status === s).length;
            if (count === 0) return null;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  statusFilter === s ? "bg-ink-900 text-white" : "bg-surface-muted text-muted hover:text-ink-900"
                }`}
              >
                {CUSTOM_ORDER_STATUS_LABELS[s]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        {filtered.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted">
            {customOrders.length === 0 ? "No custom order requests yet." : "No requests match your search."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="border-b border-border bg-surface-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Request #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">WhatsApp</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Requested Kit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Size / Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">Assignment</th>
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
                    <td className="px-4 py-3 text-muted">{o.whatsapp}</td>
                    <td className="px-4 py-3 text-muted">
                      <span className="block font-medium text-ink-900">{o.club}</span>
                      <span className="block text-xs">{o.kitDescription}</span>
                      {o.nameAndNumber ? (
                        <span className="block text-xs">Print: {o.nameAndNumber}</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {o.size} × {o.quantity}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AssignStockDialog
                        customOrderId={o.id}
                        club={o.club}
                        size={o.size}
                        assignedVariant={o.assignedVariant}
                        stockOptions={stockOptions}
                      />
                    </td>
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
                      <DeleteButton id={o.id} orderNumber={o.orderNumber} />
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
