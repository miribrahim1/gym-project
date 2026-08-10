import { cn } from "@/lib/utils/cn";

export default function StatCard({ icon: Icon, label, value, hint, tone = "gold" }) {
  const toneClass = {
    gold: "bg-gold-500/10 text-gold-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    sky: "bg-sky-500/10 text-sky-400",
    rose: "bg-rose-500/10 text-rose-400",
  }[tone];

  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-5">
      <div className="flex items-center justify-between">
        <span className={cn("flex size-10 items-center justify-center rounded-xl", toneClass)}>
          <Icon className="size-5" strokeWidth={1.5} />
        </span>
      </div>
      <p className="font-display mt-4 text-3xl tracking-wide text-bone-50">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-bone-500">{label}</p>
      {hint ? <p className="mt-1 text-[11px] text-bone-600">{hint}</p> : null}
    </div>
  );
}
