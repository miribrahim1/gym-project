import { listPrograms } from "@/lib/db/programs";
import CrudManager from "@/components/admin/CrudManager";
import { createProgramAction, updateProgramAction, deleteProgramAction } from "@/lib/actions/adminCrud";

export const metadata = { title: "Programs" };

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "All Levels"];

const FIELDS = [
  { name: "name", label: "Program Name", required: true, placeholder: "Strength Training" },
  { name: "difficulty", label: "Difficulty", type: "select", options: DIFFICULTIES, required: true },
  { name: "duration", label: "Duration", placeholder: "12 Weeks" },
  { name: "idealFor", label: "Ideal For", placeholder: "Lifters who want measurable strength gains" },
  { name: "icon", label: "Icon (Lucide name)", placeholder: "Dumbbell", hint: "Any lucide-react icon name, e.g. Dumbbell, Flame, Zap" },
  { name: "trainerSlug", label: "Trainer Slug", placeholder: "arjun-mehta" },
  { name: "shortDescription", label: "Short Description", type: "textarea", span: "full" },
  { name: "overview", label: "Overview", type: "textarea", span: "full" },
  { name: "methodology", label: "Methodology", type: "textarea", span: "full" },
  { name: "benefits", label: "Benefits (comma separated)", type: "tags", span: "full" },
  { name: "whoItsFor", label: "Who It's For (comma separated)", type: "tags", span: "full" },
  { name: "expectedOutcomes", label: "Expected Outcomes (comma separated)", type: "tags", span: "full" },
];

const COLUMNS = [
  { key: "name", label: "Program" },
  { key: "difficulty", label: "Difficulty" },
  { key: "duration", label: "Duration" },
  { key: "trainerSlug", label: "Trainer" },
];

export default async function AdminProgramsPage() {
  const programs = await listPrograms();

  return (
    <CrudManager
      title="Programs"
      description="Manage the training programs shown on the public site."
      items={programs}
      columns={COLUMNS}
      fields={FIELDS}
      searchKeys={["name", "difficulty"]}
      itemLabel="Program"
      emptyIcon="Dumbbell"
      actions={{ create: createProgramAction, update: updateProgramAction, remove: deleteProgramAction }}
    />
  );
}
