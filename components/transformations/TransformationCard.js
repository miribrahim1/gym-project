import { ArrowRight } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Badge from "@/components/ui/Badge";

const TONES = ["amber", "emerald", "rose", "slate"];

export default function TransformationCard({ transformation, index = 0 }) {
  const tone = TONES[index % TONES.length];

  return (
    <div className="group overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40">
      <div className="grid grid-cols-2">
        <PlaceholderImage src={transformation.beforeImage} tone="slate" icon="UserRound" label="Before" ratio="square" size={30} />
        <PlaceholderImage src={transformation.afterImage} tone={tone} icon="Sparkles" label="After" ratio="square" size={30} />
      </div>
      <div className="p-6">
        <Badge tone="gold">{transformation.category}</Badge>
        <h3 className="font-display mt-3 text-2xl leading-tight tracking-wide text-bone-50">{transformation.headline}</h3>
        <p className="mt-2 text-sm leading-relaxed text-bone-500">{transformation.resultSummary}</p>
        <div className="mt-4 flex items-center justify-between border-t border-ink-700 pt-4 text-xs text-bone-500">
          <span>{transformation.name} · {transformation.durationWeeks} weeks</span>
          <span className="flex items-center gap-1 text-gold-400">
            {transformation.stats.before} <ArrowRight className="size-3" /> {transformation.stats.after}
          </span>
        </div>
      </div>
    </div>
  );
}
