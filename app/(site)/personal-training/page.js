import { UserCheck, ClipboardList, LineChart, Ruler, Apple, CalendarCheck2 } from "lucide-react";
import { listTrainers } from "@/lib/db/trainers";
import { Section, SectionHeading } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import PersonalTrainingBooking from "@/components/trainers/PersonalTrainingBooking";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Personal Training",
  description: "Book 1-on-1 personal training at IronVault Fitness — customized workout plans, progress tracking, form correction and weekly check-ins.",
  alternates: { canonical: "/personal-training" },
};

const FEATURES = [
  { icon: UserCheck, title: "1-on-1 Coaching", description: "Every session is led entirely by your dedicated trainer." },
  { icon: ClipboardList, title: "Customized Plans", description: "Programming built around your goals, schedule and limitations." },
  { icon: LineChart, title: "Progress Tracking", description: "Measured, logged progress reviewed with you every step of the way." },
  { icon: Ruler, title: "Form Correction", description: "Real-time technique coaching on every rep, every session." },
  { icon: Apple, title: "Nutrition Guidance", description: "Complementary nutrition direction to support your training." },
  { icon: CalendarCheck2, title: "Weekly Check-ins", description: "Consistent accountability to keep you on track between sessions." },
];

export default async function PersonalTrainingPage({ searchParams }) {
  const params = await searchParams;
  const trainers = await listTrainers();

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/programs/personal-training.jpg" tone="rose" icon="UserCheck" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Personal Training</p>
          <h1 className="font-display mt-3 max-w-2xl text-5xl tracking-wide text-bone-50 sm:text-6xl">
            Dedicated Coaching, Built Around You
          </h1>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow="What You Get" title="Fully Individualized Coaching" align="center" className="mx-auto" />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-ink-700 bg-ink-900/60 p-7">
                <div className="flex size-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                  <f.icon className="size-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-display mt-5 text-xl tracking-wide text-bone-50">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-500">{f.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="book" className="bg-ink-900/40">
        <SectionHeading eyebrow="Book a Session" title="Reserve Your Spot" description="Choose your trainer, pick a date and time, and confirm — no payment required for this demo." />
        <div className="mt-12">
          <PersonalTrainingBooking trainers={trainers} initialTrainer={params?.trainer} />
        </div>
      </Section>
    </>
  );
}
