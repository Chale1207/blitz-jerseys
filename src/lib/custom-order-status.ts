export const CUSTOM_ORDER_STATUSES = [
  "new",
  "confirmed",
  "assigned",
  "sourcing",
  "ready",
  "courier_assigned",
  "delivered",
  "cancelled",
] as const;

export type CustomOrderStatus = (typeof CUSTOM_ORDER_STATUSES)[number];

export const CUSTOM_ORDER_STATUS_STYLES: Record<string, string> = {
  new: "bg-accent-500/10 text-accent-600",
  confirmed: "bg-brand-500/10 text-brand-700",
  assigned: "bg-brand-500/15 text-brand-700",
  sourcing: "bg-accent-500/15 text-accent-700",
  ready: "bg-brand-500/20 text-brand-800",
  courier_assigned: "bg-brand-500/20 text-brand-800",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
};

export const CUSTOM_ORDER_STATUS_LABELS: Record<string, string> = {
  new: "Request Received",
  confirmed: "Confirmed",
  assigned: "In Stock — Printing",
  sourcing: "Being Sourced",
  ready: "Ready for Delivery",
  courier_assigned: "With Courier",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const CUSTOM_ORDER_STATUS_MESSAGES: Record<
  string,
  { heading: (firstName: string) => string; body: (orderNumber: string) => string }
> = {
  new: {
    heading: (name) => `Thanks, ${name}!`,
    body: (orderNumber) =>
      `Your custom order request ${orderNumber} has been received. We'll confirm on WhatsApp shortly.`,
  },
  confirmed: {
    heading: (name) => `You're All Set, ${name}!`,
    body: (orderNumber) => `Your custom order ${orderNumber} has been confirmed with you on WhatsApp.`,
  },
  assigned: {
    heading: (name) => `Good News, ${name}!`,
    body: (orderNumber) =>
      `We found ${orderNumber} in stock already — it's being prepared with your name and number printed.`,
  },
  sourcing: {
    heading: (name) => `On It, ${name}!`,
    body: (orderNumber) =>
      `Your custom order ${orderNumber} isn't in stock yet, so we're sourcing it for you.`,
  },
  ready: {
    heading: (name) => `Ready to Go, ${name}!`,
    body: (orderNumber) => `Your custom order ${orderNumber} is ready and about to be handed to our courier.`,
  },
  courier_assigned: {
    heading: (name) => `On Its Way, ${name}!`,
    body: (orderNumber) => `Your custom order ${orderNumber} has been handed to our courier.`,
  },
  delivered: {
    heading: (name) => `Delivered, ${name}!`,
    body: (orderNumber) =>
      `Your custom order ${orderNumber} has been delivered. Thanks for shopping with Blitz Jerseys!`,
  },
  cancelled: {
    heading: () => "Request Cancelled",
    body: (orderNumber) =>
      `Your custom order ${orderNumber} was cancelled. Message us on WhatsApp if this doesn't look right.`,
  },
};
