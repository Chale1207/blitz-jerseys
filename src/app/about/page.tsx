export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Our Story
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase text-ink-900 md:text-5xl">
          Built for the Love of the Game
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted">
          Blitz Jerseys started with one idea: fans across the Premier League,
          Serie A, and LaLiga shouldn&apos;t have to choose between quality and
          accessibility. We design performance-grade football shirts inspired
          by the clubs that define matchday culture, and we back it up with
          real, human support &mdash; no call centers, just a WhatsApp message
          away.
        </p>
      </div>

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
  );
}
