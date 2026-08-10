import { listBlogPosts, listBlogCategories } from "@/lib/db/blog";
import { Section, SectionHeading } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import BlogBoard from "@/components/blog/BlogBoard";

export const metadata = {
  title: "Fitness Journal",
  description: "The IronVault Fitness Journal — articles on training, nutrition, recovery, mindset, lifestyle and supplements.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([listBlogPosts(), listBlogCategories()]);

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/blog/mindset.jpg" tone="slate" icon="Newspaper" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Fitness Journal</p>
          <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">The Journal</h1>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow={`${posts.length} Articles`} title="Training, Nutrition & More" />
        <div className="mt-12">
          <BlogBoard posts={posts} categories={categories} />
        </div>
      </Section>
    </>
  );
}
