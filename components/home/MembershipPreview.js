import { listPlans, listBillingCycles } from "@/lib/db/memberships";
import { Section, SectionHeading } from "@/components/ui/Section";
import PricingCard from "@/components/membership/PricingCard";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

export default async function MembershipPreview() {
  const [plans, cycles] = await Promise.all([listPlans(), listBillingCycles()]);
  const monthly = cycles.find((c) => c.id === "monthly") || cycles[0];

  return (
    <Section className="bg-ink-900/40">
      <SectionHeading
        eyebrow="Membership"
        title="Invest In Yourself"
        description="Simple, transparent pricing with no hidden fees. Choose the plan that matches your goals."
        align="center"
        className="mx-auto"
      />
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-center">
        {plans.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 80} className={plan.highlighted ? "lg:scale-105" : ""}>
            <PricingCard plan={plan} cycle={monthly} compact />
          </Reveal>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Button href="/membership" variant="secondary" icon={ArrowRight} iconPosition="right">
          Compare All Plans & Billing Options
        </Button>
      </div>
    </Section>
  );
}
