"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import CrudManager from "@/components/admin/CrudManager";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils/format";
import {
  createNutritionistAction, updateNutritionistAction, deleteNutritionistAction,
  createNutritionPlanAction, updateNutritionPlanAction, deleteNutritionPlanAction,
  updateConsultationStatusAction,
} from "@/lib/actions/adminCrud";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const GOALS = ["Fat Loss", "Muscle Gain", "Maintenance", "Performance"];
const STATUS_TONE = { confirmed: "success", completed: "info", cancelled: "danger" };

const NUTRITIONIST_FIELDS = [
  { name: "name", label: "Full Name", required: true },
  { name: "title", label: "Title", placeholder: "Sports Nutritionist" },
  { name: "availability", label: "Available Days (comma separated)", type: "tags", hint: "e.g. Mon, Wed, Fri", span: "full" },
];
const NUTRITIONIST_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  { key: "availability", label: "Availability", format: "list" },
];

const PLAN_FIELDS = [
  { name: "name", label: "Plan Name", required: true, span: "full" },
  { name: "goal", label: "Goal", type: "select", options: GOALS },
  { name: "calories", label: "Calories", type: "number" },
  { name: "protein", label: "Protein (g)", type: "number" },
  { name: "carbs", label: "Carbs (g)", type: "number" },
  { name: "fats", label: "Fats (g)", type: "number" },
  { name: "description", label: "Description", type: "textarea", span: "full" },
  { name: "sampleMealsText", label: "Sample Meals (one per line: Meal: items)", type: "textarea", span: "full", hint: "e.g. Breakfast: Oats, eggs, banana" },
];
const PLAN_COLUMNS = [
  { key: "name", label: "Plan" },
  { key: "goal", label: "Goal" },
  { key: "calories", label: "Calories" },
];

export default function NutritionManager({ nutritionists, plans, consultations }) {
  const router = useRouter();
  const [tab, setTab] = useState("nutritionists");
  const [pending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState(null);

  const planItems = plans.map((p) => ({ ...p, sampleMealsText: (p.sampleMeals || []).map((m) => `${m.meal}: ${m.items}`).join("\n") }));

  function updateConsultation(id, status) {
    setUpdatingId(id);
    startTransition(async () => {
      await updateConsultationStatusAction(id, status);
      setUpdatingId(null);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl tracking-wide text-bone-50">Nutrition</h1>
        <p className="mt-1 text-sm text-bone-500">Manage nutritionists, nutrition plans and consultation bookings.</p>
      </div>

      <div role="tablist" className="flex gap-2 border-b border-ink-700 pb-px mb-6">
        {[
          { value: "nutritionists", label: "Nutritionists" },
          { value: "plans", label: "Nutrition Plans" },
          { value: "consultations", label: `Consultations (${consultations.length})` },
        ].map((t) => (
          <button key={t.value} role="tab" type="button" onClick={() => setTab(t.value)} className={cn("-mb-px rounded-t-lg px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2", tab === t.value ? "text-gold-400 border-gold-500" : "text-bone-500 border-transparent hover:text-bone-200")}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "nutritionists" ? (
        <CrudManager
          title=""
          items={nutritionists}
          columns={NUTRITIONIST_COLUMNS}
          fields={NUTRITIONIST_FIELDS}
          searchKeys={["name", "title"]}
          itemLabel="Nutritionist"
          emptyIcon="Apple"
          actions={{ create: createNutritionistAction, update: updateNutritionistAction, remove: deleteNutritionistAction }}
        />
      ) : null}

      {tab === "plans" ? (
        <CrudManager
          title=""
          items={planItems}
          columns={PLAN_COLUMNS}
          fields={PLAN_FIELDS}
          searchKeys={["name", "goal"]}
          itemLabel="Plan"
          emptyIcon="ClipboardList"
          actions={{ create: createNutritionPlanAction, update: updateNutritionPlanAction, remove: deleteNutritionPlanAction }}
        />
      ) : null}

      {tab === "consultations" ? (
        consultations.length === 0 ? (
          <EmptyState icon="CalendarX2" title="No consultations booked yet" description="Consultations booked from the public site will appear here." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink-700">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink-700 bg-ink-900/60 text-left text-xs uppercase tracking-wider text-bone-500">
                  <th className="px-5 py-3.5 font-medium">Nutritionist</th>
                  <th className="px-5 py-3.5 font-medium">Date & Time</th>
                  <th className="px-5 py-3.5 font-medium">Member</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700 bg-ink-900/30">
                {consultations.map((c) => (
                  <tr key={c.id} className="hover:bg-ink-800/40">
                    <td className="px-5 py-3.5 text-bone-200">{c.nutritionistName}</td>
                    <td className="px-5 py-3.5 text-bone-200">{formatDate(c.date)} · {c.time}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-bone-200">{c.name}</p>
                      <p className="text-xs text-bone-500">{c.email}</p>
                    </td>
                    <td className="px-5 py-3.5"><Badge tone={STATUS_TONE[c.status] || "neutral"}>{c.status}</Badge></td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        {c.status !== "completed" ? (
                          <button type="button" disabled={pending && updatingId === c.id} onClick={() => updateConsultation(c.id, "completed")} className="rounded-lg border border-ink-600 px-2.5 py-1.5 text-xs font-semibold text-bone-300 hover:bg-ink-700 hover:text-gold-400 disabled:opacity-50">
                            {pending && updatingId === c.id ? <Loader2 className="size-3.5 animate-spin" /> : "Complete"}
                          </button>
                        ) : null}
                        {c.status !== "cancelled" ? (
                          <button type="button" disabled={pending && updatingId === c.id} onClick={() => updateConsultation(c.id, "cancelled")} className="rounded-lg border border-ember-500/30 px-2.5 py-1.5 text-xs font-semibold text-ember-500 hover:bg-ember-500/10 disabled:opacity-50">
                            Cancel
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </div>
  );
}
