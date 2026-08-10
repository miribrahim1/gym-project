"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { updateOrderStatusAction } from "@/lib/actions/adminCrud";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "completed", "cancelled"];
const STATUS_TONE = { pending: "warning", confirmed: "info", processing: "info", shipped: "gold", completed: "success", cancelled: "danger" };

export default function OrdersManager({ orders }) {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [pending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState(null);

  const filtered = useMemo(() => (status === "all" ? orders : orders.filter((o) => o.status === status)), [orders, status]);

  function changeStatus(id, newStatus) {
    setUpdatingId(id);
    startTransition(async () => {
      await updateOrderStatusAction(id, newStatus);
      setUpdatingId(null);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl tracking-wide text-bone-50">Orders</h1>
        <p className="mt-1 text-sm text-bone-500">Manage supplement store orders.</p>
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
        <EmptyState icon="PackageSearch" title="No orders found" description="Orders placed from the supplement store will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink-700">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-900/60 text-left text-xs uppercase tracking-wider text-bone-500">
                <th className="px-5 py-3.5 font-medium">Order</th>
                <th className="px-5 py-3.5 font-medium">Customer</th>
                <th className="px-5 py-3.5 font-medium">Items</th>
                <th className="px-5 py-3.5 font-medium">Total</th>
                <th className="px-5 py-3.5 font-medium">Placed</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-700 bg-ink-900/30">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-ink-800/40">
                  <td className="px-5 py-3.5 font-medium text-bone-100">{order.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-bone-200">{order.customer.name}</p>
                    <p className="text-xs text-bone-500">{order.customer.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-bone-400">{order.items.reduce((s, i) => s + i.qty, 0)} items</td>
                  <td className="px-5 py-3.5 text-bone-200">{formatCurrency(order.total)}</td>
                  <td className="px-5 py-3.5 text-xs text-bone-500">{formatDateTime(order.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Badge tone={STATUS_TONE[order.status] || "neutral"}>{order.status}</Badge>
                      {updatingId === order.id && pending ? <Loader2 className="size-3.5 animate-spin text-bone-500" /> : null}
                    </div>
                    <select
                      value={order.status}
                      disabled={pending && updatingId === order.id}
                      onChange={(e) => changeStatus(order.id, e.target.value)}
                      className="mt-2 rounded-lg border border-ink-600 bg-ink-900 px-2 py-1 text-xs text-bone-200 focus:outline-none"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
