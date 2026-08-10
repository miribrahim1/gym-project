import { notFound } from "next/navigation";
import { PackageCheck } from "lucide-react";
import { getOrderById } from "@/lib/db/supplements";
import { Section } from "@/components/ui/Section";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import Button from "@/components/ui/Button";

export const metadata = { title: "Order Confirmed", robots: { index: false } };

export default async function OrderConfirmationPage({ params }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <Section className="flex justify-center pt-16">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <PackageCheck className="size-9" strokeWidth={1.5} />
        </div>
        <h1 className="font-display mt-6 text-5xl tracking-wide text-bone-50 sm:text-6xl">Order Confirmed</h1>
        <p className="mt-3 text-bone-400">Thanks, {order.customer.name.split(" ")[0]}! Your order has been placed successfully.</p>

        <div className="mt-10 rounded-2xl border border-ink-700 bg-ink-900/60 p-8 text-left">
          <div className="flex items-center justify-between border-b border-ink-700 pb-4">
            <span className="text-xs uppercase tracking-wider text-bone-500">Order ID</span>
            <span className="font-medium text-bone-100">{order.id}</span>
          </div>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.slug} className="flex justify-between text-sm">
                <span className="text-bone-400">{item.name} × {item.qty}</span>
                <span className="text-bone-200">{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <dl className="mt-4 space-y-2 border-t border-ink-700 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-bone-500">Subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-bone-500">Shipping</dt><dd>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</dd></div>
            <div className="flex justify-between border-t border-ink-700 pt-2 text-base"><dt className="font-display text-bone-50">Total</dt><dd className="font-display text-bone-50">{formatCurrency(order.total)}</dd></div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-ink-700 pt-4 text-sm">
            <span className="text-bone-500">Delivering to</span>
            <span className="max-w-xs text-right text-bone-200">{order.customer.address}, {order.customer.city} {order.customer.pincode}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-bone-500">Placed on</span>
            <span className="text-bone-200">{formatDate(order.createdAt)}</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button href="/supplements">Continue Shopping</Button>
          <Button href="/" variant="secondary">Back to Home</Button>
        </div>
      </div>
    </Section>
  );
}
