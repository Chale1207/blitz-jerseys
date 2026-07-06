"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteProduct } from "./actions";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        startTransition(async () => {
          try {
            await deleteProduct(id);
            toast.success(`"${name}" deleted`);
          } catch {
            toast.error("Couldn't delete — try again.");
          }
        });
      }}
      className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-danger hover:text-danger disabled:opacity-50"
    >
      Delete
    </button>
  );
}
