"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

const INTERVAL = 5500;

export default function HeroBackgroundSlider({ images }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ width: `${images.length * 100}%`, transform: `translateX(-${active * (100 / images.length)}%)` }}
      >
        {images.map((src, i) => (
          <div key={src} className="relative h-full shrink-0" style={{ width: `${100 / images.length}%` }}>
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 ? (
        <div className="absolute bottom-8 right-6 z-10 hidden items-center gap-2 sm:flex">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                i === active ? "w-8 bg-gold-400" : "w-4 bg-bone-100/30 hover:bg-bone-100/50"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
