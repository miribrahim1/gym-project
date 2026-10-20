import { getStore, withStoreTransaction } from "./store";
import { clone, makeId, slugify } from "./helpers";

export async function listPrograms({ difficulty } = {}) {
  const store = getStore();
  let items = clone(store.programs);
  if (difficulty && difficulty !== "all") {
    items = items.filter((p) => p.difficulty === difficulty);
  }
  return items;
}

export async function getProgramBySlug(slug) {
  const store = getStore();
  const program = store.programs.find((p) => p.slug === slug);
  return program ? clone(program) : null;
}

export async function createProgram(data) {
  return withStoreTransaction(() => {
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
  });
}

export async function updateProgram(id, data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const idx = store.programs.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Program not found");
    store.programs[idx] = { ...store.programs[idx], ...data };
    return clone(store.programs[idx]);
  });
}

export async function deleteProgram(id) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.programs = store.programs.filter((p) => p.id !== id);
    return { success: true };
  });
}
