import { listEvents } from "@/lib/db/events";
import { Section, SectionHeading } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import EventCard from "@/components/events/EventCard";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Events",
  description: "Upcoming IronVault Fitness events — fitness challenges, powerlifting meets, nutrition workshops and community runs.",
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  const events = await listEvents();

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/events/events-banner.jpg" tone="rose" icon="PartyPopper" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">What&rsquo;s On</p>
          <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">Events</h1>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow={`${events.length} Upcoming`} title="Challenges, Workshops & Community" />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <Reveal key={event.id} delay={(i % 3) * 70}>
              <EventCard event={event} index={i} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
