import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { listEvents, getEventBySlug } from "@/lib/db/events";
import { Section, Eyebrow } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Badge from "@/components/ui/Badge";
import EventRegisterForm from "@/components/events/EventRegisterForm";
import { formatDate } from "@/lib/utils/format";

export async function generateStaticParams() {
  const events = await listEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return { title: event.name, description: event.description, alternates: { canonical: `/events/${event.slug}` } };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const spotsLeft = event.seatsTotal - event.seatsBooked;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.date,
    location: { "@type": "Place", name: event.location },
    description: event.description,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/events/events-banner.jpg" tone="rose" icon="PartyPopper" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <Eyebrow>{event.category}</Eyebrow>
          <h1 className="font-display mt-3 max-w-2xl text-5xl tracking-wide text-bone-50 sm:text-6xl">{event.name}</h1>
        </div>
      </div>

      <Section className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="font-display text-2xl tracking-wide text-bone-50">About This Event</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-bone-400">{event.description}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InfoCard icon={CalendarDays} label="Date & Time" value={`${formatDate(event.date)} · ${event.time}`} />
            <InfoCard icon={MapPin} label="Location" value={event.location} />
            <InfoCard icon={Users} label="Capacity" value={`${spotsLeft} / ${event.seatsTotal} seats left`} />
          </div>

          <div className="mt-6">
            <Badge tone="neutral">Demo event — for illustrative purposes only</Badge>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24">
            <EventRegisterForm event={event} />
          </div>
        </aside>
      </Section>
    </>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-5">
      <Icon className="size-5 text-gold-400" />
      <p className="mt-3 text-xs uppercase tracking-wider text-bone-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-bone-100">{value}</p>
    </div>
  );
}
