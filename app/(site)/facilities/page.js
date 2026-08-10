import { listFacilities } from "@/lib/db/facilities";
import { Section, SectionHeading } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Facilities",
  description: "Explore IronVault Fitness facilities — Cardio Zone, Strength Zone, Functional Area, Recovery Area, Sauna, Personal Training Studio and more.",
  alternates: { canonical: "/facilities" },
};

const ICONS = { "cardio-zone": "HeartPulse", "strength-zone": "Dumbbell", "functional-area": "Activity", "free-weights": "Weight", "locker-rooms": "LockKeyhole", showers: "ShowerHead", "recovery-area": "HandHeart", sauna: "Flame", "personal-training-studio": "UserCheck", "nutrition-bar": "Apple" };

export default async function FacilitiesPage() {
  const facilities = await listFacilities();

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/facilities/facilities-banner.jpg" tone="amber" icon="Building2" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">World-Class Space</p>
          <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">Facilities</h1>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow={`${facilities.length} Spaces`} title="Purpose-Built For Performance" description="Every zone in our facility is designed around a specific part of your training journey." />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility, i) => (
            <Reveal key={facility.id} delay={(i % 3) * 70} className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60">
              <PlaceholderImage src={facility.image} tone={facility.tone} icon={ICONS[facility.slug] || "Building2"} label={facility.name} ratio="video" size={40} />
              <div className="p-6">
                <h3 className="font-display text-2xl tracking-wide text-bone-50">{facility.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-500">{facility.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
