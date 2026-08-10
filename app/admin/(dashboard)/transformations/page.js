import { listTransformations } from "@/lib/db/transformations";
import CrudManager from "@/components/admin/CrudManager";
import { createTransformationAction, updateTransformationAction, deleteTransformationAction } from "@/lib/actions/adminCrud";

export const metadata = { title: "Transformations" };

const CATEGORIES = ["Weight Loss", "Muscle Gain", "Strength", "Athletic Performance"];

const FIELDS = [
  { name: "name", label: "Member Name", required: true, placeholder: "Rohan K." },
  { name: "category", label: "Category", type: "select", options: CATEGORIES, required: true },
  { name: "program", label: "Program" },
  { name: "goal", label: "Goal" },
  { name: "durationWeeks", label: "Duration (weeks)", type: "number" },
  { name: "headline", label: "Headline", placeholder: "12 kg lost in 5 months", span: "full", required: true },
  { name: "resultSummary", label: "Result Summary", type: "textarea", span: "full" },
  { name: "statsBefore", label: "Before", placeholder: "88 kg" },
  { name: "statsAfter", label: "After", placeholder: "76 kg" },
];

const COLUMNS = [
  { key: "name", label: "Member" },
  { key: "category", label: "Category" },
  { key: "headline", label: "Headline", format: "truncate" },
  { key: "durationWeeks", label: "Weeks" },
];

export default async function AdminTransformationsPage() {
  const transformations = await listTransformations();
  const items = transformations.map((t) => ({ ...t, statsBefore: t.stats?.before, statsAfter: t.stats?.after }));

  return (
    <CrudManager
      title="Transformations"
      description="Manage demo transformation stories shown publicly. Clearly labeled as demo content on the site."
      items={items}
      columns={COLUMNS}
      fields={FIELDS}
      searchKeys={["name", "category", "headline"]}
      itemLabel="Transformation"
      emptyIcon="Sparkles"
      actions={{ create: createTransformationAction, update: updateTransformationAction, remove: deleteTransformationAction }}
    />
  );
}
