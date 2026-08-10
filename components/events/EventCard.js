import Link from "next/link";
import { CalendarDays, MapPin, Users, ArrowUpRight } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/format";

const TONES = ["amber", "rose", "emerald", "slate"];

export default function EventCard({ event, index = 0 }) {
  const spotsLeft = event.seatsTotal - event.seatsBooked;
  const almostFull = spotsLeft > 0 && spotsLeft <= event.seatsTotal * 0.15;

  return (
    <Link href={`/events/${event.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40">
      <div className="relative">
        <PlaceholderImage tone={TONES[index % TONES.length]} icon="PartyPopper" label={event.category} ratio="video" size={36} />
        <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink-950/70 text-gold-400 backdrop-blur transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Badge tone="gold">{event.category}</Badge>
        <h3 className="font-display mt-3 text-2xl leading-tight tracking-wide text-bone-50">{event.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-bone-500 line-clamp-2">{event.description}</p>
        <div className="mt-4 space-y-2 border-t border-ink-700 pt-4 text-xs text-bone-500">
          <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5 text-gold-400" /> {formatDate(event.date)} · {event.time}</span>
          <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-gold-400" /> {event.location}</span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5 text-gold-400" /> {spotsLeft > 0 ? `${spotsLeft} seats left` : "Fully booked"}
            {almostFull ? <Badge tone="warning" className="ml-1">Almost Full</Badge> : null}
          </span>
        </div>
      </div>
    </Link>
  );
}
