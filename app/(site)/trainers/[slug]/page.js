import { notFound } from "next/navigation";
import { Award, Quote, CheckCircle2 } from "lucide-react";
import { listTrainers, getTrainerBySlug } from "@/lib/db/trainers";
import { listPrograms } from "@/lib/db/programs";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgramCard from "@/components/programs/ProgramCard";

export async function generateStaticParams() {
  const trainers = await listTrainers();
  return trainers.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trainer = await getTrainerBySlug(slug);
  if (!trainer) return {};
  return {
    title: trainer.name,
    description: `${trainer.name} — ${trainer.role} at IronVault Fitness. ${trainer.experienceYears} years of experience in ${trainer.specialization}.`,
    alternates: { canonical: `/trainers/${trainer.slug}` },
  };
}

export default async function TrainerDetailPage({ params }) {
  const { slug } = await params;
  const trainer = await getTrainerBySlug(slug);
  if (!trainer) notFound();

  const allPrograms = await listPrograms();
  const trainerPrograms = allPrograms.filter((p) => trainer.programs.includes(p.slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: trainer.name,
    jobTitle: trainer.role,
    worksFor: { "@type": "Organization", name: "IronVault Fitness" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Section className="grid grid-cols-1 gap-12 pt-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <PlaceholderImage src={trainer.image} tone={trainer.photoTone} icon="UserRound" ratio="portrait" className="rounded-2xl" size={64} priority />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StarRating rating={trainer.rating} count={trainer.reviewsCount} />
              <Badge tone="gold"><Award className="size-3" /> {trainer.experienceYears} yrs experience</Badge>
            </div>
            <Button href={`/personal-training?trainer=${trainer.slug}`} className="mt-6 w-full">
              Book a Session
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Eyebrow>{trainer.specialization}</Eyebrow>
          <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">{trainer.name}</h1>
          <p className="mt-2 text-lg text-gold-400">{trainer.role}</p>

          <div className="mt-8">
            <h2 className="font-display text-2xl tracking-wide text-bone-50">Bio</h2>
            <p className="mt-3 leading-relaxed text-bone-400">{trainer.bio}</p>
          </div>

          <div className="mt-8 rounded-xl border border-ink-700 bg-ink-900/60 p-6">
            <Quote className="size-6 text-gold-500/60" />
            <p className="mt-3 font-display text-2xl leading-snug tracking-wide text-bone-100">{trainer.philosophy}</p>
            <p className="mt-2 text-xs uppercase tracking-wider text-bone-500">Training Philosophy</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-xl tracking-wide text-bone-50">Specializations</h3>
              <ul className="mt-4 space-y-2.5">
                {trainer.specializations.map((s) => (
                  <li key={s} className="flex items-center gap-2.5 text-sm text-bone-400">
                    <CheckCircle2 className="size-4 shrink-0 text-gold-400" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl tracking-wide text-bone-50">Certifications</h3>
              <ul className="mt-4 space-y-2.5">
                {trainer.certifications.map((c) => (
                  <li key={c} className="flex items-center gap-2.5 text-sm text-bone-400">
                    <Award className="size-4 shrink-0 text-gold-400" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-ink-700 bg-ink-900/60 p-6">
            <h3 className="font-display text-xl tracking-wide text-bone-50">Client Results</h3>
            <p className="mt-2 text-sm text-bone-400">
              Members coached by {trainer.name.split(" ")[0]} have achieved measurable results across strength, body composition and performance goals.
              See real (demo) examples in our <a href="/transformations" className="text-gold-400 underline underline-offset-4">Transformations gallery</a>.
            </p>
          </div>
        </div>
      </Section>

      {trainerPrograms.length ? (
        <Section className="bg-ink-900/40">
          <SectionHeading eyebrow="Available Programs" title={`Train With ${trainer.name.split(" ")[0]}`} />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainerPrograms.map((program, i) => (
              <ProgramCard key={program.id} program={program} index={i} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
