"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { eventRegistrationSchema } from "@/lib/validation/schemas";
import { submitEventRegistration } from "@/lib/actions/events";
import { Label, Input, Select, FieldError, FieldGroup } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";

export default function EventRegisterForm({ event }) {
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", guests: "0" });

  const spotsLeft = event.seatsTotal - event.seatsBooked;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { eventSlug: event.slug, ...form };
    const result = eventRegistrationSchema.safeParse(payload);
    if (!result.success) {
      const next = {};
      for (const issue of result.error.issues) next[issue.path[0]] = issue.message;
      setErrors(next);
      return;
    }
    setServerError("");
    startTransition(async () => {
      const res = await submitEventRegistration(payload);
      if (!res.success) {
        setServerError(res.error || "Something went wrong.");
        if (res.errors) setErrors(res.errors);
        return;
      }
      setSuccess(res.registration);
    });
  }

  if (spotsLeft <= 0 && !success) {
    return (
      <div className="rounded-2xl border border-ember-500/30 bg-ember-500/5 p-6 text-center">
        <p className="font-display text-xl tracking-wide text-bone-50">This event is fully booked</p>
        <p className="mt-2 text-sm text-bone-400">Check back later or explore our other upcoming events.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
        <Check className="mx-auto size-9 text-emerald-400" />
        <p className="font-display mt-3 text-xl tracking-wide text-bone-50">You&rsquo;re Registered!</p>
        <p className="mt-2 text-sm text-bone-400">Confirmation ID: {success.id}. We&rsquo;ll see you there!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
      <h3 className="font-display text-xl tracking-wide text-bone-50">Register Now</h3>
      {serverError ? <p className="mt-2 text-sm text-ember-500">{serverError}</p> : null}
      <div className="mt-5">
        <FieldGroup>
          <Label htmlFor="ev-name">Full Name</Label>
          <Input id="ev-name" value={form.name} error={errors.name} onChange={(e) => update("name", e.target.value)} />
          <FieldError>{errors.name}</FieldError>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="ev-email">Email</Label>
          <Input id="ev-email" type="email" value={form.email} error={errors.email} onChange={(e) => update("email", e.target.value)} />
          <FieldError>{errors.email}</FieldError>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="ev-phone">Phone</Label>
          <Input id="ev-phone" value={form.phone} error={errors.phone} onChange={(e) => update("phone", e.target.value)} />
          <FieldError>{errors.phone}</FieldError>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="ev-guests">Additional Guests</Label>
          <Select id="ev-guests" value={form.guests} onChange={(e) => update("guests", e.target.value)}>
            {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
          </Select>
        </FieldGroup>
      </div>
      <Button type="submit" disabled={pending} icon={pending ? Loader2 : undefined} className={"w-full" + (pending ? " [&_svg]:animate-spin" : "")}>
        {pending ? "Registering…" : "Confirm Registration"}
      </Button>
      <p className="mt-3 text-center text-xs text-bone-500">{spotsLeft} seats remaining</p>
    </form>
  );
}
