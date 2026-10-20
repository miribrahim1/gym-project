"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminLoginSchema } from "@/lib/validation/schemas";
import { SESSION_COOKIE, isAdmin } from "@/lib/security/admin";
import { getStore, withStoreTransaction } from "@/lib/db/store";
import { signToken, cookieOptions } from "@/lib/security/tokens";

function equal(a, b) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

export async function loginAdmin(payload) {
  const parsed = adminLoginSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: "Enter a valid email and password." };
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
    return { success: false, error: "Admin sign-in has not been configured. Contact the site administrator." };
  }
  const allowed = withStoreTransaction(() => {
    const store = getStore();
    if (!store.loginThrottle || Date.now() - store.loginThrottle.since >= 15 * 60 * 1000) store.loginThrottle = { since: Date.now(), attempts: 0 };
    store.loginThrottle.attempts += 1;
    return store.loginThrottle.attempts <= 10;
  });
  if (!allowed) return { success: false, error: "Too many sign-in attempts. Try again in 15 minutes." };
  const validEmail = equal(parsed.data.email, ADMIN_EMAIL.toLowerCase());
  const validPassword = equal(parsed.data.password, ADMIN_PASSWORD);
  if (!validEmail || !validPassword) return { success: false, error: "Invalid email or password." };
  withStoreTransaction(() => { delete getStore().loginThrottle; });
  (await cookies()).set(SESSION_COOKIE, signToken({ purpose: "admin", email: ADMIN_EMAIL.toLowerCase() }), cookieOptions);
  return { success: true };
}

export async function logoutAdmin() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function isAdminAuthenticated() {
  return isAdmin();
}
