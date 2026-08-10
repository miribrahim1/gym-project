"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminLoginSchema } from "@/lib/validation/schemas";

const SESSION_COOKIE = "ironvault_admin_session";
const DEMO_ADMIN = {
  email: "admin@ironvaultfitness.com",
  password: "ironvault2026",
};

export async function loginAdmin(payload) {
  const parsed = adminLoginSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, errors: fieldErrors };
  }

  const { email, password } = parsed.data;
  if (email.toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
    return { success: false, error: "Invalid email or password. Use the demo credentials shown below." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "demo-authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours — demo session only
  });

  return { success: true };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === "demo-authenticated";
}
