import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MessageCircle, Truck } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { ProductCard } from "@/components/product/product-card";
import { ProductGrid } from "@/components/product/product-grid";
import { getFeaturedProducts, getLeaguesWithTeams, getPromoProducts } from "@/lib/products";

export default async function Home() {
  const [featured, leagues, promoProducts] = await Promise.all([
    getFeaturedProducts(8),
    getLeaguesWithTeams(),
    getPromoProducts(),
  ]);

  return (
    <div>
      <Hero />

      <section className="border-b border-border bg-surface">
        <div className="container-page grid grid-cols-1 gap-8 py-10 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-brand-500" />
            <div>
              <p className="text-sm font-semibold text-ink-900">Quality Match Fabric</p>
              <p className="text-xs text-muted">Breathable, built to move</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-brand-500" />
            <div>
              <p className="text-sm font-semibold text-ink-900">Nationwide Delivery</p>
              <p className="text-xs text-muted">Tracked, door to door</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-brand-500" />
            <div>
              <p className="text-sm font-semibold text-ink-900">WhatsApp Order Support</p>
              <p className="text-xs text-muted">Real replies, real fast</p>
            </div>
          </div>
        </div>
      </section>

      {promoProducts.length > 0 ? (
        <section className="relative overflow-hidden bg-gradient-to-r from-brand-900 via-brand-700 to-brand-500 py-10">
          <div className="container-page flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-300/80">
                Limited Stock &middot; Last Season
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold uppercase leading-tight text-white md:text-3xl">
                Promotions Are Live
              </h2>
              <p className="mt-1 text-sm text-white/70">
                2025/26 kits at clearance prices &mdash; while stock lasts.
              </p>
            </div>
            <Link
              href="/promotions"
              className="hover-glow inline-flex shrink-0 items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-900 transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Shop Promotions
            </Link>
          </div>
        </section>
      ) : null}

      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Shop by League
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase text-ink-900 md:text-3xl">
              Pick Your Competition
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {leagues.filter((l) => l.slug !== "serie-a").map((league) => (
            <Link
              key={league.slug}
              href={`/shop/${league.slug}`}
              className="hover-glow group relative overflow-hidden rounded-2xl bg-ink-900 px-10 py-12 text-white transition-transform duration-200 hover:-translate-y-1"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-300">
                {league.country}
              </p>
              <p className="mt-3 font-head text-4xl font-bold uppercase leading-none tracking-tight">
                {league.name}
              </p>
              <p className="mt-5 text-sm text-white/50">
                {league.teams.length}&nbsp;clubs available &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="floodlight border-y border-border bg-ink-900 py-14 text-white">
        <div className="container-page flex flex-col items-center gap-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
            Not in the Shop Yet?
          </p>
          <h2 className="max-w-xl font-display text-2xl font-bold uppercase leading-tight md:text-3xl">
            Any Club, Any Kit &mdash; We&apos;ll Source It
          </h2>
          <p className="max-w-md text-sm text-white/70">
            Retro seasons, national teams, name and number printing &mdash; tell
            us what you want and we&apos;ll get it made.
          </p>
          <Link
            href="/custom-order"
            className="hover-glow mt-2 inline-flex items-center justify-center rounded-full bg-brand-300 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-900 shadow-brand transition-transform duration-200 hover:scale-105 hover:bg-brand-100 active:scale-95"
          >
            Start a Custom Order
          </Link>
        </div>
      </section>

      {/* Lifestyle photo strip — auto-scrolling ticker */}
      <section className="overflow-hidden border-y border-border py-10">
        <div className="photo-strip-track flex w-max gap-4">
          {[
            { src: "/images/filler/filler-02.jpeg", alt: "Fans in Manchester United kits" },
            { src: "/images/filler/filler-01.jpeg", alt: "Fans in Manchester United kits seated" },
            { src: "/images/filler/filler-06.jpeg", alt: "Fans showing off their kits" },
            { src: "/images/filler/filler-08.jpeg", alt: "Full kit lineup group shot" },
            { src: "/images/filler/filler-09.jpeg", alt: "Fans in Real Madrid kits" },
            { src: "/images/filler/filler-11.jpeg", alt: "Real Madrid fans group" },
            { src: "/images/filler/filler-07.jpeg", alt: "Fans holding up a jersey" },
            { src: "/images/filler/filler-05.jpeg", alt: "Fans in a variety of kits" },
            { src: "/images/filler/filler-02.jpeg", alt: "Fans in Manchester United kits" },
            { src: "/images/filler/filler-01.jpeg", alt: "Fans in Manchester United kits seated" },
            { src: "/images/filler/filler-06.jpeg", alt: "Fans showing off their kits" },
            { src: "/images/filler/filler-08.jpeg", alt: "Full kit lineup group shot" },
            { src: "/images/filler/filler-09.jpeg", alt: "Fans in Real Madrid kits" },
            { src: "/images/filler/filler-11.jpeg", alt: "Real Madrid fans group" },
            { src: "/images/filler/filler-07.jpeg", alt: "Fans holding up a jersey" },
            { src: "/images/filler/filler-05.jpeg", alt: "Fans in a variety of kits" },
          ].map((photo, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] w-48 shrink-0 overflow-hidden rounded-2xl sm:w-56"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pt-14 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Featured
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase text-ink-900 md:text-3xl">
              Latest Drops
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold uppercase tracking-wide text-brand-600 hover:text-brand-700"
          >
            View All
          </Link>
        </div>
        <ProductGrid>
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      </section>
    </div>
  );
}
