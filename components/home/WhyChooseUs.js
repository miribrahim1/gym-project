import { Dumbbell, BadgeCheck, ClipboardList, Building2, Apple, Users } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

const REASONS = [
  { icon: Dumbbell, title: "Premium Equipment", description: "Commercial-grade strength, cardio and functional equipment maintained to the highest standard." },
  { icon: BadgeCheck, title: "Certified Trainers", description: "Every coach on our floor is certified, experienced and genuinely invested in your progress." },
  { icon: ClipboardList, title: "Personalized Programs", description: "No generic templates — every program is built around your goals, schedule and starting point." },
  { icon: Building2, title: "Modern Facilities", description: "Purpose-built training zones, recovery spaces and studios designed for a premium experience." },
  { icon: Apple, title: "Nutrition Guidance", description: "In-house nutrition coaching and meal plans that complement your training, not complicate it." },
  { icon: Users, title: "Supportive Community", description: "A high-energy, judgment-free community that shows up for each other, every single day." },
];

export default function WhyChooseUs() {
  return (
    <Section className="bg-ink-900/40">
      <SectionHeading
        eyebrow="Why IronVault"
        title="Built Different, By Design"
        description="Every detail — from equipment to coaching to community — is built around one outcome: your results."
      />
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map((reason, i) => (
          <Reveal key={reason.title} delay={i * 60}>
            <div className="group h-full rounded-2xl border border-ink-700 bg-ink-900/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:bg-ink-800/60">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 transition-colors group-hover:bg-gold-500/20">
                <reason.icon className="size-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-display mt-5 text-2xl tracking-wide text-bone-50">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-500">{reason.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
