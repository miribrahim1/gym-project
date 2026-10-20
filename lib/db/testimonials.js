import { getStore, withStoreTransaction } from "./store";
import { clone, makeId } from "./helpers";

export async function listTestimonials() {
  const store = getStore();
  return clone(store.testimonials);
}

export async function createTestimonial(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const item = { id: makeId("ts"), ...data };
    store.testimonials.unshift(item);
    return clone(item);
  });
}

export async function updateTestimonial(id, data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const idx = store.testimonials.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Testimonial not found");
    store.testimonials[idx] = { ...store.testimonials[idx], ...data };
    return clone(store.testimonials[idx]);
  });
}

export async function deleteTestimonial(id) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.testimonials = store.testimonials.filter((t) => t.id !== id);
    return { success: true };
  });
}
