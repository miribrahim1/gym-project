"use server";

import { revalidatePath } from "next/cache";
import { consultationBookingSchema } from "@/lib/validation/schemas";
import { getConsultationAvailability, bookConsultation } from "@/lib/db/nutrition";

export async function fetchConsultationAvailability(nutritionistSlug, date) {
  return getConsultationAvailability({ nutritionistSlug, date });
}

export async function confirmConsultationBooking(payload) {
  const parsed = consultationBookingSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, errors: fieldErrors };
  }
  const result = await bookConsultation(parsed.data);
  if (result.success) {
    revalidatePath("/admin/nutrition");
    revalidatePath("/admin");
  }
  return result;
}
