import { Quote } from "lucide-react";
import { listTestimonials } from "@/lib/db/testimonials";
import { Section, SectionHeading } from "@/components/ui/Section";
import StarRating from "@/components/ui/StarRating";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";
import Badge from "@/components/ui/Badge";

const TONES = ["amber", "rose", "emerald", "slate"];

export default async function Testimonials() {
  const testimonials = await listTestimonials();

  return (
    <Section>
      <SectionHeading
        eyebrow="Member Voices"
        title="What Our Community Says"
        align="center"
        className="mx-auto"
      />
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 60}>
            <div className="flex h-full flex-col rounded-2xl border border-ink-700 bg-ink-900/60 p-7">
              <Quote className="size-7 text-gold-500/50" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-bone-300">&ldquo;{t.review}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3 border-t border-ink-700 pt-5">
                <PlaceholderImage tone={TONES[i % TONES.length]} icon="UserRound" ratio="square" className="size-11 shrink-0 rounded-full" size={18} />
                <div>
                  <p className="text-sm font-medium text-bone-100">{t.name}</p>
                  <p className="text-xs text-bone-500">{t.program}</p>
                </div>
                <StarRating rating={t.rating} className="ml-auto" size={12} />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Badge tone="neutral">Demo testimonials — for illustrative purposes only</Badge>
      </div>
    </Section>
  );
}
