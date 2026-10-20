import Database from "better-sqlite3";
import { mkdirSync, chmodSync } from "node:fs";
import path from "node:path";
import { clone } from "./helpers";
import * as seed from "./seed";

function createStore() {
  return {
    trainers: clone(seed.trainers),
    programs: clone(seed.programs),
    membershipPlans: clone(seed.membershipPlans),
    billingCycles: clone(seed.billingCycles),
    classDefinitions: clone(seed.classDefinitions),
    classSchedule: clone(seed.classSchedule),
    supplements: clone(seed.supplements),
    nutritionPlans: clone(seed.nutritionPlans),
    nutritionists: clone(seed.nutritionists),
    transformations: clone(seed.transformations),
    testimonials: clone(seed.testimonials),
    events: clone(seed.events),
    blogPosts: clone(seed.blogPosts),
    galleryImages: clone(seed.galleryImages),
    facilities: clone(seed.facilities),
    timeline: clone(seed.timeline),
    faqs: clone(seed.faqs),
    members: clone(seed.members),
    settings: clone(seed.defaultSettings),
    // Customer collections start empty and are persisted with the rest of the store.
    bookings: [],
    ptBookings: [],
    consultations: [],
    eventRegistrations: [],
    orders: [],
    enquiries: [],
    memberships: [],
  };
}

// SQLite transactions serialize read-modify-write across Node processes.
// The database directory must live on a persistent local volume.
const databases = new Map();
let activeStore;

function database() {
  const dir = process.env.GYM_DATA_DIR || path.join(process.cwd(), ".data");
  const file = path.join(dir, "gym.sqlite");
  if (!databases.has(file)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    const db = new Database(file, { timeout: 10000 });
    chmodSync(file, 0o600);
    db.pragma("journal_mode = WAL");
    db.pragma("synchronous = FULL");
    db.exec("CREATE TABLE IF NOT EXISTS application_state (id INTEGER PRIMARY KEY CHECK (id = 1), data TEXT NOT NULL)");
    db.prepare("INSERT OR IGNORE INTO application_state (id, data) VALUES (1, ?)").run(JSON.stringify(createStore()));
    databases.set(file, db);
  }
  return databases.get(file);
}

export function getStore() {
  return activeStore || JSON.parse(database().prepare("SELECT data FROM application_state WHERE id = 1").get().data);
}

export function withStoreTransaction(callback) {
  if (activeStore) return callback();
  const db = database();
  return db.transaction(() => {
    activeStore = JSON.parse(db.prepare("SELECT data FROM application_state WHERE id = 1").get().data);
    try {
      const result = callback();
      if (result && typeof result.then === "function") throw new Error("Store transactions must be synchronous");
      db.prepare("UPDATE application_state SET data = ? WHERE id = 1").run(JSON.stringify(activeStore));
      return result;
    } finally { activeStore = undefined; }
  }).immediate();
}
