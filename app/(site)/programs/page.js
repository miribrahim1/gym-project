import { listPrograms } from "@/lib/db/programs";
import { Section, SectionHeading } from "@/components/ui/Section";
import ProgramCard from "@/components/programs/ProgramCard";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Training Programs",
  description: "Explore IronVault Fitness training programs — Strength Training, Weight Loss, Muscle Building, CrossFit, HIIT, Personal Training and more.",
  alternates: { canonical: "/programs" },
};

export default async function ProgramsPage() {
  const programs = await listPrograms();

  return (
    <>
      <PageHero />
      <Section>
        <SectionHeading
          eyebrow="10 Programs"
          title="Choose Your Path"
          description="Every program is coached, progressive and built around a clear outcome — pick the one that matches where you are right now."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, i) => (
            <Reveal key={program.id} delay={(i % 3) * 70}>
              <ProgramCard program={program} index={i} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

function PageHero() {
  return (
    <div className="relative overflow-hidden border-b border-ink-700">
      <PlaceholderImage src="/images/programs/programs-banner.jpg" tone="slate" icon="Dumbbell" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
      <div className="container-app absolute inset-x-0 bottom-0 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Programs</p>
        <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">Training Programs</h1>
      </div>
    </div>
  );
}
