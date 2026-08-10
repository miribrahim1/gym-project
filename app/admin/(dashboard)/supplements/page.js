import { listSupplements } from "@/lib/db/supplements";
import CrudManager from "@/components/admin/CrudManager";
import { createSupplementAction, updateSupplementAction, deleteSupplementAction } from "@/lib/actions/adminCrud";

export const metadata = { title: "Supplements" };

const CATEGORIES = ["Protein", "Performance", "Recovery", "Hydration", "Wellness", "Snacks"];
const TONES = ["amber", "rose", "emerald", "slate"];

const FIELDS = [
  { name: "name", label: "Product Name", required: true, span: "full" },
  { name: "category", label: "Category", type: "select", options: CATEGORIES, required: true },
  { name: "price", label: "Price (₹)", type: "number", required: true },
  { name: "discountPrice", label: "Discount Price (₹)", type: "number", hint: "Leave 0 for no discount" },
  { name: "stock", label: "Stock (units)", type: "number" },
  { name: "servings", label: "Servings" },
  { name: "flavor", label: "Flavor" },
  { name: "tone", label: "Image Tone", type: "select", options: TONES },
  { name: "shortDescription", label: "Short Description", type: "textarea", span: "full" },
  { name: "description", label: "Full Description", type: "textarea", span: "full" },
  { name: "ingredients", label: "Ingredients (comma separated)", type: "tags", span: "full" },
  { name: "usage", label: "Usage Instructions", type: "textarea", span: "full" },
  { name: "warnings", label: "Warnings", type: "textarea", span: "full" },
];

const COLUMNS = [
  { key: "name", label: "Product" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price", format: "currency" },
  { key: "stock", label: "Stock" },
];

export default async function AdminSupplementsPage() {
  const products = await listSupplements();

  return (
    <CrudManager
      title="Supplements"
      description="Manage the IronVault supplement catalog."
      items={products}
      columns={COLUMNS}
      fields={FIELDS}
      searchKeys={["name", "category"]}
      itemLabel="Product"
      emptyIcon="ShoppingBag"
      actions={{ create: createSupplementAction, update: updateSupplementAction, remove: deleteSupplementAction }}
    />
  );
}
