import { listTrainers } from "@/lib/db/trainers";
import { Section, SectionHeading } from "@/components/ui/Section";
import TrainerCard from "@/components/trainers/TrainerCard";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

export default async function TrainersPreview() {
  const trainers = await listTrainers();
  const featured = trainers.slice(0, 4);

  return (
    <Section>
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Our Coaches"
          title="Trained By The Best"
          description="Certified, experienced and genuinely invested in getting you results."
        />
        <Button href="/trainers" variant="secondary" icon={ArrowRight} iconPosition="right" className="shrink-0">
          Meet All Trainers
        </Button>
      </div>
      <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
        {featured.map((trainer, i) => (
          <Reveal key={trainer.id} delay={i * 70}>
            <TrainerCard trainer={trainer} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
