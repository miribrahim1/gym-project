import { getStore, withStoreTransaction } from "./store";
import { clone, makeId } from "./helpers";

export async function listGalleryImages({ category } = {}) {
  const store = getStore();
  let items = clone(store.galleryImages);
  if (category && category !== "all") items = items.filter((g) => g.category === category);
  return items;
}

export async function listGalleryCategories() {
  const store = getStore();
  return [...new Set(store.galleryImages.map((g) => g.category))];
}

export async function createGalleryImage(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const item = { id: makeId("gl"), ...data };
    store.galleryImages.unshift(item);
    return clone(item);
  });
}

export async function updateGalleryImage(id, data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const idx = store.galleryImages.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error("Image not found");
    store.galleryImages[idx] = { ...store.galleryImages[idx], ...data };
    return clone(store.galleryImages[idx]);
  });
}

export async function deleteGalleryImage(id) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.galleryImages = store.galleryImages.filter((g) => g.id !== id);
    return { success: true };
  });
}
