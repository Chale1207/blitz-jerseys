import { formatPrice } from "./format";

export interface WhatsAppOrderItem {
  teamName: string;
  productName: string;
  kitType: string;
  size: string;
  quantity: number;
  price: number;
}

export function buildOrderWhatsAppLink(params: {
  orderNumber: string;
  customerName: string;
  address: string;
  city: string;
  items: WhatsAppOrderItem[];
  total: number;
}): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const lines = [
    `Hi Blitz Jerseys! I just placed order ${params.orderNumber}.`,
    ``,
    `Name: ${params.customerName}`,
    `Delivery: ${params.address}, ${params.city}`,
    ``,
    `Items:`,
    ...params.items.map(
      (item) =>
        `- ${item.teamName} ${item.productName} (${item.kitType}, size ${item.size}) x${item.quantity} - ${formatPrice(
          item.price * item.quantity
        )}`
    ),
    ``,
    `Total: ${formatPrice(params.total)}`,
    ``,
    `Please confirm my order. Thank you!`,
  ];

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${number}?text=${text}`;
}

export function buildCustomOrderWhatsAppLink(params: {
  customerName: string;
  whatsapp: string;
  club: string;
  kitDescription: string;
  size: string;
  nameAndNumber?: string;
  quantity: string;
  notes?: string;
}): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const lines = [
    `Hi Blitz Jerseys! I'd like to place a custom order.`,
    ``,
    `Name: ${params.customerName}`,
    `WhatsApp: ${params.whatsapp}`,
    `Club: ${params.club}`,
    `Kit: ${params.kitDescription}`,
    `Size: ${params.size}`,
    `Quantity: ${params.quantity}`,
    ...(params.nameAndNumber ? [`Name/Number for printing: ${params.nameAndNumber}`] : []),
    ...(params.notes ? [``, `Notes: ${params.notes}`] : []),
    ``,
    `I'll send a reference photo here if I have one. Please confirm price and delivery time. Thank you!`,
  ];

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${number}?text=${text}`;
}
