// Small helpers shared by the mock database layer.
// Kept deliberately framework-agnostic so this whole folder can be swapped
// for real Supabase/Appwrite calls later without touching UI code.

import { randomUUID } from "node:crypto";

export function makeId(prefix) {
  return `${prefix}_${randomUUID()}`;
}

export function clone(value) {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

export function paginate(items, { page = 1, pageSize = 12 } = {}) {
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);
  return {
    items: pageItems,
    page,
    pageSize,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
