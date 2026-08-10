"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2, CalendarX2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ptBookingSchema } from "@/lib/validation/schemas";
import { fetchAvailability, confirmPersonalTrainingBooking } from "@/lib/actions/personalTraining";
import { Label, Input, Select, Textarea, FieldError, FieldGroup } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatDate } from "@/lib/utils/format";

const GOALS = ["Weight Loss", "Muscle Gain", "General Fitness", "Strength", "Athletic Performance", "Body Transformation", "Injury Recovery"];
const STEPS = ["Trainer", "Date & Time", "Your Details", "Confirm"];

function nextDates(count = 7) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default function PersonalTrainingBooking({ trainers, initialTrainer }) {
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [confirmed, setConfirmed] = useState(null);
  const [slots, setSlots] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const dates = useMemo(() => nextDates(), []);

  const [form, setForm] = useState({
    trainerSlug: initialTrainer || trainers[0]?.slug || "",
    date: dates[0],
    time: "",
    name: "",
    email: "",
    phone: "",
    goal: "",
    notes: "",
  });

  const trainer = trainers.find((t) => t.slug === form.trainerSlug) || trainers[0];

  useEffect(() => {
    if (step !== 1 || !form.trainerSlug || !form.date) return;
    let cancelled = false;
    async function loadAvailability() {
      setLoadingSlots(true);
      setSlots(null);
      const result = await fetchAvailability(form.trainerSlug, form.date);
      if (!cancelled) {
        setSlots(result);
        setLoadingSlots(false);
      }
    }
    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [step, form.trainerSlug, form.date]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value, ...(field === "trainerSlug" || field === "date" ? { time: "" } : {}) }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validateStep(target) {
    if (target === 0) return !!form.trainerSlug;
    if (target === 1) {
      if (!form.time) {
        setErrors({ time: "Choose an available time slot" });
        return false;
      }
      return true;
    }
    if (target === 2) {
      const result = ptBookingSchema.safeParse(form);
      if (!result.success) {
        const next = {};
        for (const issue of result.error.issues) {
          if (["name", "email", "phone", "goal"].includes(issue.path[0])) next[issue.path[0]] = issue.message;
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
      const result = await confirmPersonalTrainingBooking(form);
      if (!result.success) {
        setServerError(result.error || "Something went wrong, please try a different time.");
        if (result.errors) setErrors(result.errors);
        return;
      }
      setConfirmed(result.booking);
    });
  }

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <Check className="mx-auto size-10 text-emerald-400" />
        <h3 className="font-display mt-4 text-3xl tracking-wide text-bone-50">Session Booked!</h3>
        <p className="mt-2 text-sm text-bone-400">
          Your personal training session with {trainer.name} is confirmed for {formatDate(confirmed.date)} at {confirmed.time}.
        </p>
        <p className="mt-4 text-xs uppercase tracking-wider text-bone-500">Booking ID: {confirmed.id}</p>
      </div>
    );
  }

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
              <span className={cn("hidden text-xs font-medium uppercase tracking-wider sm:block", i === step ? "text-bone-100" : "text-bone-600")}>{label}</span>
              {i < STEPS.length - 1 ? <span className="h-px flex-1 bg-ink-700" /> : null}
            </li>
          ))}
        </ol>

        {step === 0 ? (
          <div>
            <h2 className="font-display text-2xl tracking-wide text-bone-50">Choose Your Trainer</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {trainers.map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => update("trainerSlug", t.slug)}
                  className={cn(
                    "overflow-hidden rounded-xl border text-left transition-colors",
                    form.trainerSlug === t.slug ? "border-gold-500 bg-gold-500/10" : "border-ink-600 bg-ink-900/60 hover:border-ink-500"
                  )}
                >
                  <PlaceholderImage src={t.image} tone={t.photoTone} icon="UserRound" ratio="square" size={28} />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-bone-100">{t.name}</p>
                    <p className="mt-0.5 text-xs text-bone-500">{t.specialization}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <h2 className="font-display text-2xl tracking-wide text-bone-50">Choose Date & Time</h2>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
              {dates.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => update("date", d)}
                  className={cn(
                    "flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 transition-colors",
                    form.date === d ? "border-gold-500 bg-gold-500/10" : "border-ink-600 bg-ink-900/60 hover:border-ink-500"
                  )}
                >
                  <span className="text-[10px] uppercase tracking-wider text-bone-500">
                    {new Date(d).toLocaleDateString("en-IN", { weekday: "short" })}
                  </span>
                  <span className="mt-1 text-sm font-semibold text-bone-100">
                    {new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6">
              {loadingSlots ? (
                <div className="flex items-center gap-2 text-sm text-bone-500">
                  <Loader2 className="size-4 animate-spin" /> Checking availability…
                </div>
              ) : slots && slots.length ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!s.available}
                      onClick={() => update("time", s.time)}
                      className={cn(
                        "rounded-lg border py-2.5 text-sm font-medium transition-colors",
                        !s.available && "cursor-not-allowed border-ink-700 text-bone-600 line-through",
                        s.available && form.time === s.time && "border-gold-500 bg-gold-500/10 text-gold-300",
                        s.available && form.time !== s.time && "border-ink-600 text-bone-200 hover:border-ink-500"
                      )}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-ink-600 px-4 py-3 text-sm text-bone-500">
                  <CalendarX2 className="size-4" /> {trainer?.name} isn&rsquo;t available this day — try another date.
                </div>
              )}
              <FieldError>{errors.time}</FieldError>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h2 className="font-display text-2xl tracking-wide text-bone-50">Your Details</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              <FieldGroup>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} error={errors.name} onChange={(e) => update("name", e.target.value)} />
                <FieldError>{errors.name}</FieldError>
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} error={errors.phone} onChange={(e) => update("phone", e.target.value)} />
                <FieldError>{errors.phone}</FieldError>
              </FieldGroup>
              <FieldGroup className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} error={errors.email} onChange={(e) => update("email", e.target.value)} />
                <FieldError>{errors.email}</FieldError>
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="goal">Fitness Goal</Label>
                <Select id="goal" value={form.goal} error={errors.goal} onChange={(e) => update("goal", e.target.value)}>
                  <option value="">Select a goal</option>
                  {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
                </Select>
                <FieldError>{errors.goal}</FieldError>
              </FieldGroup>
              <FieldGroup className="sm:col-span-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Anything your trainer should know before your first session?" />
              </FieldGroup>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <h2 className="font-display text-2xl tracking-wide text-bone-50">Confirm Your Session</h2>
            {serverError ? <p className="mt-3 text-sm text-ember-500">{serverError}</p> : null}
            <dl className="mt-6 divide-y divide-ink-700 rounded-xl border border-ink-700 bg-ink-900/60">
              <Row label="Trainer" value={trainer?.name} />
              <Row label="Date" value={formatDate(form.date)} />
              <Row label="Time" value={form.time} />
              <Row label="Name" value={form.name} />
              <Row label="Goal" value={form.goal} />
            </dl>
          </div>
        ) : null}

        <div className="mt-10 flex items-center justify-between">
          <Button type="button" variant="ghost" icon={ChevronLeft} onClick={goBack} className={step === 0 ? "invisible" : ""}>Back</Button>
          {step < 3 ? (
            <Button type="button" icon={ChevronRight} iconPosition="right" onClick={goNext}>Continue</Button>
          ) : (
            <Button type="button" onClick={handleConfirm} disabled={pending} icon={pending ? Loader2 : Check} className={pending ? "[&_svg]:animate-spin" : ""}>
              {pending ? "Booking…" : "Confirm Booking"}
            </Button>
          )}
        </div>
      </div>

      <aside className="lg:col-span-4">
        {trainer ? (
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60">
            <PlaceholderImage src={trainer.image} tone={trainer.photoTone} icon="UserRound" ratio="video" label={trainer.name} size={40} />
            <div className="p-6">
              <p className="text-xs uppercase tracking-wider text-gold-400">{trainer.specialization}</p>
              <h3 className="font-display mt-1 text-2xl tracking-wide text-bone-50">{trainer.name}</h3>
              <p className="mt-2 text-sm text-bone-400">{trainer.bio}</p>
            </div>
          </div>
        ) : null}
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
