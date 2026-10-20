import { hasConfirmationAccess } from "@/lib/security/confirmation";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getMembershipById } from "@/lib/db/memberships";
import { getSettings } from "@/lib/db/settings";
import { Section } from "@/components/ui/Section";
import { formatDate } from "@/lib/utils/format";
import ConfirmationActions from "@/components/membership/ConfirmationActions";
import Button from "@/components/ui/Button";

export const metadata = { title: "Welcome to IronVault", robots: { index: false } };

export default async function MembershipConfirmationPage({ params }) {
  const { id } = await params;
  if (!(await hasConfirmationAccess("membership", id))) notFound();
  const [membership, settings] = await Promise.all([getMembershipById(id), getSettings()]);
  if (!membership) notFound();

  return (
    <Section className="flex justify-center pt-16">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="size-9" strokeWidth={1.5} />
        </div>
        <h1 className="font-display mt-6 text-5xl tracking-wide text-bone-50 sm:text-6xl">Welcome to {settings.logoText}.</h1>
        <p className="mt-3 text-bone-400">Your membership request has been received. Our team will confirm payment and activate your membership.</p>

        <div className="mt-10 rounded-2xl border border-ink-700 bg-ink-900/60 p-8 text-left">
          <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
            <Detail label="Status" value={membership.status} />
            <Detail label="Membership ID" value={membership.id} />
            <Detail label="Plan" value={membership.planName} />
            <Detail label="Start Date" value={formatDate(membership.startDate)} />
            <Detail label="Expiry Date" value={formatDate(membership.expiryDate)} />
            <Detail label="Billing Cycle" value={membership.billingLabel} />
            <Detail label="Fitness Goal" value={membership.fitnessGoal} />
          </dl>
        </div>

        <div className="mt-8 flex justify-center">
          <ConfirmationActions membership={membership} gymName={settings.gymName} gymPhone={settings.phone} />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button href="/">Back to Home</Button>
          <Button href="/classes" variant="secondary">Book Your First Class</Button>
        </div>
      </div>
    </Section>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-bone-500">{label}</dt>
      <dd className="mt-1 text-base font-medium text-bone-100">{value}</dd>
    </div>
  );
}
