"use server";

import { revalidatePath } from "next/cache";
import { membershipSignupSchema } from "@/lib/validation/schemas";
import { createMembershipSignup } from "@/lib/db/memberships";

export async function submitMembershipSignup(payload) {
  const parsed = membershipSignupSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, errors: fieldErrors };
  }

  const membership = await createMembershipSignup(parsed.data);
  revalidatePath("/admin/members");
  revalidatePath("/admin");
  return { success: true, membership };
}
