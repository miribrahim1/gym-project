"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import BlogCard from "@/components/blog/BlogCard";
import EmptyState from "@/components/ui/EmptyState";

export default function BlogBoard({ posts, categories }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [posts, category, search]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setCategory("all")} className={cn("rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors", category === "all" ? "border-gold-500 bg-gold-500/10 text-gold-400" : "border-ink-600 text-bone-400 hover:border-ink-500")}>
            All
          </button>
          {categories.map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)} className={cn("rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors", category === c ? "border-gold-500 bg-gold-500/10 text-gold-400" : "border-ink-600 text-bone-400 hover:border-ink-500")}>
              {c}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-bone-500" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles…" className="w-full rounded-full border border-ink-600 bg-ink-900/60 py-2.5 pl-10 pr-4 text-sm text-bone-100 placeholder:text-bone-500 focus:border-gold-500/60 focus:outline-none" />
        </div>
      </div>

      <div className="mt-10">
        {filtered.length === 0 ? (
          <EmptyState icon="Newspaper" title="No articles found" description="Try a different search term or category." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => <BlogCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
}
