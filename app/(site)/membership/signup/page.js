import { listPlans, listBillingCycles } from "@/lib/db/memberships";
import { Section, SectionHeading } from "@/components/ui/Section";
import MembershipWizard from "@/components/membership/MembershipWizard";

export const metadata = {
  title: "Join IronVault",
  description: "Sign up for your IronVault Fitness membership in a few simple steps — no payment required for this demo.",
  alternates: { canonical: "/membership/signup" },
};

export default async function MembershipSignupPage({ searchParams }) {
  const params = await searchParams;
  const [plans, cycles] = await Promise.all([listPlans(), listBillingCycles()]);

  return (
    <Section className="pt-14">
      <SectionHeading eyebrow="Join IronVault" title="Start Your Membership" description="No payment required for this demo — complete the steps below to preview our full signup experience." />
      <div className="mt-12">
        <MembershipWizard plans={plans} cycles={cycles} initialPlan={params?.plan} initialCycle={params?.cycle} />
      </div>
    </Section>
  );
}
