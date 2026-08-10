"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import EmptyState from "@/components/ui/EmptyState";

const SPAN_PATTERN = ["row-span-2", "", "", "", "row-span-2", "", "row-span-2", "", "", "", "", ""];

export default function GalleryBoard({ images, categories }) {
  const [category, setCategory] = useState("all");
  const [activeIndex, setActiveIndex] = useState(null);

  const filtered = useMemo(
    () => (category === "all" ? images : images.filter((img) => img.category === category)),
    [images, category]
  );

  function selectCategory(next) {
    setCategory(next);
    setActiveIndex(null);
  }

  useEffect(() => {
    if (activeIndex === null) return;
    function onKeyDown(e) {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % filtered.length);
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, filtered.length]);

  const active = activeIndex !== null ? filtered[activeIndex] : null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => selectCategory("all")} className={cn("rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors", category === "all" ? "border-gold-500 bg-gold-500/10 text-gold-400" : "border-ink-600 text-bone-400 hover:border-ink-500")}>
          All
        </button>
        {categories.map((c) => (
          <button key={c} type="button" onClick={() => selectCategory(c)} className={cn("rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors", category === c ? "border-gold-500 bg-gold-500/10 text-gold-400" : "border-ink-600 text-bone-400 hover:border-ink-500")}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {filtered.length === 0 ? (
          <EmptyState icon="ImageOff" title="No images in this category" description="Try selecting a different category." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:grid-rows-[repeat(6,minmax(0,1fr))]">
            {filtered.map((image, i) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn("block text-left", SPAN_PATTERN[i % SPAN_PATTERN.length])}
              >
                <PlaceholderImage
                  src={image.image}
                  tone={image.tone}
                  icon="Image"
                  label={image.caption}
                  ratio={SPAN_PATTERN[i % SPAN_PATTERN.length] ? "portrait" : "square"}
                  className="h-full rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                  size={26}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {active ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-sm animate-fade-in">
          <button type="button" onClick={() => setActiveIndex(null)} aria-label="Close lightbox" className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full text-bone-300 hover:bg-ink-800 hover:text-bone-50">
            <X className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length)}
            className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-800/80 text-bone-200 hover:text-gold-400 sm:left-6"
          >
            <ChevronLeft className="size-6" />
          </button>
          <div className="w-full max-w-2xl">
            <PlaceholderImage src={active.image} tone={active.tone} icon="Image" ratio="video" className="rounded-2xl" size={56} />
            <div className="mt-4 text-center">
              <p className="font-display text-xl tracking-wide text-bone-50">{active.caption}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-gold-400">{active.category}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setActiveIndex((i) => (i + 1) % filtered.length)}
            className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-800/80 text-bone-200 hover:text-gold-400 sm:right-6"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
