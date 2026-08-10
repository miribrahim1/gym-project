"use server";

import { revalidatePath } from "next/cache";
import { classBookingSchema } from "@/lib/validation/schemas";
import { bookClass } from "@/lib/db/classes";

export async function confirmClassBooking(payload) {
  const parsed = classBookingSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, errors: fieldErrors };
  }
  const result = await bookClass(parsed.data);
  if (result.success) {
    revalidatePath("/classes");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
  }
  return result;
}
