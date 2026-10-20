"use server";

import { revalidatePath } from "next/cache";
import { checkoutSchema } from "@/lib/validation/schemas";
import { grantConfirmationAccess } from "@/lib/security/confirmation";
import { createOrder } from "@/lib/db/supplements";

export async function submitOrder({ customer, items } = {}) {
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

  const result = await createOrder({ items, customer: parsed.data });
  if (result.success) {
    await grantConfirmationAccess("order", result.order.id);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/supplements");
  }
  return result;
}
