"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "./actions";
import { ORDER_STATUS_STYLES } from "@/lib/order-status";

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
        ORDER_STATUS_STYLES[status] ?? "bg-surface-muted text-muted"
      }`}
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
