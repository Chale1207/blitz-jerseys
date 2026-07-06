"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteOrder } from "./actions";

export function DeleteOrderButton({ id, orderNumber }: { id: string; orderNumber: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      title="Delete order"
      onClick={() => {
        if (!confirm(`Delete order ${orderNumber}? This cannot be undone.`)) return;
        startTransition(async () => {
          try {
            await deleteOrder(id);
            toast.success(`Order ${orderNumber} deleted`);
          } catch {
            toast.error("Couldn't delete order — try again.");
          }
        });
      }}
      className="rounded-lg p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
