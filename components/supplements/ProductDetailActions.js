"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/components/supplements/CartProvider";

export default function ProductDetailActions({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stockStatus === "out-of-stock";

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-full border border-ink-600">
        <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex size-11 items-center justify-center text-bone-300 hover:text-gold-400">
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-bone-100">{qty}</span>
        <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="flex size-11 items-center justify-center text-bone-300 hover:text-gold-400">
          <Plus className="size-4" />
        </button>
      </div>
      <Button onClick={handleAdd} disabled={outOfStock} icon={added ? Check : ShoppingCart} className="flex-1 sm:flex-none">
        {outOfStock ? "Out of Stock" : added ? "Added to Cart" : "Add to Cart"}
      </Button>
    </div>
  );
}
