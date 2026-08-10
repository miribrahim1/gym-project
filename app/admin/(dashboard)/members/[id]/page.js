import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Target, Dumbbell, Calendar } from "lucide-react";
import { getMemberById } from "@/lib/db/members";
import Badge from "@/components/ui/Badge";
import MemberStatusActions from "@/components/admin/MemberStatusActions";
import { formatDate, formatCurrency, formatDateTime } from "@/lib/utils/format";

export const metadata = { title: "Member Profile" };

const STATUS_TONE = { active: "success", inactive: "neutral", expired: "danger" };

export default async function AdminMemberDetailPage({ params }) {
  const { id } = await params;
  const member = await getMemberById(id);
  if (!member) notFound();

  return (
    <div>
      <Link href="/admin/members" className="mb-6 inline-flex items-center gap-1.5 text-xs text-bone-500 hover:text-gold-400">
        <ArrowLeft className="size-3.5" /> Back to Members
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
            <h1 className="font-display text-2xl tracking-wide text-bone-50">{member.name}</h1>
            <Badge tone={STATUS_TONE[member.status] || "neutral"} className="mt-2">{member.status}</Badge>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-bone-300"><Mail className="size-4 text-gold-400" /> {member.email}</li>
              <li className="flex items-center gap-2.5 text-bone-300"><Phone className="size-4 text-gold-400" /> {member.phone}</li>
              <li className="flex items-center gap-2.5 text-bone-300"><Target className="size-4 text-gold-400" /> {member.fitnessGoal || "—"}</li>
              <li className="flex items-center gap-2.5 text-bone-300"><Dumbbell className="size-4 text-gold-400" /> {member.trainerSlug || "No trainer assigned"}</li>
              <li className="flex items-center gap-2.5 text-bone-300"><Calendar className="size-4 text-gold-400" /> {formatDate(member.startDate)} – {formatDate(member.expiryDate)}</li>
            </ul>
            <div className="mt-6 border-t border-ink-700 pt-5">
              <MemberStatusActions member={member} />
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
            <h2 className="font-display text-xl tracking-wide text-bone-50">Class Bookings</h2>
            {member.bookings?.length ? (
              <ul className="mt-4 divide-y divide-ink-700">
                {member.bookings.map((b) => (
                  <li key={b.id} className="flex items-center justify-between py-3 text-sm">
                    <span className="text-bone-200">{b.className} — {b.day} {b.time}</span>
                    <Badge tone={b.status === "cancelled" ? "danger" : "success"}>{b.status}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-bone-500">No class bookings yet.</p>
            )}
          </div>

          <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
            <h2 className="font-display text-xl tracking-wide text-bone-50">Supplement Orders</h2>
            {member.orders?.length ? (
              <ul className="mt-4 divide-y divide-ink-700">
                {member.orders.map((o) => (
                  <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                    <span className="text-bone-200">{o.id} — {formatDateTime(o.createdAt)}</span>
                    <span className="text-bone-400">{formatCurrency(o.total)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-bone-500">No supplement orders yet.</p>
            )}
          </div>

          <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
            <h2 className="font-display text-xl tracking-wide text-bone-50">Notes</h2>
            <p className="mt-3 text-sm text-bone-500">{member.notes || "No notes on file for this member."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
