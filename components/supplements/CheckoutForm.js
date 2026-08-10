"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { checkoutSchema } from "@/lib/validation/schemas";
import { submitOrder } from "@/lib/actions/checkout";
import { useCart } from "@/components/supplements/CartProvider";
import { Label, Input, FieldError, FieldGroup } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/utils/format";

const SHIPPING_FLAT = 99;
const FREE_SHIPPING_THRESHOLD = 2000;

export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clear, hydrated } = useCart();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", pincode: "" });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const next = {};
      for (const issue of result.error.issues) next[issue.path[0]] = issue.message;
      setErrors(next);
      return;
    }
    setServerError("");
    startTransition(async () => {
      const res = await submitOrder({ customer: form, items });
      if (!res.success) {
        setServerError(res.error || "We couldn't place your order. Please review your details and try again.");
        if (res.errors) setErrors(res.errors);
        return;
      }
      clear();
      router.push(`/order-confirmation/${res.order.id}`);
    });
  }

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <EmptyState icon="ShoppingBag" title="Your cart is empty" description="Add products to your cart before checking out." action={<Button href="/supplements">Shop Supplements</Button>} />
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <form onSubmit={handleSubmit} className="lg:col-span-8">
        <h2 className="font-display text-2xl tracking-wide text-bone-50">Delivery Details</h2>
        {serverError ? <p className="mt-3 text-sm text-ember-500">{serverError}</p> : null}
        <div className="mt-6 grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={form.name} error={errors.name} onChange={(e) => update("name", e.target.value)} />
            <FieldError>{errors.name}</FieldError>
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} error={errors.phone} onChange={(e) => update("phone", e.target.value)} />
            <FieldError>{errors.phone}</FieldError>
          </FieldGroup>
          <FieldGroup className="sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} error={errors.email} onChange={(e) => update("email", e.target.value)} />
            <FieldError>{errors.email}</FieldError>
          </FieldGroup>
          <FieldGroup className="sm:col-span-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Input id="address" value={form.address} error={errors.address} onChange={(e) => update("address", e.target.value)} placeholder="Flat / Street / Area" />
            <FieldError>{errors.address}</FieldError>
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="city">City</Label>
            <Input id="city" value={form.city} error={errors.city} onChange={(e) => update("city", e.target.value)} />
            <FieldError>{errors.city}</FieldError>
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="pincode">Postal Code</Label>
            <Input id="pincode" value={form.pincode} error={errors.pincode} onChange={(e) => update("pincode", e.target.value)} />
            <FieldError>{errors.pincode}</FieldError>
          </FieldGroup>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-lg border border-dashed border-ink-600 bg-ink-900/40 px-4 py-3 text-xs text-bone-500">
          <Lock className="size-3.5 text-gold-400" /> This is a demo checkout — no real payment is processed. Payment gateway integration (Stripe / Razorpay) can be added later at this step.
        </div>

        <Button type="submit" disabled={pending} icon={pending ? Loader2 : undefined} className={"mt-8 w-full sm:w-auto" + (pending ? " [&_svg]:animate-spin" : "")}>
          {pending ? "Placing Order…" : `Place Order — ${formatCurrency(total)}`}
        </Button>
      </form>

      <aside className="lg:col-span-4">
        <div className="sticky top-24 rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
          <h3 className="font-display text-xl tracking-wide text-bone-50">Order Summary</h3>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.slug} className="flex justify-between text-sm">
                <span className="text-bone-400">{item.name} × {item.qty}</span>
                <span className="text-bone-200">{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <dl className="mt-4 space-y-2 border-t border-ink-700 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-bone-500">Subtotal</dt><dd className="text-bone-200">{formatCurrency(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-bone-500">Shipping</dt><dd className="text-bone-200">{shipping === 0 ? "Free" : formatCurrency(shipping)}</dd></div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-ink-700 pt-4">
            <span className="font-display text-lg text-bone-50">Total</span>
            <span className="font-display text-lg text-bone-50">{formatCurrency(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
