import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/format";

const CATEGORY_ICONS = { Training: "Dumbbell", Nutrition: "Apple", Recovery: "HandHeart", Mindset: "Brain", Lifestyle: "Sunrise", Supplements: "Pill" };

export default function BlogCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40">
      <div className="relative">
        <PlaceholderImage src={post.image} tone={post.tone} icon={CATEGORY_ICONS[post.category] || "Newspaper"} ratio="video" size={36} />
        <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink-950/70 text-gold-400 backdrop-blur transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Badge tone="gold">{post.category}</Badge>
        <h3 className="font-display mt-3 text-xl leading-tight tracking-wide text-bone-50">{post.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-bone-500 line-clamp-3">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between border-t border-ink-700 pt-4 text-xs text-bone-500">
          <span>{post.author} · {formatDate(post.date)}</span>
          <span className="flex items-center gap-1"><Clock className="size-3.5" /> {post.readTime} min</span>
        </div>
      </div>
    </Link>
  );
}
