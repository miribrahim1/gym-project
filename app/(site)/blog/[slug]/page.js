import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { listBlogPosts, getBlogPostBySlug } from "@/lib/db/blog";
import { Section } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Badge from "@/components/ui/Badge";
import BlogCard from "@/components/blog/BlogCard";
import { formatDate } from "@/lib/utils/format";

export async function generateStaticParams() {
  const posts = await listBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", publishedTime: post.date, authors: [post.author] },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src={post.image} tone={post.tone} icon="Newspaper" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <Badge tone="gold">{post.category}</Badge>
          <h1 className="font-display mt-3 max-w-3xl text-4xl tracking-wide text-bone-50 sm:text-5xl">{post.title}</h1>
          <p className="mt-3 flex items-center gap-3 text-sm text-bone-400">
            <span>{post.author}</span> · <span>{formatDate(post.date)}</span> ·
            <span className="flex items-center gap-1"><Clock className="size-3.5" /> {post.readTime} min read</span>
          </p>
        </div>
      </div>

      <Section className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <div className="prose-custom space-y-5">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-bone-300">{paragraph}</p>
            ))}
          </div>
          <p className="mt-10 text-xs uppercase tracking-wider text-bone-600">Demo article — written for portfolio/demonstration purposes.</p>
        </article>

        <aside className="lg:col-span-4">
          <div className="sticky top-24">
            <h3 className="font-display text-xl tracking-wide text-bone-50">More in {post.category}</h3>
            <div className="mt-5 space-y-5">
              {post.related.length === 0 ? (
                <p className="text-sm text-bone-500">No related articles yet.</p>
              ) : (
                post.related.map((r) => <BlogCard key={r.id} post={r} />)
              )}
            </div>
          </div>
        </aside>
      </Section>
    </>
  );
}
