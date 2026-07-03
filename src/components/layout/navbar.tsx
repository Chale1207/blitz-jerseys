import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const leagues = await prisma.league.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="container-page relative flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-ink-900 md:text-2xl">
          BLITZ<span className="text-brand-500">JERSEYS</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {leagues.map((league) => (
            <Link
              key={league.slug}
              href={`/shop/${league.slug}`}
              className="text-sm font-semibold uppercase tracking-wide text-ink-900 transition-colors hover:text-brand-500"
            >
              {league.name}
            </Link>
          ))}
          <Link
            href="/shop"
            className="text-sm font-semibold uppercase tracking-wide text-brand-600 transition-colors hover:text-brand-500"
          >
            Shop All
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold uppercase tracking-wide text-ink-900 transition-colors hover:text-brand-500"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold uppercase tracking-wide text-ink-900 transition-colors hover:text-brand-500"
          >
            Contact
          </Link>
        </nav>

        <NavbarClient leagues={leagues} />
      </div>
    </header>
  );
}
