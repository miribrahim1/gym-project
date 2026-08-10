"use server";

import { revalidatePath } from "next/cache";
import { ptBookingSchema } from "@/lib/validation/schemas";
import { getAvailability, bookPersonalTraining } from "@/lib/db/personalTraining";

export async function fetchAvailability(trainerSlug, date) {
  return getAvailability({ trainerSlug, date });
}

export async function confirmPersonalTrainingBooking(payload) {
  const parsed = ptBookingSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, errors: fieldErrors };
  }
  const result = await bookPersonalTraining(parsed.data);
  if (result.success) {
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
  }
  return result;
}
