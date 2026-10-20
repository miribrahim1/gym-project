import { getStore, withStoreTransaction } from "./store";
import { clone } from "./helpers";

export async function getSettings() {
  const store = getStore();
  return clone(store.settings);
}

export async function updateSettings(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.settings = { ...store.settings, ...data };
    return clone(store.settings);
  });
}
