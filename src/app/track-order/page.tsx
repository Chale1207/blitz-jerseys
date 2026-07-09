import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Track Order" };
export const dynamic = "force-dynamic";

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const { orderNumber } = await searchParams;
  const trimmed = orderNumber?.trim();
  let notFoundNumber: string | null = null;

  if (trimmed) {
    // A customer has no way to know whether their number came from a regular
    // checkout or a custom club order request, so this single form checks
    // both tables and routes to whichever one actually has it.
    const [order, customOrder] = await Promise.all([
      prisma.order.findUnique({ where: { orderNumber: trimmed }, select: { orderNumber: true } }),
      prisma.customOrder.findUnique({ where: { orderNumber: trimmed }, select: { orderNumber: true } }),
    ]);

    if (order) redirect(`/order-confirmation/${trimmed}`);
    if (customOrder) redirect(`/track-custom-order/${trimmed}`);
    notFoundNumber = trimmed;
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
        Enter the order number we gave you at checkout or on a custom order
        request to see its current status.
      </p>

      {notFoundNumber ? (
        <p className="mt-4 rounded-lg bg-danger/10 px-4 py-2 text-sm font-medium text-danger">
          We couldn&apos;t find an order with the number &quot;{notFoundNumber}
          &quot;. Double check it and try again.
        </p>
      ) : null}

      <form className="mt-8 flex w-full max-w-sm gap-2">
        <input
          name="orderNumber"
          type="text"
          required
          defaultValue={notFoundNumber ?? ""}
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
