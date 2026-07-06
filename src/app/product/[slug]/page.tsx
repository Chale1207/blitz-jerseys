import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCart } from "@/components/product/add-to-cart";
import { formatPrice, isLightColor, numberFromSlug } from "@/lib/format";
import { getProductBySlug, totalStock } from "@/lib/products";
import { getProductImages } from "@/lib/product-images";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: undefined };

  const title = `${product.team.name} ${product.name} ${product.season}`;
  const description = product.description;
  const image = getProductImages(product.slug, product.imagesJson)?.[0]?.src;

  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : undefined },
    twitter: { title, description, images: image ? [image] : undefined },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const sortedVariants = [...product.variants].sort((a, b) => {
    const order = ["S", "M", "L", "XL", "XXL"];
    return order.indexOf(a.size) - order.indexOf(b.size);
  });

  const dotColor = isLightColor(product.team.primaryColor)
    ? product.team.secondaryColor
    : product.team.primaryColor;

  const productImage = getProductImages(product.slug, product.imagesJson)?.[0]?.src;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.team.name} ${product.name} ${product.season}`,
    description: product.description,
    image: getProductImages(product.slug, product.imagesJson)?.map((img) => img.src),
    brand: { "@type": "Brand", name: "Blitz Jerseys" },
    offers: {
      "@type": "Offer",
      priceCurrency: "ZMW",
      price: product.price,
      availability:
        totalStock(product.variants) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted">
        <Link href="/shop" className="hover:text-brand-600">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/shop/${product.team.league.slug}`} className="hover:text-brand-600">
          {product.team.league.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink-900">{product.team.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <ProductGallery
          images={getProductImages(product.slug, product.imagesJson)}
          primaryColor={product.team.primaryColor}
          secondaryColor={product.team.secondaryColor}
          initials={product.team.shortName}
          number={numberFromSlug(product.slug)}
        />

        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: dotColor }}
              aria-hidden
            />
            {product.team.name}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase text-ink-900 md:text-4xl">
            {product.name} {product.season}
          </h1>
          <p className="mt-3 font-display text-2xl font-bold text-brand-600">
            {formatPrice(product.price)}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCart
              productSlug={product.slug}
              productName={`${product.name} ${product.season}`}
              teamName={product.team.name}
              kitType={product.kitType}
              price={product.price}
              primaryColor={product.team.primaryColor}
              secondaryColor={product.team.secondaryColor}
              initials={product.team.shortName}
              imageSrc={productImage}
              variants={sortedVariants}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
