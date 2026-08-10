import { cn } from "@/lib/utils/cn";

const TONES = {
  gold: "bg-gold-500/10 text-gold-300 border-gold-500/30",
  neutral: "bg-ink-700/60 text-bone-400 border-ink-600",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  danger: "bg-ember-500/10 text-ember-500 border-ember-500/30",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  info: "bg-sky-500/10 text-sky-400 border-sky-500/30",
};

export default function Badge({ children, tone = "neutral", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
