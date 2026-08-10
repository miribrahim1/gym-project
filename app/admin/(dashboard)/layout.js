import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/actions/auth";
import { getSettings } from "@/lib/db/settings";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const settings = await getSettings();

  return <AdminShell settings={settings}>{children}</AdminShell>;
}
