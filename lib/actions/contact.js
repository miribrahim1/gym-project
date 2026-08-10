"use server";

import { revalidatePath } from "next/cache";
import { contactFormSchema } from "@/lib/validation/schemas";
import { createEnquiry } from "@/lib/db/messages";

export async function submitContactForm(payload) {
  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, errors: fieldErrors };
  }
  const enquiry = await createEnquiry(parsed.data);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true, enquiry };
}
