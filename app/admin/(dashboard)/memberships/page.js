import { listPlans } from "@/lib/db/memberships";
import MembershipPlansManager from "@/components/admin/MembershipPlansManager";

export const metadata = { title: "Memberships" };

export default async function AdminMembershipsPage() {
  const plans = await listPlans();
  return <MembershipPlansManager plans={plans} />;
}
