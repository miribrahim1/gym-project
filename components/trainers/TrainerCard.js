import Link from "next/link";
import { Award, ArrowUpRight } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import StarRating from "@/components/ui/StarRating";

export default function TrainerCard({ trainer }) {
  return (
    <Link
      href={`/trainers/${trainer.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40"
    >
      <div className="relative">
        <PlaceholderImage src={trainer.image} tone={trainer.photoTone} icon="UserRound" label={trainer.name} ratio="portrait" size={52} />
        <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink-950/70 text-gold-400 backdrop-blur transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl tracking-wide text-bone-50">{trainer.name}</h3>
        <p className="mt-1 text-xs uppercase tracking-wider text-gold-400">{trainer.role}</p>
        <div className="mt-3 flex items-center justify-between">
          <StarRating rating={trainer.rating} count={trainer.reviewsCount} size={13} />
          <span className="flex items-center gap-1 text-xs text-bone-500">
            <Award className="size-3.5" /> {trainer.experienceYears} yrs
          </span>
        </div>
      </div>
    </Link>
  );
}
