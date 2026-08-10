import { listPrograms } from "@/lib/db/programs";
import { listTrainers } from "@/lib/db/trainers";
import { listSupplements } from "@/lib/db/supplements";
import { listEvents } from "@/lib/db/events";
import { listBlogPosts } from "@/lib/db/blog";
import { listNutritionPlans } from "@/lib/db/nutrition";

const BASE_URL = "https://www.ironvaultfitness.com";

const STATIC_ROUTES = [
  "",
  "/programs",
  "/membership",
  "/trainers",
  "/classes",
  "/personal-training",
  "/nutrition",
  "/nutrition/consultation",
  "/supplements",
  "/transformations",
  "/gallery",
  "/facilities",
  "/about",
  "/events",
  "/blog",
  "/contact",
  "/faq",
];

export default async function sitemap() {
  const [programs, trainers, products, events, posts, nutritionPlans] = await Promise.all([
    listPrograms(),
    listTrainers(),
    listSupplements(),
    listEvents(),
    listBlogPosts(),
    listNutritionPlans(),
  ]);

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const dynamicEntries = [
    ...programs.map((p) => ({ url: `${BASE_URL}/programs/${p.slug}`, lastModified: new Date(), priority: 0.6 })),
    ...trainers.map((t) => ({ url: `${BASE_URL}/trainers/${t.slug}`, lastModified: new Date(), priority: 0.5 })),
    ...products.map((p) => ({ url: `${BASE_URL}/supplements/${p.slug}`, lastModified: new Date(), priority: 0.5 })),
    ...events.map((e) => ({ url: `${BASE_URL}/events/${e.slug}`, lastModified: new Date(), priority: 0.5 })),
    ...posts.map((p) => ({ url: `${BASE_URL}/blog/${p.slug}`, lastModified: new Date(), priority: 0.5 })),
    ...nutritionPlans.map((p) => ({ url: `${BASE_URL}/nutrition/plans/${p.slug}`, lastModified: new Date(), priority: 0.4 })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
