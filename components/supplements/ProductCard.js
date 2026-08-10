"use client";

import Link from "next/link";
import { Eye, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/format";
import { useCart } from "@/components/supplements/CartProvider";

export default function ProductCard({ product, onQuickView }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const outOfStock = product.stockStatus === "out-of-stock";

  function handleAdd(e) {
    e.preventDefault();
    if (outOfStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40">
      <Link href={`/supplements/${product.slug}`} className="relative block">
        <PlaceholderImage src={product.image} tone={product.tone} icon="Dumbbell" ratio="square" size={40} />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {hasDiscount ? (
            <Badge tone="danger">-{Math.round((1 - product.discountPrice / product.price) * 100)}%</Badge>
          ) : null}
          {product.stockStatus === "low-stock" ? <Badge tone="warning">Low Stock</Badge> : null}
          {outOfStock ? <Badge tone="neutral">Out of Stock</Badge> : null}
        </div>
        {onQuickView ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            aria-label={`Quick view ${product.name}`}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink-950/70 text-bone-100 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
          >
            <Eye className="size-4" />
          </button>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] uppercase tracking-wider text-gold-400">{product.category}</p>
        <Link href={`/supplements/${product.slug}`}>
          <h3 className="font-display mt-1 text-xl tracking-wide text-bone-50">{product.name}</h3>
        </Link>
        <p className="mt-1 flex-1 text-sm text-bone-500">{product.shortDescription}</p>
        <StarRating rating={product.rating} count={product.reviewsCount} size={12} className="mt-3" />
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-bone-50">{formatCurrency(product.discountPrice || product.price)}</span>
            {hasDiscount ? <span className="text-xs text-bone-600 line-through">{formatCurrency(product.price)}</span> : null}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-ink-950 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-bone-500"
          >
            {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
