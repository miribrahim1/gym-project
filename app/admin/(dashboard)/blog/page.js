import { listBlogPosts } from "@/lib/db/blog";
import CrudManager from "@/components/admin/CrudManager";
import { createBlogPostAction, updateBlogPostAction, deleteBlogPostAction } from "@/lib/actions/adminCrud";

export const metadata = { title: "Blog" };

const CATEGORIES = ["Training", "Nutrition", "Recovery", "Mindset", "Lifestyle", "Supplements"];
const TONES = ["amber", "rose", "emerald", "slate"];

const FIELDS = [
  { name: "title", label: "Title", required: true, span: "full" },
  { name: "category", label: "Category", type: "select", options: CATEGORIES, required: true },
  { name: "author", label: "Author" },
  { name: "date", label: "Publish Date", type: "date" },
  { name: "readTime", label: "Read Time (min)", type: "number" },
  { name: "tone", label: "Cover Tone", type: "select", options: TONES },
  { name: "excerpt", label: "Excerpt", type: "textarea", span: "full" },
  { name: "contentText", label: "Article Content (one paragraph per line)", type: "textarea", span: "full", hint: "Each line becomes a paragraph on the article page." },
];

const COLUMNS = [
  { key: "title", label: "Title", format: "truncate" },
  { key: "category", label: "Category" },
  { key: "author", label: "Author" },
  { key: "date", label: "Date", format: "date" },
];

export default async function AdminBlogPage() {
  const posts = await listBlogPosts();
  const items = posts.map((p) => ({ ...p, contentText: (p.content || []).join("\n") }));

  return (
    <CrudManager
      title="Blog"
      description="Manage articles in the IronVault Fitness Journal."
      items={items}
      columns={COLUMNS}
      fields={FIELDS}
      searchKeys={["title", "category", "author"]}
      itemLabel="Article"
      emptyIcon="Newspaper"
      actions={{ create: createBlogPostAction, update: updateBlogPostAction, remove: deleteBlogPostAction }}
    />
  );
}
