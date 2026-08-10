import { listTrainers } from "@/lib/db/trainers";
import CrudManager from "@/components/admin/CrudManager";
import { createTrainerAction, updateTrainerAction, deleteTrainerAction } from "@/lib/actions/adminCrud";

export const metadata = { title: "Trainers" };

const TONES = ["amber", "rose", "emerald", "slate"];

const FIELDS = [
  { name: "name", label: "Full Name", required: true, placeholder: "Arjun Mehta" },
  { name: "role", label: "Role / Title", placeholder: "Strength & Conditioning Coach" },
  { name: "specialization", label: "Specialization", placeholder: "Strength & Conditioning" },
  { name: "experienceYears", label: "Experience (years)", type: "number" },
  { name: "rating", label: "Rating (0–5)", type: "number" },
  { name: "photoTone", label: "Photo Tone", type: "select", options: TONES },
  { name: "bio", label: "Bio", type: "textarea", span: "full" },
  { name: "philosophy", label: "Training Philosophy", type: "textarea", span: "full" },
  { name: "certifications", label: "Certifications (comma separated)", type: "tags", span: "full" },
  { name: "specializations", label: "Specializations (comma separated)", type: "tags", span: "full" },
  { name: "programs", label: "Program Slugs (comma separated)", type: "tags", span: "full" },
];

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "experienceYears", label: "Experience", format: "suffix", suffix: " yrs" },
  { key: "rating", label: "Rating" },
];

export default async function AdminTrainersPage() {
  const trainers = await listTrainers();

  return (
    <CrudManager
      title="Trainers"
      description="Manage coach profiles shown across the site."
      items={trainers}
      columns={COLUMNS}
      fields={FIELDS}
      searchKeys={["name", "role", "specialization"]}
      itemLabel="Trainer"
      emptyIcon="Users"
      actions={{ create: createTrainerAction, update: updateTrainerAction, remove: deleteTrainerAction }}
    />
  );
}
