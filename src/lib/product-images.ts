/**
 * Real product photography, keyed by product slug (not team) since a team
 * can carry multiple products (e.g. Chelsea's Home Kit vs Training Kit)
 * that shouldn't share photos. Falls back to the generated JerseyArt
 * placeholder for any product not listed here yet.
 */
export const productImages: Record<string, { src: string; alt: string }[]> = {
  "arsenal-home-kit-2026-27": [
    { src: "/images/products/arsenal/front.jpeg", alt: "Arsenal home kit, front" },
    { src: "/images/products/arsenal/back.jpeg", alt: "Arsenal home kit, back" },
    { src: "/images/products/arsenal/authenticity-tag.jpeg", alt: "Authentic licensed product tag" },
  ],
  "chelsea-home-kit-polo-2026-27": [
    { src: "/images/products/chelsea/front.jpg", alt: "Chelsea home kit polo, front" },
    { src: "/images/products/chelsea/back.jpg", alt: "Chelsea home kit polo, back" },
  ],
  "manchester-united-home-kit-2026-27": [
    { src: "/images/products/manchester-united/front.jpg", alt: "Manchester United home kit, front" },
    { src: "/images/products/manchester-united/back.jpg", alt: "Manchester United home kit, back" },
  ],
  "barcelona-home-kit-2026-27": [
    { src: "/images/products/barcelona/front.jpg", alt: "Barcelona home kit, front" },
    { src: "/images/products/barcelona/side.jpg", alt: "Barcelona home kit, side" },
    { src: "/images/products/barcelona/back.jpg", alt: "Barcelona home kit, back" },
  ],
  "liverpool-home-kit-2026-27": [
    { src: "/images/products/liverpool/front.jpg", alt: "Liverpool home kit, front" },
    { src: "/images/products/liverpool/back.jpg", alt: "Liverpool home kit, back" },
  ],
  "real-madrid-home-kit-2026-27": [
    { src: "/images/products/real-madrid/front.jpg", alt: "Real Madrid home kit, front" },
    { src: "/images/products/real-madrid/back.jpg", alt: "Real Madrid home kit, back" },
  ],

  // Promotional / last-season clearance stock
  "chelsea-away-kit-2025-26": [
    { src: "/images/products/chelsea-away-kit-2025-26/front.jpg", alt: "Chelsea away kit 2025/26, front" },
    { src: "/images/products/chelsea-away-kit-2025-26/back.jpg", alt: "Chelsea away kit 2025/26, back" },
  ],
  "barcelona-away-kit-2025-26": [
    { src: "/images/products/barcelona-away-kit-2025-26/front.jpg", alt: "Barcelona away kit 2025/26, front" },
    { src: "/images/products/barcelona-away-kit-2025-26/back.jpg", alt: "Barcelona away kit 2025/26, back" },
    { src: "/images/products/barcelona-away-kit-2025-26/badge.jpg", alt: "Barcelona away kit badge detail" },
  ],
  "real-madrid-home-kit-2025-26": [
    { src: "/images/products/real-madrid-home-kit-2025-26/front.jpg", alt: "Real Madrid home kit 2025/26, front" },
    { src: "/images/products/real-madrid-home-kit-2025-26/back.jpg", alt: "Real Madrid home kit 2025/26, back" },
  ],
  "liverpool-home-kit-2025-26": [
    { src: "/images/products/liverpool-home-kit-2025-26/front.jpg", alt: "Liverpool home kit 2025/26, front" },
    { src: "/images/products/liverpool-home-kit-2025-26/back.jpg", alt: "Liverpool home kit 2025/26, back" },
  ],
  "manchester-united-away-kit-2025-26": [
    { src: "/images/products/manchester-united-away-kit-2025-26/front.jpg", alt: "Manchester United away kit 2025/26, front" },
    { src: "/images/products/manchester-united-away-kit-2025-26/back.jpg", alt: "Manchester United away kit 2025/26, back" },
  ],
  "manchester-city-home-kit-2025-26": [
    { src: "/images/products/manchester-city-home-kit-2025-26/front.jpg", alt: "Manchester City home kit 2025/26, front" },
    { src: "/images/products/manchester-city-home-kit-2025-26/back.jpg", alt: "Manchester City home kit 2025/26, back" },
  ],
  "manchester-city-away-kit-2025-26": [
    { src: "/images/products/manchester-city-away-kit-2025-26/front.jpg", alt: "Manchester City away kit 2025/26, front" },
    { src: "/images/products/manchester-city-away-kit-2025-26/alt.jpg", alt: "Manchester City away kit 2025/26, alternate angle" },
  ],
  "manchester-city-third-kit-2025-26": [
    { src: "/images/products/manchester-city-third-kit-2025-26/front.jpg", alt: "Manchester City third kit 2025/26, front" },
    { src: "/images/products/manchester-city-third-kit-2025-26/back.jpg", alt: "Manchester City third kit 2025/26, back" },
  ],
};

export function getProductImages(productSlug: string) {
  return productImages[productSlug] ?? null;
}
