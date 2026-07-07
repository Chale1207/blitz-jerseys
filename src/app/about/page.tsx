import Image from "next/image";
import { AboutPhotoGrid } from "./photo-grid";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div>
      {/* Hero band */}
      <div className="relative h-64 overflow-hidden bg-ink-900 sm:h-80">
        <Image
          src="/images/filler/filler-08.jpeg"
          alt="Blitz Jerseys crew wearing match-night kits"
          fill
          className="object-cover object-top opacity-60"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Our Story</p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase text-white md:text-5xl">
            Built for the Love of the Game
          </h1>
        </div>
      </div>

      <div className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base leading-relaxed text-muted">
            Blitz Jerseys started in Zambia with one idea: fans across the
            Premier League, Serie A, and LaLiga shouldn&apos;t have to choose
            between quality and accessibility. We source performance-grade
            football shirts inspired by the clubs that define matchday
            culture, deliver them nationwide, and back it up with real, human
            support. No call centers, just a WhatsApp message away.
          </p>
        </div>

        {/* Photo grid */}
        <AboutPhotoGrid />

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-3">
          {[
            { title: "Performance Fabric", body: "Breathable, durable, built for 90 minutes or a Saturday five-a-side." },
            { title: "Fast Confirmation", body: "Place your order, then confirm sizing and delivery in minutes on WhatsApp." },
            { title: "Club Culture", body: "New drops across all three leagues as the season unfolds." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-surface p-6 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wide text-brand-600">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
