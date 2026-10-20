import { cookies } from "next/headers";
import { verifyToken } from "./tokens";

export const SESSION_COOKIE = "ironvault_admin_session";

export async function isAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const claims = verifyToken(token);
  return claims?.purpose === "admin" && claims.email === process.env.ADMIN_EMAIL?.toLowerCase();
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
