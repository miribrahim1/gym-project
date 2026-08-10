import { getStore } from "./store";
import { delay, clone, makeId, slugify } from "./helpers";

export async function listFacilities() {
  await delay();
  const store = getStore();
  return clone(store.facilities);
}

export async function getFacilityBySlug(slug) {
  await delay();
  const store = getStore();
  const facility = store.facilities.find((f) => f.slug === slug);
  return facility ? clone(facility) : null;
}

export async function createFacility(data) {
  await delay();
  const store = getStore();
  const item = { id: makeId("fc"), slug: slugify(data.name), ...data };
  store.facilities.push(item);
  return clone(item);
}

export async function updateFacility(id, data) {
  await delay();
  const store = getStore();
  const idx = store.facilities.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error("Facility not found");
  store.facilities[idx] = { ...store.facilities[idx], ...data };
  return clone(store.facilities[idx]);
}

export async function deleteFacility(id) {
  await delay();
  const store = getStore();
  store.facilities = store.facilities.filter((f) => f.id !== id);
  return { success: true };
}
