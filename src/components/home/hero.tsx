"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

const CLUBS = [
  { name: "Arsenal", dot: "#EF0107" },
  { name: "Manchester United", dot: "#DA291C" },
  { name: "Chelsea", dot: "#FDB913" },
  { name: "Liverpool", dot: "#C8102E" },
  { name: "Barcelona", dot: "#A50044" },
  { name: "Real Madrid", dot: "#5F259F" },
];

const LIFESTYLE_PHOTOS = [
  { src: "/images/filler/filler-03.jpeg", alt: "Fan in Manchester United retro kit" },
  { src: "/images/filler/filler-14.jpeg", alt: "Fan in Liverpool Standard Chartered kit" },
  { src: "/images/filler/filler-16.jpeg", alt: "Fan in Jamaica national kit" },
  { src: "/images/filler/filler-20.jpeg", alt: "Fan in Chelsea home kit" },
];

function useMediaQuery(query: string) {
  const [state, setState] = useState({ mounted: false, matches: false });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setState({ mounted: true, matches: mq.matches });
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return state;
}

// Desktop only: wraps the pop-in card in a perpetually floating shell so
// both animations run on separate elements (stacking transforms on the same
// element causes one to override the other after fill-mode locks in).
function PhotoCard({
  photo,
  index,
  className,
}: {
  photo: { src: string; alt: string };
  index: number;
  className: string;
}) {
  const floatClass = index % 2 === 0 ? "animate-float-up" : "animate-float-down";
  const floatDelay = `${index * 0.75}s`;

  return (
    <div className={floatClass} style={{ animationDelay: floatDelay }}>
      <div
        className={`animate-photo-pop-in ${className}`}
        style={{ animationDelay: `${0.2 + index * 0.15}s` }}
      >
        <div className="relative h-full w-full">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="22vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { mounted, matches: isDesktop } = useMediaQuery("(min-width: 768px)");
  const { matches: reduceMotion } = useMediaQuery("(prefers-reduced-motion: reduce)");
  const showDesktop = mounted && isDesktop;

  // Mount the <video> only after hydration so its network request never
  // appears in the server HTML's preload scan — it stays out of the way of
  // fonts/images/JS during the critical First Contentful Paint window. The
  // poster frame (a regular optimized next/image) covers the gap instantly.
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => {
    setVideoReady(true);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white">
      {/* Video background — paused/replaced with a still frame when the visitor
          prefers reduced motion, since a looping background video is exactly
          the kind of ambient motion that preference is meant to suppress. */}
      {!reduceMotion && videoReady ? (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover brightness-[0.4]"
          src="/videos/blitz-theme.mp4"
          poster="/images/filler/filler-08.jpeg"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Image
          src="/images/filler/filler-08.jpeg"
          alt="Blitz Jerseys fans in full kit"
          fill
          priority
          className="absolute inset-0 -z-20 object-cover brightness-[0.4]"
        />
      )}

      {/* Flat dark tint for text legibility + the signature floodlight glow.
          A flat tint (not a gradient) avoids letting the video's brightness
          show through unevenly behind the photo grid — it read as a moving
          shadow crossing the photos. */}
      <div className="absolute inset-0 -z-10 bg-ink-900/60" />
      <div className="floodlight absolute inset-0 -z-10" aria-hidden />

      <div className="container-page relative grid grid-cols-1 items-center gap-10 pb-10 pt-16 md:grid-cols-2 md:gap-10 md:pb-16 md:pt-24">
        {/* Text column — always visible on SSR, no opacity-based initial.
            min-w-0 stops the grid item from being forced wider than its
            track by the max-w-md paragraph below it — a classic CSS Grid
            trap (items default to min-width:auto, not 0), which was
            pushing this whole column ~76px past the real viewport edge
            on narrow phones. */}
        <div className="min-w-0">
          <span className="inline-flex items-center rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-300">
            2026/27 Season Kits
          </span>
          <h1 className="mt-5 text-4xl font-normal leading-[1.05] tracking-[0.03em] md:text-6xl lg:text-7xl">
            <span className="block">Wear the Badge.</span>
            <span className="text-shine block mt-1">Own the Night.</span>
          </h1>
          <p className="mt-6 max-w-md font-head text-base leading-relaxed tracking-wide text-white/75 md:text-lg">
            Performance jerseys inspired by the Premier League, Serie A, and
            LaLiga&apos;s biggest clubs, delivered across Zambia. Order in
            seconds, confirm on WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="hover-glow inline-flex items-center justify-center rounded-full bg-brand-300 px-7 py-3.5 font-head text-sm font-bold uppercase tracking-wide text-brand-900 shadow-brand transition-transform duration-200 hover:scale-105 hover:bg-brand-100 active:scale-95"
            >
              Shop Now
            </Link>
            <Link
              href="/shop/premier-league"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 font-head text-sm font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:border-brand-300 hover:text-brand-300"
            >
              Premier League
            </Link>
          </div>
        </div>

        {/* Photo grid — always visible, photos pop-in via a CSS keyframe.
            The mobile/desktop layout swap (on resize/rotation only, never
            during a normal session) is an instant swap rather than a
            crossfade — not worth a JS animation library for an event that
            essentially never fires in practice. */}
        <div className="relative mx-auto w-full min-w-0 max-w-md">
          {showDesktop ? (
            <div className="grid grid-cols-2 gap-4">
              {LIFESTYLE_PHOTOS.map((photo, i) => (
                <PhotoCard
                  key={photo.src}
                  photo={photo}
                  index={i}
                  className={`relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 ${
                    i % 2 === 1 ? "md:mt-7" : ""
                  }`}
                />
              ))}
            </div>
          ) : (
            // Mobile: photos loop continuously — InfiniteSlider extends
            // edge-to-edge by cancelling the container-page padding with -mx-5.
            <InfiniteSlider gap={16} duration={18} durationOnHover={60} className="-mx-5">
              {LIFESTYLE_PHOTOS.map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-[4/5] w-40 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="160px"
                    className="object-cover"
                    priority
                  />
                </div>
              ))}
            </InfiniteSlider>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-3">
        <InfiniteSlider gap={40} duration={26} className="whitespace-nowrap">
          {CLUBS.map((club) => (
            <span
              key={club.name}
              className="flex items-center gap-2 font-head text-xs font-semibold uppercase tracking-widest text-white/60"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: club.dot }}
                aria-hidden
              />
              {club.name}
            </span>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
