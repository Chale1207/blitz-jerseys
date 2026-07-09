"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateCustomOrderStatus } from "./actions";
import {
  CUSTOM_ORDER_STATUSES,
  CUSTOM_ORDER_STATUS_STYLES,
  CUSTOM_ORDER_STATUS_LABELS,
} from "@/lib/custom-order-status";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  // Status can also change from outside this component (e.g. the "Assign
  // In-Stock Item" action flips it to "assigned" and revalidates the page) —
  // resync local state so the dropdown doesn't show a stale label.
  useEffect(() => {
    if (!isPending) setCurrent(status);
  }, [status, isPending]);

  return (
    <Select
      value={current}
      disabled={isPending}
      onValueChange={(next) => {
        const previous = current;
        setCurrent(next);
        startTransition(async () => {
          try {
            await updateCustomOrderStatus(id, next);
            toast.success(`Marked ${CUSTOM_ORDER_STATUS_LABELS[next]?.toLowerCase() ?? next}`);
          } catch {
            setCurrent(previous);
            toast.error("Couldn't update status — try again.");
          }
        });
      }}
    >
      <SelectTrigger className={`${CUSTOM_ORDER_STATUS_STYLES[current] ?? "bg-surface-muted text-muted"}`}>
        <SelectValue>{CUSTOM_ORDER_STATUS_LABELS[current] ?? current}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {CUSTOM_ORDER_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {CUSTOM_ORDER_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
