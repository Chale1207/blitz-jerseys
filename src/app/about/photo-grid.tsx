"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

const PHOTOS = [
  { src: "/images/filler/filler-03.jpeg", alt: "Fan in Manchester United retro kit" },
  { src: "/images/filler/filler-14.jpeg", alt: "Fan in Liverpool kit" },
  { src: "/images/filler/filler-16.jpeg", alt: "Fan in Jamaica national kit" },
  { src: "/images/filler/filler-20.jpeg", alt: "Fan in Chelsea home kit" },
];

export function AboutPhotoGrid() {
  return (
    <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {PHOTOS.map((photo, i) => (
        <motion.div
          key={photo.src}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: i * 0.15, ease: easeOut }}
          viewport={{ once: true, amount: 0.15 }}
          className="relative aspect-[3/4] overflow-hidden rounded-2xl"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover object-top"
          />
        </motion.div>
      ))}
    </div>
  );
}
