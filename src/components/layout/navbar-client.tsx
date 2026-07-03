"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

type League = { slug: string; name: string };

export function NavbarClient({ leagues }: { leagues: League[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/cart"
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-900 transition-transform duration-200 hover:scale-105 hover:bg-brand-50"
        aria-label="View cart"
      >
        <ShoppingBag className="h-5 w-5" />
        {mounted && totalItems > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-ink-900">
            {totalItems}
          </span>
        ) : null}
      </Link>

      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-900 md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-border bg-surface shadow-lg md:hidden">
          <nav className="container-page flex flex-col py-2">
            {leagues.map((league) => (
              <Link
                key={league.slug}
                href={`/shop/${league.slug}`}
                className="border-b border-border py-3 text-sm font-medium uppercase tracking-wide text-ink-900 last:border-none"
                onClick={() => setOpen(false)}
              >
                {league.name}
              </Link>
            ))}
            <Link
              href="/shop"
              className="py-3 text-sm font-medium uppercase tracking-wide text-brand-600"
              onClick={() => setOpen(false)}
            >
              Shop All
            </Link>
            <Link
              href="/about"
              className="py-3 text-sm font-medium uppercase tracking-wide text-ink-900"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="py-3 text-sm font-medium uppercase tracking-wide text-ink-900"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
