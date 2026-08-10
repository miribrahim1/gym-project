import { listTrainers } from "@/lib/db/trainers";
import { Section, SectionHeading } from "@/components/ui/Section";
import TrainerCard from "@/components/trainers/TrainerCard";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Trainers",
  description: "Meet the certified coaches behind IronVault Fitness — strength, nutrition, CrossFit, boxing, yoga and personal training specialists.",
  alternates: { canonical: "/trainers" },
};

export default async function TrainersPage() {
  const trainers = await listTrainers();

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/trainers/trainers-banner.jpg" tone="slate" icon="Users" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Our Coaches</p>
          <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">Trainers</h1>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow={`${trainers.length} Coaches`} title="Trained By The Best" description="Every coach on our floor is certified, experienced, and genuinely invested in your progress." />
        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {trainers.map((trainer, i) => (
            <Reveal key={trainer.id} delay={(i % 4) * 60}>
              <TrainerCard trainer={trainer} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
