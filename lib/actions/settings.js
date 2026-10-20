"use server";

import { requireAdmin } from "@/lib/security/admin";
import { revalidatePath } from "next/cache";
import { updateSettings } from "@/lib/db/settings";

export async function updateSettingsAction(data) {
  await requireAdmin();
  const result = await updateSettings(data);
  // Settings power the header, footer, hero stats, contact page and more —
  // revalidate broadly so the change is visible across the public site immediately.
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return result;
}
