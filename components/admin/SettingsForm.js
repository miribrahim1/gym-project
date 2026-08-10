"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { Label, Input, Textarea, FieldGroup } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { updateSettingsAction } from "@/lib/actions/settings";

export default function SettingsForm({ settings }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    gymName: settings.gymName,
    tagline: settings.tagline,
    logoText: settings.logoText,
    phone: settings.phone,
    email: settings.email,
    whatsapp: settings.whatsapp,
    address: settings.address,
    hoursWeekday: settings.hours.weekday,
    hoursSaturday: settings.hours.saturday,
    hoursSunday: settings.hours.sunday,
    socialInstagram: settings.social.instagram,
    socialFacebook: settings.social.facebook,
    socialYoutube: settings.social.youtube,
    socialTwitter: settings.social.twitter,
    membershipRules: settings.membershipRules,
    defaultClassCapacity: settings.defaultClassCapacity,
    bookingRules: settings.bookingRules,
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      gymName: form.gymName,
      tagline: form.tagline,
      logoText: form.logoText,
      phone: form.phone,
      email: form.email,
      whatsapp: form.whatsapp,
      address: form.address,
      hours: { weekday: form.hoursWeekday, saturday: form.hoursSaturday, sunday: form.hoursSunday },
      social: { instagram: form.socialInstagram, facebook: form.socialFacebook, youtube: form.socialYoutube, twitter: form.socialTwitter },
      membershipRules: form.membershipRules,
      defaultClassCapacity: Number(form.defaultClassCapacity) || 0,
      bookingRules: form.bookingRules,
    };
    startTransition(async () => {
      await updateSettingsAction(payload);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <SettingsSection title="Brand">
        <Row><F id="gymName" label="Gym Name" value={form.gymName} onChange={(v) => update("gymName", v)} /><F id="logoText" label="Logo Text" value={form.logoText} onChange={(v) => update("logoText", v)} /></Row>
        <FieldGroup>
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} />
        </FieldGroup>
      </SettingsSection>

      <SettingsSection title="Contact Details">
        <Row><F id="phone" label="Phone" value={form.phone} onChange={(v) => update("phone", v)} /><F id="whatsapp" label="WhatsApp" value={form.whatsapp} onChange={(v) => update("whatsapp", v)} /></Row>
        <FieldGroup>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" value={form.address} onChange={(e) => update("address", e.target.value)} />
        </FieldGroup>
      </SettingsSection>

      <SettingsSection title="Opening Hours">
        <Row3>
          <F id="hoursWeekday" label="Weekdays" value={form.hoursWeekday} onChange={(v) => update("hoursWeekday", v)} />
          <F id="hoursSaturday" label="Saturday" value={form.hoursSaturday} onChange={(v) => update("hoursSaturday", v)} />
          <F id="hoursSunday" label="Sunday" value={form.hoursSunday} onChange={(v) => update("hoursSunday", v)} />
        </Row3>
      </SettingsSection>

      <SettingsSection title="Social Links">
        <Row>
          <F id="socialInstagram" label="Instagram URL" value={form.socialInstagram} onChange={(v) => update("socialInstagram", v)} />
          <F id="socialFacebook" label="Facebook URL" value={form.socialFacebook} onChange={(v) => update("socialFacebook", v)} />
        </Row>
        <Row>
          <F id="socialYoutube" label="YouTube URL" value={form.socialYoutube} onChange={(v) => update("socialYoutube", v)} />
          <F id="socialTwitter" label="Twitter / X URL" value={form.socialTwitter} onChange={(v) => update("socialTwitter", v)} />
        </Row>
      </SettingsSection>

      <SettingsSection title="Membership & Booking Rules">
        <FieldGroup>
          <Label htmlFor="membershipRules">Membership Rules</Label>
          <Textarea id="membershipRules" value={form.membershipRules} onChange={(e) => update("membershipRules", e.target.value)} />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="bookingRules">Booking Rules</Label>
          <Textarea id="bookingRules" value={form.bookingRules} onChange={(e) => update("bookingRules", e.target.value)} />
        </FieldGroup>
        <FieldGroup className="max-w-xs">
          <Label htmlFor="defaultClassCapacity">Default Class Capacity</Label>
          <Input id="defaultClassCapacity" type="number" value={form.defaultClassCapacity} onChange={(e) => update("defaultClassCapacity", e.target.value)} />
        </FieldGroup>
      </SettingsSection>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending} icon={pending ? Loader2 : saved ? Check : Save} className={pending ? "[&_svg]:animate-spin" : ""}>
          {pending ? "Saving…" : saved ? "Saved" : "Save Settings"}
        </Button>
        {saved ? <p className="text-xs text-emerald-400">Changes are now live across the public site.</p> : null}
      </div>
    </form>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
      <h2 className="font-display text-xl tracking-wide text-bone-50">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Row({ children }) {
  return <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">{children}</div>;
}
function Row3({ children }) {
  return <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-3">{children}</div>;
}

function F({ id, label, value, onChange }) {
  return (
    <FieldGroup>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
    </FieldGroup>
  );
}
