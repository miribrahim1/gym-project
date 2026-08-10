import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Gauge, Clock, Target, Award } from "lucide-react";
import { listPrograms, getProgramBySlug } from "@/lib/db/programs";
import { getTrainerBySlug } from "@/lib/db/trainers";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import Badge from "@/components/ui/Badge";

export async function generateStaticParams() {
  const programs = await listPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return {};
  return {
    title: program.name,
    description: program.shortDescription,
    alternates: { canonical: `/programs/${program.slug}` },
  };
}

export default async function ProgramDetailPage({ params }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  const trainer = program.trainerSlug ? await getTrainerBySlug(program.trainerSlug) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.name,
    description: program.shortDescription,
    provider: { "@type": "Organization", name: "IronVault Fitness" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src={program.image} tone="amber" icon={program.icon} ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <Eyebrow>Program</Eyebrow>
          <h1 className="font-display mt-3 max-w-3xl text-5xl tracking-wide text-bone-50 sm:text-6xl">{program.name}</h1>
          <p className="mt-4 max-w-xl text-bone-300">{program.shortDescription}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge tone="gold"><Gauge className="size-3" /> {program.difficulty}</Badge>
            <Badge tone="neutral"><Clock className="size-3" /> {program.duration}</Badge>
            <Badge tone="neutral"><Target className="size-3" /> {program.idealFor}</Badge>
          </div>
        </div>
      </div>

      <Section className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-16">
          <div>
            <SectionHeading eyebrow="Overview" title="What This Program Is" />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone-400">{program.overview}</p>
          </div>

          <div>
            <SectionHeading eyebrow="Benefits" title="What You'll Gain" />
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {program.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 rounded-xl border border-ink-700 bg-ink-900/60 p-4 text-sm text-bone-300">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold-400" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading eyebrow="Weekly Structure" title="A Typical Week" />
            <div className="mt-6 divide-y divide-ink-700 rounded-xl border border-ink-700 bg-ink-900/60">
              {program.weeklyStructure.map((d) => (
                <div key={d.day} className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">{d.day}</span>
                  <span className="text-right text-sm text-bone-300">{d.focus}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Methodology" title="How We Coach It" />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone-400">{program.methodology}</p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl tracking-wide text-bone-50">Who It&rsquo;s For</h3>
              <ul className="mt-4 space-y-3">
                {program.whoItsFor.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-bone-400">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-2xl tracking-wide text-bone-50">Expected Outcomes</h3>
              <ul className="mt-4 space-y-3">
                {program.expectedOutcomes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-bone-400">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="FAQ" title="Common Questions" />
            <div className="mt-6">
              <Accordion items={program.faqs.map((f, i) => ({ id: i, question: f.q, answer: f.a }))} />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {trainer ? (
              <Link
                href={`/trainers/${trainer.slug}`}
                className="block overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60 transition-colors hover:border-gold-500/40"
              >
                <PlaceholderImage src={trainer.image} tone={trainer.photoTone} icon="UserRound" ratio="video" label={trainer.name} size={40} />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-gold-400">Program Coach</p>
                  <h4 className="font-display mt-1 text-2xl tracking-wide text-bone-50">{trainer.name}</h4>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-bone-500">
                    <Award className="size-3.5" /> {trainer.experienceYears} years experience
                  </p>
                </div>
              </Link>
            ) : null}

            <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-b from-gold-500/[0.06] to-ink-900 p-6">
              <h4 className="font-display text-2xl tracking-wide text-bone-50">Ready to start?</h4>
              <p className="mt-2 text-sm text-bone-400">Join IronVault and get access to this program plus every class, trainer and facility.</p>
              <Button href="/membership/signup" className="mt-5 w-full" icon={ArrowRight} iconPosition="right">
                Start Your Journey
              </Button>
              <Button href="/personal-training" variant="secondary" className="mt-3 w-full">
                Book a Trainer Instead
              </Button>
            </div>
          </div>
        </aside>
      </Section>
    </>
  );
}
