import { listPrograms } from "@/lib/db/programs";
import { Section, SectionHeading } from "@/components/ui/Section";
import ProgramCard from "@/components/programs/ProgramCard";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

export default async function ProgramsPreview() {
  const programs = await listPrograms();
  const featured = programs.slice(0, 6);

  return (
    <Section>
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Training Programs"
          title="A Program For Every Goal"
          description="From first-timers to competitive athletes — structured programming built by coaches who specialize in results."
        />
        <Button href="/programs" variant="secondary" icon={ArrowRight} iconPosition="right" className="shrink-0">
          View All Programs
        </Button>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((program, i) => (
          <Reveal key={program.id} delay={i * 70}>
            <ProgramCard program={program} index={i} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
