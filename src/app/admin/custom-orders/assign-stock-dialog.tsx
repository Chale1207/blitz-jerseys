"use client";

import { useMemo, useState, useTransition } from "react";
import { PackageCheck, Search, X } from "lucide-react";
import { toast } from "sonner";
import { assignStockToCustomOrder, unassignStockFromCustomOrder } from "./actions";

type StockOption = {
  id: string;
  stock: number;
  size: string;
  productName: string;
  teamName: string;
  kitType: string;
};

type AssignedVariant = {
  size: string;
  product: { name: string; team: { name: string } };
} | null;

export function AssignStockDialog({
  customOrderId,
  club,
  size,
  assignedVariant,
  stockOptions,
}: {
  customOrderId: string;
  club: string;
  size: string;
  assignedVariant: AssignedVariant;
  stockOptions: StockOption[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(club);
  const [isPending, startTransition] = useTransition();

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stockOptions;
    return stockOptions.filter(
      (o) =>
        o.teamName.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        o.kitType.toLowerCase().includes(q)
    );
  }, [query, stockOptions]);

  function handleAssign(variantId: string) {
    startTransition(async () => {
      try {
        await assignStockToCustomOrder(customOrderId, variantId);
        toast.success("Stock assigned — printing name & number.");
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't assign stock — try again.");
      }
    });
  }

  function handleUnassign() {
    startTransition(async () => {
      try {
        await unassignStockFromCustomOrder(customOrderId);
        toast.success("Assignment reverted, stock restored.");
      } catch {
        toast.error("Couldn't revert assignment — try again.");
      }
    });
  }

  if (assignedVariant) {
    return (
      <div className="flex items-center justify-end gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2.5 py-1 font-semibold text-brand-700">
          <PackageCheck className="h-3 w-3" />
          {assignedVariant.product.team.name} {assignedVariant.product.name} ({assignedVariant.size})
        </span>
        <button
          type="button"
          disabled={isPending}
          onClick={handleUnassign}
          className="text-muted hover:text-danger disabled:opacity-50"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-brand-500 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-500/10"
      >
        Assign In-Stock Item
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-border bg-white p-5 shadow-brand-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-900">
                Assign Stock — size {size}
              </h3>
              <button type="button" onClick={() => setOpen(false)} className="text-muted hover:text-ink-900">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search team, kit…"
                className="admin-input pl-9"
              />
            </div>

            <div className="max-h-80 space-y-1.5 overflow-y-auto">
              {matches.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">No in-stock items match.</p>
              ) : (
                matches.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    disabled={isPending}
                    onClick={() => handleAssign(o.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-left text-sm transition-colors hover:border-brand-500 hover:bg-brand-500/5 disabled:opacity-50"
                  >
                    <span>
                      <span className="font-medium text-ink-900">
                        {o.teamName} {o.productName}
                      </span>
                      <span className="block text-xs text-muted">
                        {o.kitType} · Size {o.size}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-surface-muted px-2 py-1 text-xs font-semibold text-muted">
                      {o.stock} in stock
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
