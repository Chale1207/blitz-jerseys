"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "./actions";
import { ORDER_STATUSES, ORDER_STATUS_STYLES, ORDER_STATUS_LABELS } from "@/lib/order-status";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={current}
      disabled={isPending}
      onValueChange={(next) => {
        const previous = current;
        setCurrent(next);
        startTransition(async () => {
          try {
            await updateOrderStatus(id, next);
            toast.success(`Order marked ${ORDER_STATUS_LABELS[next]?.toLowerCase() ?? next}`);
          } catch {
            setCurrent(previous);
            toast.error("Couldn't update order status — try again.");
          }
        });
      }}
    >
      <SelectTrigger
        className={`${ORDER_STATUS_STYLES[current] ?? "bg-surface-muted text-muted"}`}
      >
        <SelectValue>{ORDER_STATUS_LABELS[current] ?? current}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {ORDER_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
