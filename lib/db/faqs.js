import { getStore } from "./store";
import { delay, clone, makeId } from "./helpers";

export async function listFaqs() {
  await delay(80);
  const store = getStore();
  return clone(store.faqs);
}

export async function createFaq(data) {
  await delay();
  const store = getStore();
  const item = { id: makeId("faq"), ...data };
  store.faqs.push(item);
  return clone(item);
}

export async function updateFaq(id, data) {
  await delay();
  const store = getStore();
  const idx = store.faqs.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error("FAQ not found");
  store.faqs[idx] = { ...store.faqs[idx], ...data };
  return clone(store.faqs[idx]);
}

export async function deleteFaq(id) {
  await delay();
  const store = getStore();
  store.faqs = store.faqs.filter((f) => f.id !== id);
  return { success: true };
}
