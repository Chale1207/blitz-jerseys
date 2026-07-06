export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "courier_assigned",
  "courier_shared",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-accent-500/10 text-accent-600",
  confirmed: "bg-brand-500/10 text-brand-700",
  courier_assigned: "bg-brand-500/15 text-brand-700",
  courier_shared: "bg-brand-500/20 text-brand-800",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Order Received",
  confirmed: "Confirmed",
  courier_assigned: "With Courier",
  courier_shared: "Courier Details Shared",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_MESSAGES: Record<
  string,
  { heading: (firstName: string) => string; body: (orderNumber: string) => string; whatsappLabel: string }
> = {
  pending: {
    heading: (name) => `Thanks, ${name}!`,
    body: (orderNumber) =>
      `Your order ${orderNumber} has been saved. Tap below to send us your order on WhatsApp so we can confirm sizes, delivery cost, and timing.`,
    whatsappLabel: "Confirm via WhatsApp",
  },
  confirmed: {
    heading: (name) => `You're All Set, ${name}!`,
    body: (orderNumber) =>
      `Your order ${orderNumber} has been confirmed and we're getting it ready. Message us on WhatsApp if anything changes.`,
    whatsappLabel: "Message Us on WhatsApp",
  },
  courier_assigned: {
    heading: (name) => `On Its Way, ${name}!`,
    body: (orderNumber) =>
      `Your order ${orderNumber} has been handed to our courier. Details will be shared shortly.`,
    whatsappLabel: "Message Us on WhatsApp",
  },
  courier_shared: {
    heading: (name) => `Almost There, ${name}!`,
    body: (orderNumber) =>
      `Your order ${orderNumber} is with the courier and their contact details have been shared with you.`,
    whatsappLabel: "Message the Courier",
  },
  delivered: {
    heading: (name) => `Delivered, ${name}!`,
    body: (orderNumber) =>
      `Your order ${orderNumber} has been delivered. Thanks for shopping with Blitz Jerseys!`,
    whatsappLabel: "Message Us on WhatsApp",
  },
  cancelled: {
    heading: () => "Order Cancelled",
    body: (orderNumber) =>
      `Your order ${orderNumber} was cancelled. If this doesn't look right, message us on WhatsApp and we'll sort it out.`,
    whatsappLabel: "Message Us on WhatsApp",
  },
};
