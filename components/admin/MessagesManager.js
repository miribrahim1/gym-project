"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Loader2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/utils/format";
import { updateEnquiryStatusAction } from "@/lib/actions/adminCrud";

const STATUSES = ["new", "read", "responded", "archived"];
const STATUS_TONE = { new: "warning", read: "info", responded: "success", archived: "neutral" };

export default function MessagesManager({ enquiries }) {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [pending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState(null);

  const filtered = useMemo(() => (status === "all" ? enquiries : enquiries.filter((e) => e.status === status)), [enquiries, status]);

  function changeStatus(id, newStatus) {
    setUpdatingId(id);
    startTransition(async () => {
      await updateEnquiryStatusAction(id, newStatus);
      setUpdatingId(null);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl tracking-wide text-bone-50">Messages</h1>
        <p className="mt-1 text-sm text-bone-500">Enquiries submitted through the public contact form.</p>
      </div>

      <div className="mb-5">
        <label className="flex w-fit items-center gap-2 rounded-full border border-ink-600 bg-ink-900/60 px-3 py-2 text-xs">
          <span className="text-bone-500">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-transparent font-medium text-bone-100 focus:outline-none">
            <option value="all" className="bg-ink-900">All</option>
            {STATUSES.map((s) => <option key={s} value={s} className="bg-ink-900">{s}</option>)}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="MessageSquare" title="No messages found" description="Messages submitted via the contact form will appear here." />
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => (
            <div key={msg.id} className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl tracking-wide text-bone-50">{msg.subject}</p>
                  <p className="mt-1 text-xs text-bone-500">{formatDateTime(msg.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={STATUS_TONE[msg.status] || "neutral"}>{msg.status}</Badge>
                  {updatingId === msg.id && pending ? <Loader2 className="size-3.5 animate-spin text-bone-500" /> : null}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-bone-300">{msg.message}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-ink-700 pt-4 text-xs text-bone-500">
                <span>{msg.name}</span>
                <span className="flex items-center gap-1"><Mail className="size-3.5" /> {msg.email}</span>
                <span className="flex items-center gap-1"><Phone className="size-3.5" /> {msg.phone}</span>
                <select
                  value={msg.status}
                  disabled={pending && updatingId === msg.id}
                  onChange={(e) => changeStatus(msg.id, e.target.value)}
                  className="ml-auto rounded-lg border border-ink-600 bg-ink-900 px-2 py-1 text-xs text-bone-200 focus:outline-none"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
