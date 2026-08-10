import { getStore } from "./store";
import { delay, clone } from "./helpers";

export async function getSettings() {
  await delay(60);
  const store = getStore();
  return clone(store.settings);
}

export async function updateSettings(data) {
  await delay(300);
  const store = getStore();
  store.settings = { ...store.settings, ...data };
  return clone(store.settings);
}
