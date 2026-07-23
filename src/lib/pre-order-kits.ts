export type PreOrderKit = {
  id: string;
  club: string;
  kitName: string;
  fullName: string;
  images: string[];
  defaultImageIndex: number;
  price: number;
  status: "open" | "coming-soon" | "notify";
  demandPercent: number;
};

export const PRE_ORDER_KITS: PreOrderKit[] = [
  {
    id: "chelsea-away-2627",
    club: "Chelsea FC",
    kitName: "2026/27 Away Kit",
    fullName: "Chelsea FC 2026/27 Away Kit",
    images: ["/images/pre-orders/chelsea-away-1-v2.jpg", "/images/pre-orders/chelsea-away-2-v2.jpg"],
    defaultImageIndex: 0,
    price: 850,
    status: "open",
    demandPercent: 73,
  },
  {
    id: "man-utd-away-2627",
    club: "Manchester United",
    kitName: "2026/27 Away Kit",
    fullName: "Manchester United 2026/27 Away Kit",
    images: ["/images/pre-orders/man-utd-away-1-v2.jpg", "/images/pre-orders/man-utd-away-2-v2.jpg"],
    defaultImageIndex: 1,
    price: 850,
    status: "open",
    demandPercent: 41,
  },
  {
    id: "real-madrid-away-2627",
    club: "Real Madrid",
    kitName: "2026/27 Away Kit",
    fullName: "Real Madrid 2026/27 Away Kit",
    images: ["/images/pre-orders/real-madrid-away-1-v2.jpg", "/images/pre-orders/real-madrid-away-2-v2.jpg"],
    defaultImageIndex: 0,
    price: 850,
    status: "open",
    demandPercent: 29,
  },
  {
    id: "barcelona-away-2627",
    club: "FC Barcelona",
    kitName: "2026/27 Away Kit",
    fullName: "FC Barcelona 2026/27 Away Kit",
    images: ["/images/pre-orders/barcelona-away-1-v2.jpg", "/images/pre-orders/barcelona-away-2-v2.jpg"],
    defaultImageIndex: 0,
    price: 850,
    status: "notify",
    demandPercent: 0,
  },
];

export function getPreOrderKit(id: string): PreOrderKit | undefined {
  return PRE_ORDER_KITS.find((k) => k.id === id);
}
