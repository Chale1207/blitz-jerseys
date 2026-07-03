"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

const CLUBS = [
  { name: "Arsenal", dot: "#EF0107" },
  { name: "Manchester United", dot: "#DA291C" },
  { name: "Chelsea", dot: "#FDB913" },
  { name: "Liverpool", dot: "#C8102E" },
  { name: "Barcelona", dot: "#A50044" },
  { name: "Real Madrid", dot: "#5F259F" },
];

const LIFESTYLE_PHOTOS = [
  { src: "/images/hero/lifestyle-1.jpeg", alt: "Blitz Jerseys crew wearing match-night kits" },
  { src: "/images/hero/lifestyle-2.jpeg", alt: "Fan wearing a red home kit on the street" },
  { src: "/images/hero/lifestyle-3.jpeg", alt: "Fan wearing a green and gold kit" },
  { src: "/images/hero/lifestyle-4.jpeg", alt: "Two fans wearing blue kits" },
];

// Server and first client render both assume mobile, so hydration always
// matches. Once mounted, this tracks the real breakpoint so the hero can
// crossfade between layouts — on first load and on any later resize/rotate.
function useIsDesktop() {
  const [state, setState] = useState({ mounted: false, isDesktop: false });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setState({ mounted: true, isDesktop: mq.matches });
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return state;
}

function PhotoCard({
  photo,
  index,
  reduceMotion,
  className,
}: {
  photo: { src: string; alt: string };
  index: number;
  reduceMotion: boolean;
  className: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.1, ease: easeOut }}
      className={className}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 3.6 + index * 0.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }
        }
        className="h-full w-full"
      >
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 22vw, 40vw" className="object-cover" priority />
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const { mounted, isDesktop } = useIsDesktop();
  const reduceMotion = Boolean(useReducedMotion());
  const showDesktop = mounted && isDesktop;

  return (
    <section className="floodlight relative overflow-hidden bg-ink-900 text-white">
      <div className="container-page grid items-center gap-10 pb-10 pt-16 md:grid-cols-2 md:gap-10 md:pb-16 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="inline-flex items-center rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-300">
            2026/27 Season Kits
          </span>
          <h1 className="mt-5 text-4xl font-normal leading-[0.95] md:text-6xl lg:text-7xl">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
              className="block"
            >
              Wear the Badge.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: easeOut }}
              className="text-shine block"
            >
              Own the Night.
            </motion.span>
          </h1>
          <p className="mt-5 max-w-md font-head text-base text-white/70 md:text-lg">
            Performance jerseys inspired by the Premier League, Serie A, and
            LaLiga&apos;s biggest clubs. Order in seconds, confirm on WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-accent-500 px-7 py-3.5 font-head text-sm font-bold uppercase tracking-wide text-ink-900 transition-transform duration-200 hover:scale-105 hover:bg-accent-400 active:scale-95"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          {/* Layout crossfades whenever the breakpoint flips — on first
              load and on any later resize or device rotation. */}
          <AnimatePresence mode="wait" initial={false}>
            {showDesktop ? (
              <motion.div
                key="desktop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
                className="grid grid-cols-2 gap-4"
              >
                {LIFESTYLE_PHOTOS.map((photo, i) => (
                  <PhotoCard
                    key={photo.src}
                    photo={photo}
                    index={i}
                    reduceMotion={reduceMotion}
                    className={`relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 ${
                      i % 2 === 1 ? "md:mt-7" : ""
                    }`}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="mobile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
                className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [&::-webkit-scrollbar]:hidden"
              >
                {LIFESTYLE_PHOTOS.map((photo, i) => (
                  <PhotoCard
                    key={photo.src}
                    photo={photo}
                    index={i}
                    reduceMotion={reduceMotion}
                    className="relative aspect-[4/5] w-40 shrink-0 snap-center overflow-hidden rounded-2xl ring-1 ring-white/10"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="relative overflow-hidden border-t border-white/10 py-3">
        <div className="flex w-max gap-10 whitespace-nowrap ticker-track">
          {[...CLUBS, ...CLUBS].map((club, i) => (
            <span
              key={i}
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
        </div>
      </div>
    </section>
  );
}
