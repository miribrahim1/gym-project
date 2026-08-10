import Link from "next/link";
import { Apple, ClipboardList, Calculator, Flame, Dumbbell, Trophy, Pill, ArrowRight, ArrowUpRight } from "lucide-react";
import { listNutritionPlans } from "@/lib/db/nutrition";
import { Section, SectionHeading } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Nutrition",
  description: "IronVault Nutrition Lab — personalized meal plans, macro tracking, weight loss and muscle gain nutrition, sports nutrition and 1-on-1 consultations.",
  alternates: { canonical: "/nutrition" },
};

const SERVICES = [
  { icon: ClipboardList, title: "Nutrition Consultation", description: "1-on-1 sessions to assess your goals and build a practical plan." },
  { icon: Apple, title: "Personalized Meal Plans", description: "Structured meal plans tailored to your calorie and macro targets." },
  { icon: Calculator, title: "Macro Tracking", description: "Learn to track protein, carbs and fats without the guesswork." },
  { icon: Flame, title: "Weight Loss Nutrition", description: "Sustainable deficit-based plans that preserve lean muscle." },
  { icon: Dumbbell, title: "Muscle Gain Nutrition", description: "Surplus-calibrated plans built for clean, consistent growth." },
  { icon: Trophy, title: "Sports Nutrition", description: "Performance-focused fueling for competitive training schedules." },
  { icon: Pill, title: "Supplement Guidance", description: "Clear, evidence-based direction on what actually helps." },
];

export default async function NutritionPage() {
  const plans = await listNutritionPlans();

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/nutrition/nutrition-banner.jpg" tone="emerald" icon="Apple" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Nutrition Lab</p>
          <h1 className="font-display mt-3 max-w-2xl text-5xl tracking-wide text-bone-50 sm:text-6xl">Nutrition, Coached Like Training</h1>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow="What We Offer" title="A Complete Nutrition System" align="center" className="mx-auto" />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 50}>
              <div className="h-full rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                  <s.icon className="size-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-display mt-4 text-lg tracking-wide text-bone-50">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-bone-500">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-ink-900/40">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Nutrition Plans" title="Choose Your Plan" description="Structured calorie and macro targets built around your specific goal." />
          <Button href="/nutrition/consultation" variant="secondary" icon={ArrowRight} iconPosition="right" className="shrink-0">Book a Consultation</Button>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 70}>
              <Link href={`/nutrition/plans/${plan.slug}`} className="group flex h-full flex-col rounded-2xl border border-ink-700 bg-ink-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-2xl tracking-wide text-bone-50">{plan.name}</h3>
                  <ArrowUpRight className="size-4 text-gold-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="mt-2 flex-1 text-sm text-bone-500">{plan.description}</p>
                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-ink-700 pt-4 text-xs">
                  <Stat label="Calories" value={plan.calories} />
                  <Stat label="Protein" value={`${plan.protein}g`} />
                  <Stat label="Carbs" value={`${plan.carbs}g`} />
                  <Stat label="Fats" value={`${plan.fats}g`} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="text-center">
        <SectionHeading eyebrow="Get Started" title="Book Your Nutrition Consultation" description="Sit down with one of our nutrition coaches and build a plan that actually fits your life." align="center" className="mx-auto" />
        <Button href="/nutrition/consultation" size="lg" className="mt-8" icon={ArrowRight} iconPosition="right">Book Nutrition Consultation</Button>
      </Section>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-bone-500">{label}</p>
      <p className="mt-0.5 font-semibold text-bone-100">{value}</p>
    </div>
  );
}
