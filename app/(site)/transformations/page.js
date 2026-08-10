import { Info } from "lucide-react";
import { listTransformations } from "@/lib/db/transformations";
import { Section, SectionHeading } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import TransformationsBoard from "@/components/transformations/TransformationsBoard";

export const metadata = {
  title: "Transformations",
  description: "Member transformation stories from IronVault Fitness — weight loss, muscle gain, strength and athletic performance results.",
  alternates: { canonical: "/transformations" },
};

export default async function TransformationsPage() {
  const transformations = await listTransformations();

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/programs/body-transformation.jpg" tone="rose" icon="Sparkles" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Real Results</p>
          <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">Transformations</h1>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow={`${transformations.length} Stories`} title="Results Built On Consistency" description="Explore member journeys across weight loss, muscle gain, strength and athletic performance." />

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold-500/20 bg-gold-500/[0.04] px-5 py-4 text-sm text-bone-400">
          <Info className="mt-0.5 size-4 shrink-0 text-gold-400" />
          <p>
            <strong className="text-bone-200">Demo content notice:</strong> these transformation stories are illustrative examples created for portfolio/demo purposes.
            They do not represent verified, real-world member results.
          </p>
        </div>

        <div className="mt-12">
          <TransformationsBoard transformations={transformations} />
        </div>
      </Section>
    </>
  );
}
