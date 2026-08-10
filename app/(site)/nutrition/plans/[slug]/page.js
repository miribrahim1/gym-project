import { notFound } from "next/navigation";
import { Clock, ArrowRight } from "lucide-react";
import { listNutritionPlans, getNutritionPlanBySlug } from "@/lib/db/nutrition";
import { Section, Eyebrow } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Button from "@/components/ui/Button";

export async function generateStaticParams() {
  const plans = await listNutritionPlans();
  return plans.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const plan = await getNutritionPlanBySlug(slug);
  if (!plan) return {};
  return { title: plan.name, description: plan.description, alternates: { canonical: `/nutrition/plans/${plan.slug}` } };
}

export default async function NutritionPlanPage({ params }) {
  const { slug } = await params;
  const plan = await getNutritionPlanBySlug(slug);
  if (!plan) notFound();

  const macros = [
    { label: "Calories", value: plan.calories, unit: "kcal" },
    { label: "Protein", value: plan.protein, unit: "g" },
    { label: "Carbs", value: plan.carbs, unit: "g" },
    { label: "Fats", value: plan.fats, unit: "g" },
  ];

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/nutrition/nutrition-banner.jpg" tone="emerald" icon="Apple" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <Eyebrow>{plan.goal}</Eyebrow>
          <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">{plan.name}</h1>
          <p className="mt-3 max-w-xl text-bone-300">{plan.description}</p>
        </div>
      </div>

      <Section className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="font-display text-2xl tracking-wide text-bone-50">Daily Macro Targets</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {macros.map((m) => (
              <div key={m.label} className="rounded-xl border border-ink-700 bg-ink-900/60 p-5 text-center">
                <p className="font-display text-3xl text-gold-400">{m.value}</p>
                <p className="text-xs uppercase tracking-wider text-bone-500">{m.label} ({m.unit})</p>
              </div>
            ))}
          </div>

          <h2 className="font-display mt-12 text-2xl tracking-wide text-bone-50">Sample Meals</h2>
          <div className="mt-6 divide-y divide-ink-700 rounded-xl border border-ink-700 bg-ink-900/60">
            {plan.sampleMeals.map((m) => (
              <div key={m.meal} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">{m.meal}</span>
                <span className="text-sm text-bone-300">{m.items}</span>
              </div>
            ))}
          </div>

          <h2 className="font-display mt-12 text-2xl tracking-wide text-bone-50">Meal Timing</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {plan.mealTiming.map((t) => (
              <span key={t} className="flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-900/60 px-4 py-2 text-sm text-bone-300">
                <Clock className="size-3.5 text-gold-400" /> {t}
              </span>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-gold-500/30 bg-gradient-to-b from-gold-500/[0.06] to-ink-900 p-6">
            <h3 className="font-display text-2xl tracking-wide text-bone-50">Want this plan personalized?</h3>
            <p className="mt-2 text-sm text-bone-400">Book a consultation and we&rsquo;ll tailor this plan to your exact calories, preferences and schedule.</p>
            <Button href="/nutrition/consultation" className="mt-5 w-full" icon={ArrowRight} iconPosition="right">Book Consultation</Button>
          </div>
        </aside>
      </Section>
    </>
  );
}
