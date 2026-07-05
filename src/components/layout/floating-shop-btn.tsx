"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";

const HIDE_ON = ["/cart", "/checkout", "/shop"];

export function FloatingShopBtn() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDE_ON.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }

  return (
    <div
      aria-hidden={!visible}
      className="fixed bottom-6 right-6 z-50"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Link
        href="/shop"
        className="glossy hover-glow inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-brand-lg transition-transform duration-200 hover:scale-105 hover:bg-brand-600 active:scale-95"
      >
        <ShoppingBag className="h-4 w-4" />
        Shop Now
      </Link>
    </div>
  );
}
