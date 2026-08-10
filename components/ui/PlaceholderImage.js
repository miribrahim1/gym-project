import Image from "next/image";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils/cn";

// When a real photo is available (src), it's rendered as the image with a
// subtle darkening for text legibility. When it isn't, we fall back to a
// deliberately designed local gradient tile (per project spec: no random/
// unrelated stock imagery, no broken remote URLs) — the tone/icon props
// map directly to that fallback's alt text and visual treatment.

const TONES = {
  amber: "from-gold-600/35 via-ink-800 to-ink-950 text-gold-400",
  rose: "from-rose-500/30 via-ink-800 to-ink-950 text-rose-400",
  emerald: "from-emerald-500/25 via-ink-800 to-ink-950 text-emerald-400",
  slate: "from-slate-400/25 via-ink-800 to-ink-950 text-slate-300",
  ember: "from-ember-500/35 via-ink-800 to-ink-950 text-ember-500",
};

const RATIOS = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  video: "aspect-video",
  wide: "aspect-[21/9]",
  banner: "aspect-[16/6]",
  auto: "",
};

export default function PlaceholderImage({
  src,
  tone = "amber",
  icon = "Dumbbell",
  label,
  ratio = "video",
  className,
  iconClassName,
  size = 40,
  priority = false,
  sizes = "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw",
}) {
  const Icon = Icons[icon] || Icons.Dumbbell;
  const toneClass = TONES[tone] || TONES.amber;

  return (
    <div
      className={cn("relative overflow-hidden", !src && "bg-gradient-to-br", !src && toneClass, RATIOS[ratio], className)}
      role="img"
      aria-label={label || icon}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={label || icon}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink-950/25" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 14px)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon
              className={cn("opacity-70", iconClassName)}
              style={{ width: size, height: size }}
              strokeWidth={1.25}
            />
          </div>
        </>
      )}
      {label ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent px-3 pb-2 pt-6">
          <span className="font-display text-sm tracking-wide text-bone-100/90">{label}</span>
        </div>
      ) : null}
    </div>
  );
}
