"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { todayInIndia } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import { calculatePlanPrice } from "@/lib/utils/pricing";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { membershipSignupSchema } from "@/lib/validation/schemas";
import { submitMembershipSignup } from "@/lib/actions/membership";
import { Label, Input, Select, FieldError, FieldGroup } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";

const GOALS = ["Weight Loss", "Muscle Gain", "General Fitness", "Strength", "Athletic Performance", "Body Transformation"];
const STEPS = ["Plan & Duration", "Your Details", "Review & Confirm"];

function todayISO() {
  return todayInIndia();
}

export default function MembershipWizard({ plans, cycles, initialPlan, initialCycle }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    planSlug: initialPlan || plans[1]?.slug || plans[0]?.slug,
    billingCycleId: initialCycle || "monthly",
    startDate: todayISO(),
    fullName: "",
    email: "",
    phone: "",
    fitnessGoal: "",
  });

  const plan = plans.find((p) => p.slug === form.planSlug) || plans[0];
  const cycle = cycles.find((c) => c.id === form.billingCycleId) || cycles[0];
  const pricing = useMemo(() => calculatePlanPrice(plan?.monthlyPrice || 0, cycle), [plan, cycle]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validateStep(targetStep) {
    if (targetStep === 0) {
      const next = {};
      if (!form.planSlug) next.planSlug = "Choose a plan";
      if (!form.startDate) next.startDate = "Choose a start date";
      setErrors(next);
      return Object.keys(next).length === 0;
    }
    if (targetStep === 1) {
      const result = membershipSignupSchema.safeParse(form);
      if (!result.success) {
        const next = {};
        for (const issue of result.error.issues) {
          if (["fullName", "email", "phone", "fitnessGoal"].includes(issue.path[0])) {
            next[issue.path[0]] = issue.message;
          }
        }
        setErrors(next);
        return Object.keys(next).length === 0;
      }
    }
    return true;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleConfirm() {
    setServerError("");
    startTransition(async () => {
      const result = await submitMembershipSignup(form);
      if (!result.success) {
        setErrors(result.errors || {});
        setServerError(result.error || "Please double check the highlighted fields.");
        setStep(1);
        return;
      }
      router.push(`/membership/confirmation/${result.membership.id}`);
    });
  }

  if (!plans.length || !cycles.length) return <p className="text-bone-400">Membership signup is temporarily unavailable. Please contact the gym.</p>;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <ol className="mb-10 flex items-center gap-2 sm:gap-4">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  i < step ? "border-gold-500 bg-gold-500 text-ink-950" : i === step ? "border-gold-500 text-gold-400" : "border-ink-600 text-bone-500"
                )}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span className={cn("hidden text-xs font-medium uppercase tracking-wider sm:block", i === step ? "text-bone-100" : "text-bone-600")}>
                {label}
              </span>
              {i < STEPS.length - 1 ? <span className="h-px flex-1 bg-ink-700" /> : null}
            </li>
          ))}
        </ol>

        {step === 0 ? (
          <div>
            <h2 className="font-display text-2xl tracking-wide text-bone-50">Choose Your Plan</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => update("planSlug", p.slug)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    form.planSlug === p.slug ? "border-gold-500 bg-gold-500/10" : "border-ink-600 bg-ink-900/60 hover:border-ink-500"
                  )}
                >
                  <p className="font-display text-xl tracking-wide text-bone-50">{p.name}</p>
                  <p className="mt-1 text-sm text-bone-500">{formatCurrency(p.monthlyPrice)}/mo</p>
                </button>
              ))}
            </div>

            <h2 className="font-display mt-9 text-2xl tracking-wide text-bone-50">Billing Cycle</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {cycles.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => update("billingCycleId", c.id)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    form.billingCycleId === c.id ? "border-gold-500 bg-gold-500/10" : "border-ink-600 bg-ink-900/60 hover:border-ink-500"
                  )}
                >
                  <p className="text-sm font-semibold text-bone-100">{c.label}</p>
                  <p className="mt-1 text-xs text-bone-500">{c.discountPct > 0 ? `Save ${c.discountPct}%` : "Standard rate"}</p>
                </button>
              ))}
            </div>

            <div className="mt-9 max-w-xs">
              <FieldGroup>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" min={todayISO()} value={form.startDate} error={errors.startDate} onChange={(e) => update("startDate", e.target.value)} />
                <FieldError>{errors.startDate}</FieldError>
              </FieldGroup>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <h2 className="font-display text-2xl tracking-wide text-bone-50">Your Details</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              <FieldGroup>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={form.fullName} error={errors.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Aditya Rao" />
                <FieldError>{errors.fullName}</FieldError>
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} error={errors.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
                <FieldError>{errors.phone}</FieldError>
              </FieldGroup>
              <FieldGroup className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} error={errors.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
                <FieldError>{errors.email}</FieldError>
              </FieldGroup>
              <FieldGroup className="sm:col-span-2">
                <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                <Select id="fitnessGoal" value={form.fitnessGoal} error={errors.fitnessGoal} onChange={(e) => update("fitnessGoal", e.target.value)}>
                  <option value="">Select your primary goal</option>
                  {GOALS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </Select>
                <FieldError>{errors.fitnessGoal}</FieldError>
              </FieldGroup>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h2 className="font-display text-2xl tracking-wide text-bone-50">Review Membership</h2>
            {serverError ? <p className="mt-3 text-sm text-ember-500">{serverError}</p> : null}
            <dl className="mt-6 divide-y divide-ink-700 rounded-xl border border-ink-700 bg-ink-900/60">
              <Row label="Plan" value={plan.name} />
              <Row label="Billing Cycle" value={cycle.label} />
              <Row label="Start Date" value={formatDate(form.startDate)} />
              <Row label="Full Name" value={form.fullName} />
              <Row label="Email" value={form.email} />
              <Row label="Phone" value={form.phone} />
              <Row label="Fitness Goal" value={form.fitnessGoal} />
            </dl>
          </div>
        ) : null}

        <div className="mt-10 flex items-center justify-between">
          <Button type="button" variant="ghost" icon={ChevronLeft} onClick={goBack} className={step === 0 ? "invisible" : ""}>
            Back
          </Button>
          {step < 2 ? (
            <Button type="button" icon={ChevronRight} iconPosition="right" onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button type="button" onClick={handleConfirm} disabled={pending} icon={pending ? Loader2 : Check} className={pending ? "[&_svg]:animate-spin" : ""}>
              {pending ? "Confirming…" : "Request Membership"}
            </Button>
          )}
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-24 rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">Order Summary</p>
          <h3 className="font-display mt-2 text-3xl tracking-wide text-bone-50">{plan.name}</h3>
          <div className="mt-4 flex items-end gap-2">
            <span className="font-display text-4xl text-bone-50">{formatCurrency(pricing.effectiveMonthly)}</span>
            <span className="mb-1 text-sm text-bone-500">/month</span>
          </div>
          {pricing.months > 1 ? (
            <p className="mt-1 text-xs text-bone-500">
              Billed {formatCurrency(pricing.totalForCycle)} every {pricing.months} months
              {pricing.discountPct > 0 ? ` · Save ${formatCurrency(pricing.savings)}` : ""}
            </p>
          ) : null}
          <ul className="mt-5 space-y-2.5 border-t border-ink-700 pt-5 text-sm text-bone-400">
            {plan.features.filter((f) => f.included).slice(0, 5).map((f) => (
              <li key={f.label} className="flex items-start gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-gold-400" /> {f.label}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
      <span className="text-bone-500">{label}</span>
      <span className="font-medium text-bone-100">{value || "—"}</span>
    </div>
  );
}
