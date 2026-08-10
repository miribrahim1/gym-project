import { CheckCircle2 } from "lucide-react";
import { listPlans, listBillingCycles } from "@/lib/db/memberships";
import { getSettings } from "@/lib/db/settings";
import { Section, SectionHeading } from "@/components/ui/Section";
import PricingSection from "@/components/membership/PricingSection";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Membership Plans",
  description: "Compare IronVault Fitness membership plans — Basic, Pro and Elite — with monthly, quarterly and yearly billing options.",
  alternates: { canonical: "/membership" },
};

const COMPARISON_ROWS = [
  { label: "Gym floor access" },
  { label: "Group classes" },
  { label: "Personal training" },
  { label: "Nutrition consultation" },
  { label: "Locker" },
  { label: "Sauna & recovery" },
  { label: "Progress tracking" },
];

export default async function MembershipPage() {
  const [plans, cycles, settings] = await Promise.all([listPlans(), listBillingCycles(), getSettings()]);

  return (
    <>
      <div className="border-b border-ink-700 bg-gradient-to-b from-ink-900 to-ink-950 py-20 text-center">
        <div className="container-app">
          <SectionHeading eyebrow="Membership" title="Invest In Yourself" description="Transparent pricing, no hidden fees, no long-term lock-in required." align="center" className="mx-auto" />
        </div>
      </div>

      <Section>
        <PricingSection plans={plans} cycles={cycles} />
      </Section>

      <Section className="bg-ink-900/40">
        <SectionHeading eyebrow="Compare" title="Full Feature Comparison" align="center" className="mx-auto" />
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-left text-xs uppercase tracking-wider text-bone-500">
                <th className="py-4 pr-4 font-medium">Feature</th>
                {plans.map((p) => (
                  <th key={p.id} className="px-4 py-4 text-center font-medium text-gold-400">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={row.label} className="border-b border-ink-700/70">
                  <td className="py-4 pr-4 text-bone-300">{row.label}</td>
                  {plans.map((p) => (
                    <td key={p.id} className="px-4 py-4 text-center">
                      {p.features[i]?.included ? (
                        <CheckCircle2 className="mx-auto size-4 text-gold-400" />
                      ) : (
                        <span className="text-bone-600">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-8">
            <h3 className="font-display text-2xl tracking-wide text-bone-50">Membership Rules</h3>
            <p className="mt-3 text-sm leading-relaxed text-bone-400">{settings.membershipRules}</p>
          </div>
          <div className="flex flex-col items-start justify-center rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-500/[0.07] to-ink-900 p-8">
            <h3 className="font-display text-2xl tracking-wide text-bone-50">Not sure which plan is right?</h3>
            <p className="mt-3 text-sm text-bone-400">Talk to our team and we&rsquo;ll help you choose the plan that fits your goals and schedule.</p>
            <Button href="/contact" variant="secondary" className="mt-6">Contact Our Team</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
