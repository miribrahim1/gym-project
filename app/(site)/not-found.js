import { Compass, Home } from "lucide-react";
import { Section } from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function SiteNotFound() {
  return (
    <Section className="flex min-h-[70vh] items-center justify-center text-center">
      <div>
        <p className="font-display text-8xl text-gold-500/40 sm:text-9xl">404</p>
        <h1 className="font-display mt-2 text-4xl tracking-wide text-bone-50 sm:text-5xl">Lost Your Rep Count?</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-bone-400">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Let&rsquo;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" icon={Home}>Back to Home</Button>
          <Button href="/programs" variant="secondary" icon={Compass}>Explore Programs</Button>
        </div>
      </div>
    </Section>
  );
}
