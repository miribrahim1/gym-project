"use client";

import Tabs from "@/components/ui/Tabs";
import StarRating from "@/components/ui/StarRating";
import { formatDate } from "@/lib/utils/format";

export default function ProductTabs({ product }) {
  return (
    <Tabs
      tabs={[
        { value: "ingredients", label: "Ingredients" },
        { value: "nutrition", label: "Nutrition Facts" },
        { value: "usage", label: "Usage" },
        { value: "warnings", label: "Warnings" },
        { value: "reviews", label: `Reviews (${product.reviewsCount})` },
      ]}
    >
      {(active) => (
        <div className="max-w-3xl">
          {active === "ingredients" ? (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {product.ingredients.map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-bone-300">
                  <span className="size-1.5 rounded-full bg-gold-500" /> {i}
                </li>
              ))}
            </ul>
          ) : null}
          {active === "nutrition" ? (
            <div className="divide-y divide-ink-700 rounded-xl border border-ink-700">
              {Object.entries(product.nutritionFacts).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="capitalize text-bone-500">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-medium text-bone-100">{value}</span>
                </div>
              ))}
            </div>
          ) : null}
          {active === "usage" ? <p className="text-sm leading-relaxed text-bone-400">{product.usage}</p> : null}
          {active === "warnings" ? <p className="text-sm leading-relaxed text-bone-400">{product.warnings}</p> : null}
          {active === "reviews" ? (
            <div className="space-y-5">
              {product.reviews.length === 0 ? (
                <p className="text-sm text-bone-500">No reviews yet.</p>
              ) : (
                product.reviews.map((r, i) => (
                  <div key={i} className="rounded-xl border border-ink-700 bg-ink-900/60 p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-bone-100">{r.name}</p>
                      <span className="text-xs text-bone-500">{formatDate(r.date)}</span>
                    </div>
                    <StarRating rating={r.rating} className="mt-1.5" size={12} />
                    <p className="mt-2 text-sm text-bone-400">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>
      )}
    </Tabs>
  );
}
