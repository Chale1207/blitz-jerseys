import { ORDER_STATUS_STYLES } from "@/lib/order-status";

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        ORDER_STATUS_STYLES[status] ?? "bg-surface-muted text-muted"
      }`}
    >
      {status}
    </span>
  );
}
