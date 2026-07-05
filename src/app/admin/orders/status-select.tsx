"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "./actions";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-accent-500/10 text-accent-600",
  confirmed: "bg-brand-500/10 text-brand-700",
  cancelled: "bg-danger/10 text-danger",
};

export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => {
          updateOrderStatus(id, next);
        });
      }}
      className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none disabled:opacity-50 ${
        STATUS_STYLES[status] ?? "bg-surface-muted text-muted"
      }`}
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
