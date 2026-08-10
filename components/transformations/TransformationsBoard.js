"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import TransformationCard from "@/components/transformations/TransformationCard";
import EmptyState from "@/components/ui/EmptyState";

const CATEGORIES = ["Weight Loss", "Muscle Gain", "Strength", "Athletic Performance"];

export default function TransformationsBoard({ transformations }) {
  const [category, setCategory] = useState("all");

  const filtered = useMemo(
    () => (category === "all" ? transformations : transformations.filter((t) => t.category === category)),
    [transformations, category]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setCategory("all")} className={cn("rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors", category === "all" ? "border-gold-500 bg-gold-500/10 text-gold-400" : "border-ink-600 text-bone-400 hover:border-ink-500")}>
          All Stories
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" onClick={() => setCategory(c)} className={cn("rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors", category === c ? "border-gold-500 bg-gold-500/10 text-gold-400" : "border-ink-600 text-bone-400 hover:border-ink-500")}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {filtered.length === 0 ? (
          <EmptyState icon="SearchX" title="No stories in this category yet" description="Check back soon or explore another category." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t, i) => (
              <TransformationCard key={t.id} transformation={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
