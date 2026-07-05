import { redirect } from "next/navigation";
import { Search } from "lucide-react";

export const metadata = { title: "Track Order" };

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const { orderNumber } = await searchParams;

  if (orderNumber && orderNumber.trim()) {
    redirect(`/order-confirmation/${orderNumber.trim()}`);
  }

  return (
    <div className="container-page flex flex-col items-center py-16 text-center">
      <span className="rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
        Track Order
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold uppercase text-ink-900 md:text-4xl">
        Where&apos;s My Kit?
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Enter the order number we gave you at checkout to see its current status.
      </p>

      <form className="mt-8 flex w-full max-w-sm gap-2">
        <input
          name="orderNumber"
          type="text"
          required
          placeholder="e.g. BJ-20260705-1234"
          className="admin-input flex-1"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-600 active:scale-95"
        >
          <Search className="h-4 w-4" />
          Track
        </button>
      </form>
    </div>
  );
}
