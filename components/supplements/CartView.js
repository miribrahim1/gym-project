"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/supplements/CartProvider";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/utils/format";

const SHIPPING_FLAT = 99;
const FREE_SHIPPING_THRESHOLD = 2000;

export default function CartView() {
  const { items, updateQty, removeItem, subtotal, hydrated } = useCart();

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <EmptyState
        icon="ShoppingBag"
        title="Your cart is empty"
        description="Browse our supplement range and add products to get started."
        action={<Button href="/supplements">Shop Supplements</Button>}
      />
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-4">
        {items.map((item) => (
          <div key={item.slug} className="flex items-center gap-4 rounded-2xl border border-ink-700 bg-ink-900/60 p-4">
            <PlaceholderImage src={item.image} tone={item.tone} icon="Dumbbell" ratio="square" className="size-20 shrink-0 rounded-xl" size={26} />
            <div className="min-w-0 flex-1">
              <Link href={`/supplements/${item.slug}`} className="font-display block truncate text-lg tracking-wide text-bone-50 hover:text-gold-400">
                {item.name}
              </Link>
              <p className="text-xs text-bone-500">{item.category}</p>
              <p className="mt-1 text-sm font-semibold text-gold-400">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center rounded-full border border-ink-600">
              <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(item.slug, item.qty - 1)} className="flex size-9 items-center justify-center text-bone-300 hover:text-gold-400">
                <Minus className="size-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-semibold text-bone-100">{item.qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => updateQty(item.slug, item.qty + 1)} className="flex size-9 items-center justify-center text-bone-300 hover:text-gold-400">
                <Plus className="size-3.5" />
              </button>
            </div>
            <button type="button" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.slug)} className="text-bone-500 transition-colors hover:text-ember-500">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-24 rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
          <h3 className="font-display flex items-center gap-2 text-xl tracking-wide text-bone-50">
            <ShoppingBag className="size-5 text-gold-400" /> Order Summary
          </h3>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-bone-500">Subtotal</dt><dd className="text-bone-200">{formatCurrency(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-bone-500">Shipping</dt><dd className="text-bone-200">{shipping === 0 ? "Free" : formatCurrency(shipping)}</dd></div>
          </dl>
          {shipping > 0 ? (
            <p className="mt-3 text-xs text-bone-500">Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.</p>
          ) : null}
          <div className="mt-4 flex justify-between border-t border-ink-700 pt-4">
            <span className="font-display text-lg text-bone-50">Total</span>
            <span className="font-display text-lg text-bone-50">{formatCurrency(total)}</span>
          </div>
          <Button href="/checkout" className="mt-6 w-full" icon={ArrowRight} iconPosition="right">Proceed to Checkout</Button>
        </div>
      </aside>
    </div>
  );
}
