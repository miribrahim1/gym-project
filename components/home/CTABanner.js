import { ArrowRight, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function CTABanner({ settings }) {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      <div className="absolute inset-0 opacity-60">
        <PlaceholderImage src="/images/about/about-banner.jpg" tone="ember" icon="Flame" ratio="auto" className="h-full w-full" size={0} sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/70" />
      <div className="container-app relative z-10 py-24 text-center sm:py-28">
        <h2 className="font-display mx-auto max-w-3xl text-4xl leading-[0.95] tracking-wide text-bone-50 sm:text-6xl">
          Your Strongest Self Is <span className="text-gradient-gold">One Decision</span> Away
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-bone-400">
          Join {settings.gymName} today and start training with a team that&rsquo;s genuinely invested in your results.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/membership/signup" size="lg" icon={ArrowRight} iconPosition="right">
            Start Your Journey
          </Button>
          <Button href={`tel:${settings.phone}`} size="lg" variant="secondary" icon={Phone}>
            Call {settings.phone}
          </Button>
        </div>
      </div>
    </section>
  );
}
