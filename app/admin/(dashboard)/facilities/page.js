import { listFacilities } from "@/lib/db/facilities";
import CrudManager from "@/components/admin/CrudManager";
import { createFacilityAction, updateFacilityAction, deleteFacilityAction } from "@/lib/actions/adminCrud";

export const metadata = { title: "Facilities" };

const TONES = ["amber", "rose", "emerald", "slate"];

const FIELDS = [
  { name: "name", label: "Facility Name", required: true },
  { name: "tone", label: "Tone", type: "select", options: TONES },
  { name: "description", label: "Description", type: "textarea", span: "full", required: true },
];

const COLUMNS = [
  { key: "name", label: "Facility" },
  { key: "description", label: "Description", format: "truncate" },
];

export default async function AdminFacilitiesPage() {
  const facilities = await listFacilities();

  return (
    <CrudManager
      title="Facilities"
      description="Manage facility zones shown on the public Facilities page."
      items={facilities}
      columns={COLUMNS}
      fields={FIELDS}
      searchKeys={["name"]}
      itemLabel="Facility"
      emptyIcon="Building2"
      actions={{ create: createFacilityAction, update: updateFacilityAction, remove: deleteFacilityAction }}
    />
  );
}
