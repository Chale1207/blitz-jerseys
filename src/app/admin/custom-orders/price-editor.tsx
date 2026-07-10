"use client";

import { useState, useTransition } from "react";
import { Check, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { setCustomOrderPrice } from "./actions";
import { formatPrice } from "@/lib/format";

export function PriceEditor({ id, totalPrice }: { id: string; totalPrice: number | null }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(totalPrice != null ? String(totalPrice) : "");
  const [isPending, startTransition] = useTransition();

  function save() {
    const trimmed = value.trim();
    const parsed = trimmed === "" ? null : Number(trimmed);
    if (trimmed !== "" && (Number.isNaN(parsed) || (parsed as number) < 0)) {
      toast.error("Enter a valid price.");
      return;
    }
    startTransition(async () => {
      try {
        await setCustomOrderPrice(id, parsed);
        toast.success(parsed == null ? "Price cleared" : `Price set to ${formatPrice(parsed as number)}`);
        setEditing(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't update price — try again.");
      }
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setValue(totalPrice != null ? String(totalPrice) : "");
          setEditing(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-ink-900 transition-colors hover:bg-surface-muted"
      >
        {totalPrice != null ? (
          formatPrice(totalPrice)
        ) : (
          <span className="text-muted">Not set</span>
        )}
        <Pencil className="h-3 w-3 text-muted" />
      </button>
    );
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <input
        autoFocus
        type="number"
        min={0}
        value={value}
        disabled={isPending}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
        placeholder="K amount"
        className="w-24 rounded-lg border border-border px-2 py-1 text-right text-xs outline-none focus:border-brand-500"
      />
      <button
        type="button"
        disabled={isPending}
        onClick={save}
        title="Save"
        className="rounded-lg p-1 text-brand-600 hover:bg-brand-500/10 disabled:opacity-50"
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setEditing(false)}
        title="Cancel"
        className="rounded-lg p-1 text-muted hover:bg-surface-muted disabled:opacity-50"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
