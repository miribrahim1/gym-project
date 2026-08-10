import { listTestimonials } from "@/lib/db/testimonials";
import CrudManager from "@/components/admin/CrudManager";
import { createTestimonialAction, updateTestimonialAction, deleteTestimonialAction } from "@/lib/actions/adminCrud";

export const metadata = { title: "Testimonials" };

const FIELDS = [
  { name: "name", label: "Member Name", required: true },
  { name: "rating", label: "Rating (0–5)", type: "number", required: true },
  { name: "program", label: "Program" },
  { name: "review", label: "Review", type: "textarea", span: "full", required: true },
];

const COLUMNS = [
  { key: "name", label: "Member" },
  { key: "program", label: "Program" },
  { key: "rating", label: "Rating" },
  { key: "review", label: "Review", format: "truncate" },
];

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonials();

  return (
    <CrudManager
      title="Testimonials"
      description="Manage demo member testimonials shown on the homepage."
      items={testimonials}
      columns={COLUMNS}
      fields={FIELDS}
      searchKeys={["name", "program"]}
      itemLabel="Testimonial"
      emptyIcon="Quote"
      actions={{ create: createTestimonialAction, update: updateTestimonialAction, remove: deleteTestimonialAction }}
    />
  );
}
