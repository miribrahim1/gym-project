"use server";

import { revalidatePath } from "next/cache";
import { checkoutSchema } from "@/lib/validation/schemas";
import { createOrder } from "@/lib/db/supplements";

const SHIPPING_FLAT = 99;
const FREE_SHIPPING_THRESHOLD = 2000;

export async function submitOrder({ customer, items }) {
  const parsed = checkoutSchema.safeParse(customer);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, errors: fieldErrors };
  }
  if (!items || items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  const result = await createOrder({ items, subtotal, shipping, total, customer: parsed.data });
  if (result.success) {
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/supplements");
  }
  return result;
}
