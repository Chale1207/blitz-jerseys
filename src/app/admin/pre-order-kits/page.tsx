import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllPreOrderKits } from "@/lib/pre-order-kits";
import { KitsTable } from "./kits-table";

export const metadata = { title: "Pre-order Kits — Admin" };
export const dynamic = "force-dynamic";

export default async function PreOrderKitsPage() {
  const kits = await getAllPreOrderKits();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-ink-900">Pre-order Kits</h1>
          <p className="mt-1 text-sm text-muted">
            The kits shown on the public /pre-orders page. {kits.length} kit{kits.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <Link
          href="/admin/pre-order-kits/new"
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          Add kit
        </Link>
      </div>

      <KitsTable kits={kits} />
    </div>
  );
}
