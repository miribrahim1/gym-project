import { listTransformations } from "@/lib/db/transformations";
import { Section, SectionHeading } from "@/components/ui/Section";
import TransformationCard from "@/components/transformations/TransformationCard";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

export default async function TransformationsPreview() {
  const transformations = await listTransformations();
  const featured = transformations.slice(0, 3);

  return (
    <Section className="bg-ink-900/40">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Real Results"
          title="Transformations That Speak"
          description="Demo member stories illustrating the kind of results our programs are built to produce."
        />
        <Button href="/transformations" variant="secondary" icon={ArrowRight} iconPosition="right" className="shrink-0">
          View All Stories
        </Button>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((t, i) => (
          <Reveal key={t.id} delay={i * 80}>
            <TransformationCard transformation={t} index={i} />
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-center text-xs uppercase tracking-wider text-bone-600">
        Demo content — illustrative member stories for portfolio purposes, not verified real-world results.
      </p>
    </Section>
  );
}
