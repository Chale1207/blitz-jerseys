"use client";

import { useState } from "react";
import Image from "next/image";
import { JerseyArt } from "@/components/jersey/jersey-art";

type GalleryImage = { src: string; alt: string };

export function ProductGallery({
  images,
  primaryColor,
  secondaryColor,
  initials,
  number,
}: {
  images: GalleryImage[] | null;
  primaryColor: string;
  secondaryColor: string;
  initials: string;
  number?: number;
}) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="floodlight relative overflow-hidden rounded-3xl bg-ink-900 p-10">
        <JerseyArt
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          initials={initials}
          number={number}
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="floodlight relative aspect-square overflow-hidden rounded-3xl bg-ink-900">
        <Image
          src={images[active].src}
          alt={images[active].alt}
          fill
          sizes="(min-width: 768px) 40vw, 90vw"
          className="object-contain p-8"
          priority
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-4 flex gap-3">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-900 ring-2 transition-colors ${
                active === i ? "ring-brand-300" : "ring-white/10 hover:ring-white/30"
              }`}
            >
              <Image src={image.src} alt={image.alt} fill sizes="64px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
