import { getStore } from "./store";
import { delay, clone, makeId, slugify } from "./helpers";

export async function listTrainers({ specialization } = {}) {
  await delay();
  const store = getStore();
  let items = clone(store.trainers);
  if (specialization && specialization !== "all") {
    items = items.filter((t) => t.specialization === specialization);
  }
  return items;
}

export async function getTrainerBySlug(slug) {
  await delay();
  const store = getStore();
  const trainer = store.trainers.find((t) => t.slug === slug);
  return trainer ? clone(trainer) : null;
}

export async function getTrainersByProgram(programSlug) {
  await delay();
  const store = getStore();
  return clone(store.trainers.filter((t) => t.programs.includes(programSlug)));
}

export async function createTrainer(data) {
  await delay();
  const store = getStore();
  const trainer = {
    id: makeId("tr"),
    slug: slugify(data.name),
    rating: 4.5,
    reviewsCount: 0,
    programs: [],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    photoTone: "amber",
    ...data,
  };
  store.trainers.unshift(trainer);
  return clone(trainer);
}

export async function updateTrainer(id, data) {
  await delay();
  const store = getStore();
  const idx = store.trainers.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Trainer not found");
  store.trainers[idx] = { ...store.trainers[idx], ...data };
  return clone(store.trainers[idx]);
}

export async function deleteTrainer(id) {
  await delay();
  const store = getStore();
  store.trainers = store.trainers.filter((t) => t.id !== id);
  return { success: true };
}
