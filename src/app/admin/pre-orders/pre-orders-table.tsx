"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Trash2 } from "lucide-react";
import { updatePreOrderStatus, deletePreOrder } from "./actions";

type PreOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  whatsapp: string;
  kitId: string;
  kitName: string;
  size: string;
  sleeveType: string;
  quantity: number;
  status: string;
  notes: string | null;
  createdAt: Date;
};

const STATUSES = ["pending", "confirmed", "ready", "delivered", "waitlist", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  ready: "bg-brand-100 text-brand-700",
  delivered: "bg-green-100 text-green-700",
  waitlist: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

function StatusSelect({ id, status }: { id: string; status: string }) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setCurrent(next);
    startTransition(() => updatePreOrderStatus(id, next));
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={isPending}
      className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[current] ?? "bg-gray-100 text-gray-600"}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
      ))}
    </select>
  );
}

export function PreOrdersTable({ preOrders }: { preOrders: PreOrder[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kitFilter, setKitFilter] = useState("all");
  const [, startTransition] = useTransition();

  const kits = useMemo(() => {
    const seen = new Map<string, string>();
    for (const o of preOrders) seen.set(o.kitId, o.kitName);
    return Array.from(seen.entries());
  }, [preOrders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return preOrders.filter((o) => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const matchesKit = kitFilter === "all" || o.kitId === kitFilter;
      const matchesQuery =
        !q ||
        [o.customerName, o.kitName, o.orderNumber, o.whatsapp].join(" ").toLowerCase().includes(q);
      return matchesStatus && matchesKit && matchesQuery;
    });
  }, [preOrders, search, statusFilter, kitFilter]);

  const waitlistCount = preOrders.filter((o) => o.status === "waitlist").length;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search by name, kit, or reference…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
          />
        </div>
        {kits.length > 1 ? (
          <select
            value={kitFilter}
            onChange={(e) => setKitFilter(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-500"
          >
            <option value="all">All kits</option>
            {kits.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        ) : null}
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            statusFilter === "all" ? "bg-ink-900 text-white" : "bg-surface-muted text-muted hover:text-ink-900"
          }`}
        >
          All ({preOrders.length})
        </button>
        {STATUSES.map((s) => {
          const count = preOrders.filter((o) => o.status === s).length;
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
              {s} ({count})
            </button>
          );
        })}
      </div>

      {waitlistCount > 0 ? (
        <p className="mb-3 text-xs text-muted">
          {waitlistCount} customer{waitlistCount !== 1 ? "s" : ""} waiting to be notified when an unconfirmed kit opens for pre-order.
        </p>
      ) : null}

      <div className="rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Kit</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted">
                    {search || statusFilter !== "all" || kitFilter !== "all"
                      ? "No pre-orders match your filters."
                      : "No pre-orders yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-ink-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-muted">{o.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink-900">{o.customerName}</p>
                      <a
                        href={`https://wa.me/${o.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-600 hover:underline"
                      >
                        {o.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-ink-900">{o.kitName}</td>
                    <td className="px-4 py-3">
                      {o.status === "waitlist" ? (
                        <span className="text-xs text-muted">—</span>
                      ) : (
                        <>
                          <span className="font-semibold">{o.size}</span>
                          <span className="ml-1 text-xs text-muted">
                            {o.sleeveType === "long" ? "LS" : "SS"}
                          </span>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-900">
                      {o.status === "waitlist" ? <span className="text-xs text-muted">—</span> : o.quantity}
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect id={o.id} status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {new Date(o.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        aria-label="Delete"
                        onClick={() => {
                          if (!confirm("Delete this pre-order?")) return;
                          startTransition(() => deletePreOrder(o.id));
                        }}
                        className="rounded p-1 text-muted hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
