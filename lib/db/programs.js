import { getStore } from "./store";
import { delay, clone, makeId, slugify } from "./helpers";

export async function listPrograms({ difficulty } = {}) {
  await delay();
  const store = getStore();
  let items = clone(store.programs);
  if (difficulty && difficulty !== "all") {
    items = items.filter((p) => p.difficulty === difficulty);
  }
  return items;
}

export async function getProgramBySlug(slug) {
  await delay();
  const store = getStore();
  const program = store.programs.find((p) => p.slug === slug);
  return program ? clone(program) : null;
}

export async function createProgram(data) {
  await delay();
  const store = getStore();
  const program = {
    id: makeId("pr"),
    slug: slugify(data.name),
    benefits: [],
    weeklyStructure: [],
    whoItsFor: [],
    expectedOutcomes: [],
    faqs: [],
    ...data,
  };
  store.programs.unshift(program);
  return clone(program);
}

export async function updateProgram(id, data) {
  await delay();
  const store = getStore();
  const idx = store.programs.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Program not found");
  store.programs[idx] = { ...store.programs[idx], ...data };
  return clone(store.programs[idx]);
}

export async function deleteProgram(id) {
  await delay();
  const store = getStore();
  store.programs = store.programs.filter((p) => p.id !== id);
  return { success: true };
}
