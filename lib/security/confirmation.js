import { cookies } from "next/headers";
import { signToken, verifyToken, cookieOptions } from "./tokens";
import { isAdmin } from "./admin";

// A separate HttpOnly capability per receipt preserves access to multiple orders.
export async function grantConfirmationAccess(kind, id) {
  (await cookies()).set(`receipt_${id}`, signToken({ purpose: kind, id }), cookieOptions);
}

export async function hasConfirmationAccess(kind, id) {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) return false;
  const claims = verifyToken((await cookies()).get(`receipt_${id}`)?.value);
  return (claims?.purpose === kind && claims.id === id) || await isAdmin();
}
