import { getStore, withStoreTransaction } from "./store";
import { clone, makeId, slugify } from "./helpers";

export async function listFacilities() {
  const store = getStore();
  return clone(store.facilities);
}

export async function getFacilityBySlug(slug) {
  const store = getStore();
  const facility = store.facilities.find((f) => f.slug === slug);
  return facility ? clone(facility) : null;
}

export async function createFacility(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const item = { id: makeId("fc"), slug: slugify(data.name), ...data };
    store.facilities.push(item);
    return clone(item);
  });
}

export async function updateFacility(id, data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const idx = store.facilities.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error("Facility not found");
    store.facilities[idx] = { ...store.facilities[idx], ...data };
    return clone(store.facilities[idx]);
  });
}

export async function deleteFacility(id) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.facilities = store.facilities.filter((f) => f.id !== id);
    return { success: true };
  });
}
