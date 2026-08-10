import { getStore } from "./store";
import { delay, clone, makeId } from "./helpers";

export async function listTransformations({ category } = {}) {
  await delay();
  const store = getStore();
  let items = clone(store.transformations);
  if (category && category !== "all") items = items.filter((t) => t.category === category);
  return items;
}

export async function createTransformation(data) {
  await delay();
  const store = getStore();
  const item = { id: makeId("tf"), ...data };
  store.transformations.unshift(item);
  return clone(item);
}

export async function updateTransformation(id, data) {
  await delay();
  const store = getStore();
  const idx = store.transformations.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Transformation not found");
  store.transformations[idx] = { ...store.transformations[idx], ...data };
  return clone(store.transformations[idx]);
}

export async function deleteTransformation(id) {
  await delay();
  const store = getStore();
  store.transformations = store.transformations.filter((t) => t.id !== id);
  return { success: true };
}
