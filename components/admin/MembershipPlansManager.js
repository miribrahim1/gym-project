"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X, Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Label, Input, FieldGroup } from "@/components/ui/FormField";
import { formatCurrency } from "@/lib/utils/format";
import { createPlanAction, updatePlanAction, deletePlanAction } from "@/lib/actions/adminCrud";

function emptyForm() {
  return { name: "", tagline: "", monthlyPrice: "", highlighted: false, features: [{ label: "", included: true }] };
}

export default function MembershipPlansManager({ plans }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [pending, startTransition] = useTransition();

  function openCreate() {
    setEditingPlan(null);
    setForm(emptyForm());
    setModalOpen(true);
  }

  function openEdit(plan) {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      tagline: plan.tagline,
      monthlyPrice: plan.monthlyPrice,
      highlighted: plan.highlighted,
      features: plan.features.length ? plan.features : [{ label: "", included: true }],
    });
    setModalOpen(true);
  }

  function updateFeature(index, key, value) {
    setForm((f) => ({
      ...f,
      features: f.features.map((feat, i) => (i === index ? { ...feat, [key]: value } : feat)),
    }));
  }

  function addFeature() {
    setForm((f) => ({ ...f, features: [...f.features, { label: "", included: true }] }));
  }

  function removeFeature(index) {
    setForm((f) => ({ ...f, features: f.features.filter((_, i) => i !== index) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name: form.name,
      tagline: form.tagline,
      monthlyPrice: Number(form.monthlyPrice) || 0,
      highlighted: !!form.highlighted,
      features: form.features.filter((f) => f.label.trim()),
    };
    startTransition(async () => {
      if (editingPlan) await updatePlanAction(editingPlan.id, data);
      else await createPlanAction(data);
      setModalOpen(false);
      router.refresh();
    });
  }

  function handleDelete(plan) {
    if (!window.confirm(`Delete the ${plan.name} plan? This cannot be undone.`)) return;
    startTransition(async () => {
      await deletePlanAction(plan.id);
      router.refresh();
    });
  }

  function toggleActive(plan) {
    startTransition(async () => {
      await updatePlanAction(plan.id, { active: plan.active === false ? true : false });
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-bone-50">Memberships</h1>
          <p className="mt-1 text-sm text-bone-500">Manage plan pricing, features and availability.</p>
        </div>
        <Button onClick={openCreate} icon={Plus}>Add Plan</Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className={cn("rounded-2xl border p-6", plan.highlighted ? "border-gold-500/50 bg-gold-500/[0.04]" : "border-ink-700 bg-ink-900/60")}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-2xl tracking-wide text-bone-50">{plan.name}</h3>
                <p className="text-xs text-bone-500">{plan.tagline}</p>
              </div>
              {plan.highlighted ? <Badge tone="gold"><Star className="size-3" /> Popular</Badge> : null}
            </div>
            <p className="font-display mt-4 text-3xl text-bone-50">{formatCurrency(plan.monthlyPrice)}<span className="text-sm text-bone-500">/mo</span></p>
            <ul className="mt-4 space-y-1.5">
              {plan.features.slice(0, 4).map((f) => (
                <li key={f.label} className="text-xs text-bone-500">{f.included ? "✓" : "✕"} {f.label}</li>
              ))}
              {plan.features.length > 4 ? <li className="text-xs text-bone-600">+{plan.features.length - 4} more</li> : null}
            </ul>
            <div className="mt-5 flex items-center justify-between border-t border-ink-700 pt-4">
              <Badge tone={plan.active === false ? "neutral" : "success"}>{plan.active === false ? "Inactive" : "Active"}</Badge>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => toggleActive(plan)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-bone-400 hover:bg-ink-700 hover:text-bone-100">
                  {plan.active === false ? "Activate" : "Deactivate"}
                </button>
                <button type="button" onClick={() => openEdit(plan)} aria-label="Edit" className="flex size-8 items-center justify-center rounded-lg text-bone-400 hover:bg-ink-700 hover:text-gold-400">
                  <Pencil className="size-4" />
                </button>
                <button type="button" onClick={() => handleDelete(plan)} aria-label="Delete" className="flex size-8 items-center justify-center rounded-lg text-bone-400 hover:bg-ember-500/10 hover:text-ember-500">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingPlan ? `Edit ${editingPlan.name}` : "Add Plan"} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input id="plan-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="plan-price">Monthly Price (₹)</Label>
              <Input id="plan-price" type="number" required value={form.monthlyPrice} onChange={(e) => setForm((f) => ({ ...f, monthlyPrice: e.target.value }))} />
            </FieldGroup>
            <FieldGroup className="sm:col-span-2">
              <Label htmlFor="plan-tagline">Tagline</Label>
              <Input id="plan-tagline" value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
            </FieldGroup>
          </div>

          <label className="mt-2 flex items-center gap-2 text-sm text-bone-300">
            <input type="checkbox" checked={form.highlighted} onChange={(e) => setForm((f) => ({ ...f, highlighted: e.target.checked }))} className="size-4 rounded border-ink-600 bg-ink-900 accent-gold-500" />
            Mark as &ldquo;Most Popular&rdquo;
          </label>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <Label>Features</Label>
              <button type="button" onClick={addFeature} className="text-xs font-semibold text-gold-400 hover:text-gold-300">+ Add Feature</button>
            </div>
            <div className="mt-2 space-y-2">
              {form.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={feature.included}
                    onChange={(e) => updateFeature(i, "included", e.target.checked)}
                    className="size-4 shrink-0 rounded border-ink-600 bg-ink-900 accent-gold-500"
                  />
                  <Input value={feature.label} onChange={(e) => updateFeature(i, "label", e.target.value)} placeholder="Feature description" />
                  <button type="button" onClick={() => removeFeature(i)} aria-label="Remove feature" className="shrink-0 text-bone-500 hover:text-ember-500">
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending} icon={pending ? Loader2 : undefined} className={pending ? "[&_svg]:animate-spin" : ""}>
              {pending ? "Saving…" : editingPlan ? "Save Changes" : "Add Plan"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
