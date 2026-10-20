import { listMembers } from "@/lib/db/members";
import { listPlans } from "@/lib/db/memberships";
import CrudManager from "@/components/admin/CrudManager";
import { createMemberAction, updateMemberAction, deleteMemberAction } from "@/lib/actions/adminCrud";

export const metadata = { title: "Members" };

const STATUSES = ["pending", "active", "inactive", "expired"];

export default async function AdminMembersPage() {
  const [members, plans] = await Promise.all([listMembers(), listPlans()]);
  const planOptions = plans.map((p) => p.slug);

  const FIELDS = [
    { name: "name", label: "Full Name", required: true },
    { name: "email", label: "Email", required: true },
    { name: "phone", label: "Phone", required: true },
    { name: "planSlug", label: "Plan", type: "select", options: planOptions },
    { name: "fitnessGoal", label: "Fitness Goal", placeholder: "Weight Loss" },
    { name: "trainerSlug", label: "Trainer Slug", placeholder: "arjun-mehta" },
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "expiryDate", label: "Expiry Date", type: "date" },
    { name: "status", label: "Status", type: "select", options: STATUSES },
  ];

  const COLUMNS = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "planSlug", label: "Plan" },
    { key: "status", label: "Status" },
    { key: "expiryDate", label: "Expiry", format: "date" },
  ];

  return (
    <CrudManager
      title="Members"
      description="View, search and manage member profiles. Click a name to view full profile."
      items={members}
      columns={COLUMNS}
      fields={FIELDS}
      searchKeys={["name", "email", "phone"]}
      itemLabel="Member"
      emptyIcon="Users"
      detailHrefTemplate="/admin/members/{id}"
      actions={{ create: createMemberAction, update: updateMemberAction, remove: deleteMemberAction }}
    />
  );
}
