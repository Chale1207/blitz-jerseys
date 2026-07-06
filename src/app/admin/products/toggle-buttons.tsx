"use client";

import { useState, useTransition } from "react";
import { Star, Tag } from "lucide-react";
import { toast } from "sonner";
import { toggleFeatured, toggleOnSale } from "./actions";

export function ToggleFeaturedButton({ id, name, featured }: { id: string; name: string; featured: boolean }) {
  const [current, setCurrent] = useState(featured);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      title={current ? "Remove from featured" : "Mark as featured"}
      onClick={() => {
        const next = !current;
        setCurrent(next);
        startTransition(async () => {
          try {
            await toggleFeatured(id, current);
            toast.success(next ? `${name} is now featured` : `${name} removed from featured`);
          } catch {
            setCurrent(current);
            toast.error("Couldn't update — try again.");
          }
        });
      }}
      className={`rounded-lg p-1.5 transition-colors disabled:opacity-50 ${current ? "text-brand-500 hover:text-brand-700" : "text-muted hover:text-brand-500"}`}
    >
      <Star className="h-4 w-4" fill={current ? "currentColor" : "none"} />
    </button>
  );
}

export function ToggleOnSaleButton({ id, name, onSale }: { id: string; name: string; onSale: boolean }) {
  const [current, setCurrent] = useState(onSale);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      title={current ? "Remove from sale" : "Put on sale"}
      onClick={() => {
        const next = !current;
        setCurrent(next);
        startTransition(async () => {
          try {
            await toggleOnSale(id, current);
            toast.success(next ? `${name} is now on sale` : `${name} removed from sale`);
          } catch {
            setCurrent(current);
            toast.error("Couldn't update — try again.");
          }
        });
      }}
      className={`rounded-lg p-1.5 transition-colors disabled:opacity-50 ${current ? "text-accent-500 hover:text-accent-600" : "text-muted hover:text-accent-500"}`}
    >
      <Tag className="h-4 w-4" fill={current ? "currentColor" : "none"} />
    </button>
  );
}
