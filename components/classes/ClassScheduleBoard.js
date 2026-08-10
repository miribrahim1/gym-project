"use client";

import { useMemo, useState, useTransition } from "react";
import * as Icons from "lucide-react";
import { Users, Clock, Gauge, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { classBookingSchema } from "@/lib/validation/schemas";
import { confirmClassBooking } from "@/lib/actions/classes";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Label, Input, FieldError, FieldGroup } from "@/components/ui/FormField";
import EmptyState from "@/components/ui/EmptyState";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ClassScheduleBoard({ sessions, classDefinitions, trainers }) {
  const [filters, setFilters] = useState({ day: "all", classSlug: "all", trainerSlug: "all", difficulty: "all" });
  const [activeSession, setActiveSession] = useState(null);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      if (filters.day !== "all" && s.day !== filters.day) return false;
      if (filters.classSlug !== "all" && s.classSlug !== filters.classSlug) return false;
      if (filters.trainerSlug !== "all" && s.trainerSlug !== filters.trainerSlug) return false;
      if (filters.difficulty !== "all" && s.difficulty !== filters.difficulty) return false;
      return true;
    });
  }, [sessions, filters]);

  const grouped = DAYS.map((day) => ({ day, items: filtered.filter((s) => s.day === day) })).filter((g) => g.items.length);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <FilterSelect label="Day" value={filters.day} onChange={(v) => setFilters((f) => ({ ...f, day: v }))} options={[{ value: "all", label: "All Days" }, ...DAYS.map((d) => ({ value: d, label: d }))]} />
        <FilterSelect label="Class" value={filters.classSlug} onChange={(v) => setFilters((f) => ({ ...f, classSlug: v }))} options={[{ value: "all", label: "All Classes" }, ...classDefinitions.map((c) => ({ value: c.slug, label: c.name }))]} />
        <FilterSelect label="Trainer" value={filters.trainerSlug} onChange={(v) => setFilters((f) => ({ ...f, trainerSlug: v }))} options={[{ value: "all", label: "All Trainers" }, ...trainers.map((t) => ({ value: t.slug, label: t.name }))]} />
        <FilterSelect label="Difficulty" value={filters.difficulty} onChange={(v) => setFilters((f) => ({ ...f, difficulty: v }))} options={[{ value: "all", label: "All Levels" }, { value: "Beginner", label: "Beginner" }, { value: "Intermediate", label: "Intermediate" }, { value: "Advanced", label: "Advanced" }]} />
      </div>

      <div className="mt-10 space-y-10">
        {grouped.length === 0 ? (
          <EmptyState icon="CalendarX2" title="No classes match your filters" description="Try adjusting or clearing your filters to see more sessions." />
        ) : (
          grouped.map((group) => (
            <div key={group.day}>
              <h3 className="font-display text-2xl tracking-wide text-gold-400">{group.day}</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((session) => (
                  <ClassSessionCard key={session.id} session={session} onBook={() => setActiveSession(session)} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <BookingModal session={activeSession} onClose={() => setActiveSession(null)} />
    </div>
  );
}

function ClassSessionCard({ session, onBook }) {
  const Icon = Icons[session.icon] || Icons.Dumbbell;
  return (
    <div className="flex flex-col rounded-2xl border border-ink-700 bg-ink-900/60 p-5 transition-colors hover:border-gold-500/40">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
            <Icon className="size-5" strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-display text-xl tracking-wide text-bone-50">{session.className}</p>
            <p className="text-xs text-bone-500">{session.time} · {session.duration} min</p>
          </div>
        </div>
        {session.isFull ? <Badge tone="danger">Full</Badge> : session.spotsLeft <= 5 ? <Badge tone="warning">Almost Full</Badge> : <Badge tone="success">Open</Badge>}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-bone-500">
        <span className="flex items-center gap-1"><Gauge className="size-3.5 text-gold-400" /> {session.difficulty}</span>
        <span className="flex items-center gap-1"><Clock className="size-3.5 text-gold-400" /> Coach {session.trainerName.split(" ")[0]}</span>
        <span className="flex items-center gap-1"><Users className="size-3.5 text-gold-400" /> {session.spotsLeft}/{session.capacity} spots</span>
      </div>
      <Button size="sm" variant={session.isFull ? "dark" : "secondary"} disabled={session.isFull} onClick={onBook} className="mt-5 w-full">
        {session.isFull ? "Class Full" : "Book Class"}
      </Button>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-ink-600 bg-ink-900/60 px-3 py-2 text-xs">
      <span className="text-bone-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent font-medium text-bone-100 focus:outline-none">
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-900">{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function BookingModal({ session, onClose }) {
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleClose() {
    setSuccess(null);
    setErrors({});
    setServerError("");
    setForm({ name: "", email: "", phone: "" });
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { sessionId: session.id, ...form };
    const result = classBookingSchema.safeParse(payload);
    if (!result.success) {
      const next = {};
      for (const issue of result.error.issues) next[issue.path[0]] = issue.message;
      setErrors(next);
      return;
    }
    setServerError("");
    startTransition(async () => {
      const res = await confirmClassBooking(payload);
      if (!res.success) {
        setServerError(res.error || "Something went wrong.");
        if (res.errors) setErrors(res.errors);
        return;
      }
      setSuccess(res.booking);
    });
  }

  return (
    <Modal open={!!session} onClose={handleClose} title={session ? `Book ${session.className}` : ""} size="sm">
      {session ? (
        success ? (
          <div className="text-center">
            <Check className="mx-auto size-10 text-emerald-400" />
            <h3 className="font-display mt-4 text-2xl tracking-wide text-bone-50">Booking Confirmed!</h3>
            <p className="mt-2 text-sm text-bone-400">
              You&rsquo;re booked for {session.className} on {session.day} at {session.time}.
            </p>
            <Button onClick={handleClose} className="mt-6 w-full">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-sm text-bone-400">{session.day} · {session.time} · Coach {session.trainerName}</p>
            {serverError ? <p className="mt-3 text-sm text-ember-500">{serverError}</p> : null}
            <div className="mt-5">
              <FieldGroup>
                <Label htmlFor="cb-name">Full Name</Label>
                <Input id="cb-name" value={form.name} error={errors.name} onChange={(e) => update("name", e.target.value)} />
                <FieldError>{errors.name}</FieldError>
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="cb-email">Email</Label>
                <Input id="cb-email" type="email" value={form.email} error={errors.email} onChange={(e) => update("email", e.target.value)} />
                <FieldError>{errors.email}</FieldError>
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="cb-phone">Phone</Label>
                <Input id="cb-phone" value={form.phone} error={errors.phone} onChange={(e) => update("phone", e.target.value)} />
                <FieldError>{errors.phone}</FieldError>
              </FieldGroup>
            </div>
            <Button type="submit" disabled={pending} icon={pending ? Loader2 : undefined} className={cn("w-full", pending && "[&_svg]:animate-spin")}>
              {pending ? "Booking…" : "Confirm Booking"}
            </Button>
          </form>
        )
      ) : null}
    </Modal>
  );
}
