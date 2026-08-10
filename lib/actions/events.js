"use server";

import { revalidatePath } from "next/cache";
import { eventRegistrationSchema } from "@/lib/validation/schemas";
import { registerForEvent } from "@/lib/db/events";

export async function submitEventRegistration(payload) {
  const parsed = eventRegistrationSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, errors: fieldErrors };
  }
  const result = await registerForEvent(parsed.data);
  if (result.success) {
    revalidatePath("/events");
    revalidatePath(`/events/${parsed.data.eventSlug}`);
    revalidatePath("/admin");
  }
  return result;
}
