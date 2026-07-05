"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { FloatingShopBtn } from "./floating-shop-btn";

export function SiteChrome({
  children,
  navbar,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <main className="flex-1">{children}</main>
      <FloatingShopBtn />
      <Footer />
    </>
  );
}
