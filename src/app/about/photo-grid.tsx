"use client";

import Image from "next/image";
import { useInView } from "@/lib/use-in-view";

const PHOTOS = [
  { src: "/images/filler/filler-03.jpeg", alt: "Fan in Manchester United retro kit" },
  { src: "/images/filler/filler-14.jpeg", alt: "Fan in Liverpool kit" },
  { src: "/images/filler/filler-16.jpeg", alt: "Fan in Jamaica national kit" },
  { src: "/images/filler/filler-20.jpeg", alt: "Fan in Chelsea home kit" },
];

function PhotoItem({ photo, delayMs }: { photo: { src: string; alt: string }; delayMs: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`relative aspect-[3/4] overflow-hidden rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <Image src={photo.src} alt={photo.alt} fill className="object-cover object-top" />
    </div>
  );
}

export function AboutPhotoGrid() {
  return (
    <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {PHOTOS.map((photo, i) => (
        <PhotoItem key={photo.src} photo={photo} delayMs={i * 150} />
      ))}
    </div>
  );
}
