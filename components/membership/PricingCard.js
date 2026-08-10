import { Check, X, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { calculatePlanPrice } from "@/lib/utils/pricing";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export default function PricingCard({ plan, cycle, compact = false }) {
  const { effectiveMonthly, totalForCycle, months, discountPct } = calculatePlanPrice(plan.monthlyPrice, cycle);

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-300",
        plan.highlighted
          ? "border-gold-500/60 bg-gradient-to-b from-gold-500/[0.07] to-ink-900 shadow-[0_0_50px_-15px_rgba(198,160,74,0.35)]"
          : "border-ink-700 bg-ink-900/60 hover:border-ink-500"
      )}
    >
      {plan.highlighted ? (
        <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gold-500 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950">
          <Star className="size-3 fill-ink-950" /> Most Popular
        </span>
      ) : null}

      <h3 className="font-display text-3xl tracking-wide text-bone-50">{plan.name}</h3>
      <p className="mt-1 text-sm text-bone-500">{plan.tagline}</p>

      <div className="mt-6 flex items-end gap-2">
        <span className="font-display text-5xl text-bone-50">{formatCurrency(effectiveMonthly)}</span>
        <span className="mb-1.5 text-sm text-bone-500">/ month</span>
      </div>
      {months > 1 ? (
        <div className="mt-2 flex items-center gap-2 text-xs text-bone-500">
          <span>Billed {formatCurrency(totalForCycle)} every {months} months</span>
          {discountPct > 0 ? <Badge tone="success">Save {discountPct}%</Badge> : null}
        </div>
      ) : (
        <div className="mt-2 h-[18px]" />
      )}

      {!compact ? (
        <ul className="mt-7 flex-1 space-y-3.5 border-t border-ink-700 pt-7">
          {plan.features.map((feature) => (
            <li key={feature.label} className="flex items-start gap-3 text-sm">
              {feature.included ? (
                <Check className="mt-0.5 size-4 shrink-0 text-gold-400" />
              ) : (
                <X className="mt-0.5 size-4 shrink-0 text-bone-500/50" />
              )}
              <span className={feature.included ? "text-bone-200" : "text-bone-500/60 line-through"}>{feature.label}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-7 flex-1" />
      )}

      <Button
        href={`/membership/signup?plan=${plan.slug}&cycle=${cycle.id}`}
        variant={plan.highlighted ? "primary" : "secondary"}
        className="mt-8 w-full"
      >
        Choose {plan.name}
      </Button>
    </div>
  );
}
