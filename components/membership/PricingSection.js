"use client";

import { useState } from "react";
import PricingCard from "@/components/membership/PricingCard";
import { cn } from "@/lib/utils/cn";

export default function PricingSection({ plans, cycles }) {
  const [cycleId, setCycleId] = useState("monthly");
  const cycle = cycles.find((c) => c.id === cycleId) || cycles[0];

  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-full border border-ink-600 bg-ink-900/70 p-1">
          {cycles.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCycleId(c.id)}
              className={cn(
                "relative rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
                cycleId === c.id ? "bg-gold-500 text-ink-950" : "text-bone-400 hover:text-bone-100"
              )}
            >
              {c.label}
              {c.discountPct > 0 ? (
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]",
                    cycleId === c.id ? "bg-ink-950/15 text-ink-950" : "bg-emerald-500/15 text-emerald-400"
                  )}
                >
                  -{c.discountPct}%
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-center">
        {plans.map((plan) => (
          <div key={plan.id} className={plan.highlighted ? "lg:scale-105" : ""}>
            <PricingCard plan={plan} cycle={cycle} />
          </div>
        ))}
      </div>
    </div>
  );
}
