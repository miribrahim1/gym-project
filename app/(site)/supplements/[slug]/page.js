import { notFound } from "next/navigation";
import Link from "next/link";
import { listSupplements, getSupplementBySlug } from "@/lib/db/supplements";
import { Section, Eyebrow } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import ProductTabs from "@/components/supplements/ProductTabs";
import ProductDetailActions from "@/components/supplements/ProductDetailActions";
import ProductCard from "@/components/supplements/ProductCard";
import { formatCurrency } from "@/lib/utils/format";

export async function generateStaticParams() {
  const products = await listSupplements();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getSupplementBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/supplements/${product.slug}` },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getSupplementBySlug(slug);
  if (!product) notFound();

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: "IronVault Fitness" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.discountPrice || product.price,
      availability: product.stockStatus === "out-of-stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
    aggregateRating: product.reviewsCount
      ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewsCount }
      : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Section className="pt-10">
        <nav className="mb-8 text-xs text-bone-500">
          <Link href="/supplements" className="hover:text-gold-400">Supplements</Link> / <span className="text-bone-300">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <PlaceholderImage src={product.image} tone={product.tone} icon="Dumbbell" ratio="square" className="rounded-2xl" size={64} priority />
          </div>
          <div>
            <Eyebrow>{product.category}</Eyebrow>
            <h1 className="font-display mt-3 text-4xl tracking-wide text-bone-50 sm:text-5xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={product.rating} count={product.reviewsCount} />
              {product.stockStatus === "low-stock" ? <Badge tone="warning">Only {product.stock} left</Badge> : null}
              {product.stockStatus === "out-of-stock" ? <Badge tone="neutral">Out of Stock</Badge> : null}
              {product.stockStatus === "in-stock" ? <Badge tone="success">In Stock</Badge> : null}
            </div>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl text-bone-50">{formatCurrency(product.discountPrice || product.price)}</span>
              {hasDiscount ? <span className="text-base text-bone-600 line-through">{formatCurrency(product.price)}</span> : null}
              {hasDiscount ? <Badge tone="danger">-{Math.round((1 - product.discountPrice / product.price) * 100)}%</Badge> : null}
            </div>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-bone-400">{product.description}</p>

            <div className="mt-8">
              <ProductDetailActions product={product} />
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-ink-700 pt-6 text-sm sm:grid-cols-3">
              <div><dt className="text-xs text-bone-500">Servings</dt><dd className="mt-1 text-bone-200">{product.servings}</dd></div>
              <div><dt className="text-xs text-bone-500">Flavor</dt><dd className="mt-1 text-bone-200">{product.flavor}</dd></div>
              <div><dt className="text-xs text-bone-500">Category</dt><dd className="mt-1 text-bone-200">{product.category}</dd></div>
            </dl>
          </div>
        </div>

        <div className="mt-16">
          <ProductTabs product={product} />
        </div>

        {product.relatedProducts?.length ? (
          <div className="mt-16">
            <h2 className="font-display text-2xl tracking-wide text-bone-50">You May Also Like</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {product.relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : null}
      </Section>
    </>
  );
}
