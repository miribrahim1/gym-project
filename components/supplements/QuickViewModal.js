"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/format";
import { useCart } from "@/components/supplements/CartProvider";

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Modal open={!!product} onClose={onClose} title={product.name} size="lg">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <PlaceholderImage src={product.image} tone={product.tone} icon="Dumbbell" ratio="square" className="rounded-xl" size={44} />
        <div>
          <p className="text-xs uppercase tracking-wider text-gold-400">{product.category}</p>
          <StarRating rating={product.rating} count={product.reviewsCount} className="mt-2" />
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl text-bone-50">{formatCurrency(product.discountPrice || product.price)}</span>
            {hasDiscount ? <span className="text-sm text-bone-600 line-through">{formatCurrency(product.price)}</span> : null}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-bone-400">{product.shortDescription}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleAdd} icon={added ? Check : ShoppingCart} disabled={product.stockStatus === "out-of-stock"}>
              {added ? "Added" : "Add to Cart"}
            </Button>
            <Button href={`/supplements/${product.slug}`} variant="secondary">
              View Full Details
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
