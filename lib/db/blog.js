import { getStore, withStoreTransaction } from "./store";
import { clone, makeId, slugify } from "./helpers";

export async function listBlogPosts({ category, search } = {}) {
  const store = getStore();
  let items = clone(store.blogPosts);
  if (category && category !== "all") items = items.filter((p) => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
  }
  items.sort((a, b) => new Date(b.date) - new Date(a.date));
  return items;
}

export async function getBlogPostBySlug(slug) {
  const store = getStore();
  const post = store.blogPosts.find((p) => p.slug === slug);
  if (!post) return null;
  const related = store.blogPosts.filter((p) => p.category === post.category && p.slug !== slug).slice(0, 3);
  return clone({ ...post, related });
}

export async function listBlogCategories() {
  const store = getStore();
  return [...new Set(store.blogPosts.map((p) => p.category))];
}

export async function createBlogPost(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const post = { id: makeId("bl"), slug: slugify(data.title), content: [], ...data };
    store.blogPosts.unshift(post);
    return clone(post);
  });
}

export async function updateBlogPost(id, data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const idx = store.blogPosts.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Post not found");
    store.blogPosts[idx] = { ...store.blogPosts[idx], ...data };
    return clone(store.blogPosts[idx]);
  });
}

export async function deleteBlogPost(id) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.blogPosts = store.blogPosts.filter((p) => p.id !== id);
    return { success: true };
  });
}
