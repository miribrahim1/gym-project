"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export default function Tabs({ tabs, defaultTab, className, children }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.value);

  return (
    <div className={className}>
      <div
        role="tablist"
        className="flex flex-wrap gap-2 border-b border-ink-700 pb-px"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={active === tab.value}
            onClick={() => setActive(tab.value)}
            className={cn(
              "relative -mb-px rounded-t-lg px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors",
              active === tab.value
                ? "text-gold-400 border-b-2 border-gold-500"
                : "text-bone-500 hover:text-bone-200 border-b-2 border-transparent"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-6">{typeof children === "function" ? children(active) : children}</div>
    </div>
  );
}
