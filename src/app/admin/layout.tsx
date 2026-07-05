"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, ClipboardList, LogOut, Menu, X } from "lucide-react";
import { logoutAction } from "./login/actions";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#f0faf8]">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-ink-900 px-4 py-3 md:hidden">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-300">
            Blitz Jerseys
          </p>
          <p className="text-xs font-medium text-white/40">Admin</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="p-1 text-white/70 hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Backdrop (mobile only) */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-ink-900 py-8 transition-transform duration-200 md:static md:z-auto md:w-56 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pb-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-300">
              Blitz Jerseys
            </p>
            <p className="mt-0.5 text-xs font-medium text-white/40">Admin</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="p-1 text-white/50 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-500/20 text-brand-300"
                    : "text-white/60 hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition-colors hover:text-white/70"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pt-20 md:p-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}
