"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { contactFormSchema } from "@/lib/validation/schemas";
import { submitContactForm } from "@/lib/actions/contact";
import { Label, Input, Textarea, FieldError, FieldGroup } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = contactFormSchema.safeParse(form);
    if (!result.success) {
      const next = {};
      for (const issue of result.error.issues) next[issue.path[0]] = issue.message;
      setErrors(next);
      return;
    }
    setServerError("");
    startTransition(async () => {
      const res = await submitContactForm(form);
      if (!res.success) {
        setServerError("Something went wrong. Please try again.");
        if (res.errors) setErrors(res.errors);
        return;
      }
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    });
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <Check className="mx-auto size-10 text-emerald-400" />
        <h3 className="font-display mt-4 text-2xl tracking-wide text-bone-50">Message Sent</h3>
        <p className="mt-2 text-sm text-bone-400">Thanks for reaching out — our team will get back to you shortly.</p>
        <Button variant="secondary" className="mt-6" onClick={() => setSuccess(false)}>Send Another Message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError ? <p className="mb-4 text-sm text-ember-500">{serverError}</p> : null}
      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" value={form.name} error={errors.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
          <FieldError>{errors.name}</FieldError>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="c-phone">Phone</Label>
          <Input id="c-phone" value={form.phone} error={errors.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
          <FieldError>{errors.phone}</FieldError>
        </FieldGroup>
        <FieldGroup className="sm:col-span-2">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" value={form.email} error={errors.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
          <FieldError>{errors.email}</FieldError>
        </FieldGroup>
        <FieldGroup className="sm:col-span-2">
          <Label htmlFor="c-subject">Subject</Label>
          <Input id="c-subject" value={form.subject} error={errors.subject} onChange={(e) => update("subject", e.target.value)} placeholder="How can we help?" />
          <FieldError>{errors.subject}</FieldError>
        </FieldGroup>
        <FieldGroup className="sm:col-span-2">
          <Label htmlFor="c-message">Message</Label>
          <Textarea id="c-message" value={form.message} error={errors.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us more…" />
          <FieldError>{errors.message}</FieldError>
        </FieldGroup>
      </div>
      <Button type="submit" disabled={pending} icon={pending ? Loader2 : Send} className={pending ? "[&_svg]:animate-spin" : ""}>
        {pending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
