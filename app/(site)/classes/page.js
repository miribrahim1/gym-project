import { listSchedule, listClassDefinitions } from "@/lib/db/classes";
import { listTrainers } from "@/lib/db/trainers";
import { Section, SectionHeading } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import ClassScheduleBoard from "@/components/classes/ClassScheduleBoard";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Fitness Classes",
  description: "Browse and book IronVault Fitness group classes — HIIT, Yoga, Zumba, CrossFit, Strength, Boxing, Mobility, Spin, Pilates and Functional Training.",
  alternates: { canonical: "/classes" },
};

export default async function ClassesPage() {
  const [sessions, classDefinitions, trainers] = await Promise.all([listSchedule(), listClassDefinitions(), listTrainers()]);

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/classes/classes-banner.jpg" tone="emerald" icon="CalendarDays" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Weekly Schedule</p>
          <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">Fitness Classes</h1>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow={`${classDefinitions.length} Class Types`} title="Find Your Class" description="Filter by day, class type, trainer or difficulty, then book your spot directly." />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {classDefinitions.map((c, i) => (
            <Reveal key={c.id} delay={i * 40} className="rounded-xl border border-ink-700 bg-ink-900/60 p-4 text-center">
              <p className="font-display text-lg tracking-wide text-bone-50">{c.name}</p>
              <p className="mt-1 text-[11px] text-bone-500">{c.difficulty}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <ClassScheduleBoard sessions={sessions} classDefinitions={classDefinitions} trainers={trainers} />
        </div>
      </Section>
    </>
  );
}
