"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate, formatDateTime } from "@/lib/utils/format";
import { updateBookingStatusAction, updatePTBookingStatusAction } from "@/lib/actions/adminCrud";

const STATUS_TONE = { confirmed: "success", completed: "info", cancelled: "danger", pending: "warning" };
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BookingsManager({ classBookings, ptBookings }) {
  const router = useRouter();
  const [tab, setTab] = useState("class");
  const [status, setStatus] = useState("all");
  const [day, setDay] = useState("all");
  const [pending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState(null);

  const filteredClassBookings = useMemo(() => {
    return classBookings.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (day !== "all" && b.day !== day) return false;
      return true;
    });
  }, [classBookings, status, day]);

  const filteredPT = useMemo(() => {
    return ptBookings.filter((b) => (status === "all" ? true : b.status === status));
  }, [ptBookings, status]);

  function updateStatus(id, newStatus, type) {
    setUpdatingId(id);
    startTransition(async () => {
      if (type === "class") await updateBookingStatusAction(id, newStatus);
      else await updatePTBookingStatusAction(id, newStatus);
      setUpdatingId(null);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl tracking-wide text-bone-50">Bookings</h1>
        <p className="mt-1 text-sm text-bone-500">Manage class and personal training bookings.</p>
      </div>

      <div role="tablist" className="flex gap-2 border-b border-ink-700 pb-px mb-6">
        {[{ value: "class", label: `Class Bookings (${classBookings.length})` }, { value: "pt", label: `Personal Training (${ptBookings.length})` }].map((t) => (
          <button key={t.value} role="tab" type="button" onClick={() => setTab(t.value)} className={cn("-mb-px rounded-t-lg px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2", tab === t.value ? "text-gold-400 border-gold-500" : "text-bone-500 border-transparent hover:text-bone-200")}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <FilterSelect label="Status" value={status} onChange={setStatus} options={["all", "confirmed", "completed", "cancelled"]} />
        {tab === "class" ? <FilterSelect label="Day" value={day} onChange={setDay} options={["all", ...DAYS]} /> : null}
      </div>

      {tab === "class" ? (
        filteredClassBookings.length === 0 ? (
          <EmptyState icon="ClipboardX" title="No class bookings found" description="Try adjusting your filters." />
        ) : (
          <BookingTable
            rows={filteredClassBookings.map((b) => ({
              id: b.id,
              primary: b.className,
              secondary: `${b.day} · ${b.time}`,
              name: b.name,
              email: b.email,
              status: b.status,
              createdAt: b.createdAt,
            }))}
            onUpdate={(id, s) => updateStatus(id, s, "class")}
            pending={pending}
            updatingId={updatingId}
          />
        )
      ) : filteredPT.length === 0 ? (
        <EmptyState icon="ClipboardX" title="No personal training bookings found" description="Try adjusting your filters." />
      ) : (
        <BookingTable
          rows={filteredPT.map((b) => ({
            id: b.id,
            primary: `Session with ${b.trainerName}`,
            secondary: `${formatDate(b.date)} · ${b.time}`,
            name: b.name,
            email: b.email,
            status: b.status,
            createdAt: b.createdAt,
          }))}
          onUpdate={(id, s) => updateStatus(id, s, "pt")}
          pending={pending}
          updatingId={updatingId}
        />
      )}
    </div>
  );
}

function BookingTable({ rows, onUpdate, pending, updatingId }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-700">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink-700 bg-ink-900/60 text-left text-xs uppercase tracking-wider text-bone-500">
            <th className="px-5 py-3.5 font-medium">Booking</th>
            <th className="px-5 py-3.5 font-medium">Member</th>
            <th className="px-5 py-3.5 font-medium">Booked On</th>
            <th className="px-5 py-3.5 font-medium">Status</th>
            <th className="px-5 py-3.5 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-700 bg-ink-900/30">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-ink-800/40">
              <td className="px-5 py-3.5">
                <p className="font-medium text-bone-100">{row.primary}</p>
                <p className="text-xs text-bone-500">{row.secondary}</p>
              </td>
              <td className="px-5 py-3.5">
                <p className="text-bone-200">{row.name}</p>
                <p className="text-xs text-bone-500">{row.email}</p>
              </td>
              <td className="px-5 py-3.5 text-xs text-bone-500">{formatDateTime(row.createdAt)}</td>
              <td className="px-5 py-3.5"><Badge tone={STATUS_TONE[row.status] || "neutral"}>{row.status}</Badge></td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1.5">
                  {row.status !== "completed" ? (
                    <ActionButton label="Complete" onClick={() => onUpdate(row.id, "completed")} busy={pending && updatingId === row.id} />
                  ) : null}
                  {row.status !== "cancelled" ? (
                    <ActionButton label="Cancel" tone="danger" onClick={() => onUpdate(row.id, "cancelled")} busy={pending && updatingId === row.id} />
                  ) : null}
                  {row.status === "cancelled" ? (
                    <ActionButton label="Restore" onClick={() => onUpdate(row.id, "confirmed")} busy={pending && updatingId === row.id} />
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActionButton({ label, onClick, tone = "default", busy }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={cn(
        "rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
        tone === "danger" ? "border-ember-500/30 text-ember-500 hover:bg-ember-500/10" : "border-ink-600 text-bone-300 hover:bg-ink-700 hover:text-gold-400"
      )}
    >
      {busy ? <Loader2 className="size-3.5 animate-spin" /> : label}
    </button>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-ink-600 bg-ink-900/60 px-3 py-2 text-xs">
      <span className="text-bone-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent font-medium text-bone-100 focus:outline-none">
        {options.map((o) => (
          <option key={o} value={o} className="bg-ink-900">{o === "all" ? "All" : o}</option>
        ))}
      </select>
    </label>
  );
}
