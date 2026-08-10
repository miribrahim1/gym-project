import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function StarRating({ rating = 0, count, size = 15, className }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-label={`Rated ${rating} out of 5`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= rounded;
          return (
            <Star
              key={i}
              width={size}
              height={size}
              className={filled ? "fill-gold-400 text-gold-400" : "fill-transparent text-ink-500"}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {count !== undefined ? (
        <span className="text-xs text-bone-500">
          {rating.toFixed(1)} ({count})
        </span>
      ) : null}
    </div>
  );
}
