export const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-accent-500/10 text-accent-600",
  confirmed: "bg-brand-500/10 text-brand-700",
  cancelled: "bg-danger/10 text-danger",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Order Received",
  confirmed: "Confirmed",
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
  cancelled: {
    heading: () => "Order Cancelled",
    body: (orderNumber) =>
      `Your order ${orderNumber} was cancelled. If this doesn't look right, message us on WhatsApp and we'll sort it out.`,
    whatsappLabel: "Message Us on WhatsApp",
  },
};
