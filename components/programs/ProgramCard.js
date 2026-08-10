import Link from "next/link";
import { ArrowUpRight, Clock, Gauge, Target } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

const TONES = ["amber", "rose", "emerald", "slate"];

export default function ProgramCard({ program, index = 0 }) {
  const tone = TONES[index % TONES.length];

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40"
    >
      <div className="relative">
        <PlaceholderImage src={program.image} tone={tone} icon={program.icon} label={program.name} ratio="video" size={44} />
        <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink-950/70 text-gold-400 backdrop-blur transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl tracking-wide text-bone-50">{program.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-bone-500">{program.shortDescription}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink-700 pt-4 text-xs text-bone-500">
          <span className="flex items-center gap-1.5">
            <Gauge className="size-3.5 text-gold-400" /> {program.difficulty}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-gold-400" /> {program.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="size-3.5 text-gold-400" /> {program.idealFor}
          </span>
        </div>
      </div>
    </Link>
  );
}
