"use client";

import { deleteProduct } from "./actions";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProduct.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted hover:border-danger hover:text-danger"
      >
        Delete
      </button>
    </form>
  );
}
