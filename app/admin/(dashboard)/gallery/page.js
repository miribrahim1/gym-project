import { listGalleryImages } from "@/lib/db/gallery";
import CrudManager from "@/components/admin/CrudManager";
import { createGalleryImageAction, updateGalleryImageAction, deleteGalleryImageAction } from "@/lib/actions/adminCrud";

export const metadata = { title: "Gallery" };

const CATEGORIES = ["Gym", "Training", "Classes", "Trainers", "Community", "Events"];
const TONES = ["amber", "rose", "emerald", "slate"];

const FIELDS = [
  { name: "caption", label: "Caption", required: true, span: "full" },
  { name: "category", label: "Category", type: "select", options: CATEGORIES, required: true },
  { name: "tone", label: "Tone", type: "select", options: TONES },
];

const COLUMNS = [
  { key: "caption", label: "Caption", format: "truncate" },
  { key: "category", label: "Category" },
  { key: "tone", label: "Tone" },
];

export default async function AdminGalleryPage() {
  const images = await listGalleryImages();

  return (
    <CrudManager
      title="Gallery"
      description="Manage images shown in the public gallery."
      items={images}
      columns={COLUMNS}
      fields={FIELDS}
      searchKeys={["caption", "category"]}
      itemLabel="Image"
      emptyIcon="Images"
      actions={{ create: createGalleryImageAction, update: updateGalleryImageAction, remove: deleteGalleryImageAction }}
    />
  );
}
