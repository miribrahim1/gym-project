import { ArrowRight, Compass } from "lucide-react";
import Button from "@/components/ui/Button";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import HeroBackgroundSlider from "@/components/home/HeroBackgroundSlider";

const HERO_IMAGES = [
  "/images/hero/hero-training.jpg",
  "/images/hero/hero-slide-2.jpg",
  "/images/hero/hero-slide-3.jpg",
  "/images/hero/hero-slide-4.jpg",
];

const TRUST_STATS = (settings) => [
  { value: `${settings.stats.yearsExperience}+`, label: "Years Experience" },
  { value: `${(settings.stats.membersCount / 1000).toFixed(1).replace(".0", "")}K+`, label: "Members" },
  { value: `${settings.stats.trainersCount}+`, label: "Expert Trainers" },
  { value: `${(settings.stats.workoutsCompleted / 1000).toFixed(0)}K+`, label: "Workouts Completed" },
];

export default function Hero({ settings }) {
  const stats = TRUST_STATS(settings);

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink-950">
      <HeroBackgroundSlider images={HERO_IMAGES} />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/40 to-transparent" />

      <div className="container-app relative z-10 py-32">
        <div className="max-w-3xl">
          <div className="animate-fade-up flex items-center gap-3 text-gold-400" style={{ animationDelay: "80ms" }}>
            <span className="h-px w-10 bg-gold-500/70" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em]">{settings.gymName}</span>
          </div>

          <h1
            className="font-display animate-fade-up mt-6 text-[clamp(3.2rem,9vw,7rem)] leading-[0.88] tracking-wide text-bone-50"
            style={{ animationDelay: "160ms" }}
          >
            Train Hard.
            <br />
            <span className="text-gradient-gold">Live Strong.</span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-bone-300 sm:text-lg"
            style={{ animationDelay: "260ms" }}
          >
            More than a gym. A community built around strength, discipline and transformation —
            {" "}{settings.tagline}
          </p>

          <div className="animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row" style={{ animationDelay: "360ms" }}>
            <Button href="/membership/signup" size="lg" icon={ArrowRight} iconPosition="right">
              Start Your Journey
            </Button>
            <Button href="/programs" size="lg" variant="secondary" icon={Compass} iconPosition="right">
              Explore Programs
            </Button>
          </div>

          <dl
            className="animate-fade-up mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-bone-100/10 pt-8 sm:grid-cols-4"
            style={{ animationDelay: "460ms" }}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-3xl text-bone-50 sm:text-4xl">
                  <AnimatedCounter value={stat.value} />
                </dd>
                <dd className="mt-1 text-xs uppercase tracking-wider text-bone-500">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-bone-500 sm:flex animate-fade-in" style={{ animationDelay: "800ms" }}>
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-gold-500 to-transparent" />
      </div>
    </section>
  );
}
