"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function Accordion({ items, className, defaultOpenIndex = -1 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  return (
    <div className={cn("divide-y divide-ink-700 border-y border-ink-700", className)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `accordion-panel-${item.id || i}`;
        const buttonId = `accordion-trigger-${item.id || i}`;
        return (
          <div key={item.id || i}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-base font-medium text-bone-100 sm:text-lg">{item.question}</span>
                <ChevronDown
                  className={cn("size-5 shrink-0 text-gold-400 transition-transform duration-300", isOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid overflow-hidden transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="max-w-3xl text-sm leading-relaxed text-bone-400">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
