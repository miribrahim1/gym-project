import { Target, Compass, Users, HeartHandshake, Info } from "lucide-react";
import { getSettings } from "@/lib/db/settings";
import { Section, SectionHeading } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "About Us",
  description: "The story, mission, philosophy and values behind IronVault Fitness — a premium strength and fitness club built on community and results.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { icon: Target, title: "Results-Driven", description: "Every program, class and coaching decision is measured against real outcomes." },
  { icon: Compass, title: "Integrity in Coaching", description: "No gimmicks, no shortcuts — just honest, evidence-based coaching." },
  { icon: Users, title: "Community First", description: "We build a floor where members show up for each other, every day." },
  { icon: HeartHandshake, title: "Long-Term Commitment", description: "We're invested in your progress well beyond a single training block." },
];

const TIMELINE = [
  { year: "2016", title: "Founded", description: "IronVault Fitness opens its first location with a single strength floor and a bold promise: real coaching, real results." },
  { year: "2018", title: "First Expansion", description: "A second location opens alongside our first dedicated group fitness studio, expanding into classes and community events." },
  { year: "2021", title: "Performance Center", description: "The IronVault Performance Center launches — a dedicated space for athletic performance training and competition prep." },
  { year: "2024", title: "Nutrition Lab", description: "Our in-house Nutrition Lab and supplement line launch, bringing coaching and nutrition fully under one roof." },
  { year: "2026", title: "Today", description: "IronVault Fitness serves thousands of members through a full ecosystem of training, nutrition and community programs." },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/about/about-banner.jpg" tone="slate" icon="Dumbbell" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Our Story</p>
          <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">About {settings.gymName}</h1>
        </div>
      </div>

      <Section className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Our Story" title="Built By Lifters, For Lifters" />
          <p className="mt-6 leading-relaxed text-bone-400">
            {settings.gymName} started with a simple frustration: most gyms sell memberships, not results. We set out to build something different —
            a training environment where every member gets real coaching, structured programming and a community that actually holds them accountable.
          </p>
          <p className="mt-4 leading-relaxed text-bone-400">
            What began as a single strength floor has grown into a full ecosystem — training, nutrition, recovery and community — all built around
            one outcome: helping our members become stronger, more disciplined versions of themselves.
          </p>
        </div>
        <div>
          <SectionHeading eyebrow="Our Mission" title="Strength, Discipline, Community" />
          <p className="mt-6 leading-relaxed text-bone-400">
            Our mission is to make elite-level coaching, programming and nutrition guidance accessible to every member who walks through our doors —
            regardless of where they&rsquo;re starting from.
          </p>
          <p className="mt-4 leading-relaxed text-bone-400">
            We believe strength training is one of the most powerful tools for building discipline that extends far beyond the gym floor —
            into work, relationships and every other part of life.
          </p>
        </div>
      </Section>

      <Section className="bg-ink-900/40">
        <SectionHeading eyebrow="Our Philosophy" title="How We Think About Training" align="center" className="mx-auto" />
        <div className="mt-10 mx-auto max-w-3xl rounded-2xl border border-ink-700 bg-ink-900/60 p-8 text-center">
          <p className="font-display text-2xl leading-snug tracking-wide text-bone-100 sm:text-3xl">
            &ldquo;Consistency, coached correctly, beats intensity every single time.&rdquo;
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Our Values" title="What We Stand For" align="center" className="mx-auto" />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-ink-700 bg-ink-900/60 p-7 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                  <v.icon className="size-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-display mt-5 text-xl tracking-wide text-bone-50">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-500">{v.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-ink-900/40">
        <SectionHeading eyebrow="Our Journey" title="Milestones" align="center" className="mx-auto" />
        <div className="mt-14 mx-auto max-w-2xl">
          {TIMELINE.map((item, i) => (
            <Reveal key={item.year} delay={i * 70} className="relative flex gap-6 pb-10 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 font-display text-sm text-gold-400">
                  {item.year}
                </span>
                {i < TIMELINE.length - 1 ? <span className="mt-2 w-px flex-1 bg-ink-700" /> : null}
              </div>
              <div className="pb-2">
                <h3 className="font-display text-xl tracking-wide text-bone-50">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-bone-500">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-gold-500/20 bg-gold-500/[0.04] px-5 py-4 text-sm text-bone-400">
          <Info className="mt-0.5 size-4 shrink-0 text-gold-400" />
          <p>This brand history is fictional demo content created for portfolio/demonstration purposes.</p>
        </div>
      </Section>

      <Section className="text-center">
        <SectionHeading eyebrow="Join Us" title="Become Part of Our Community" align="center" className="mx-auto" />
        <Button href="/membership/signup" size="lg" className="mt-8">Start Your Journey</Button>
      </Section>
    </>
  );
}
