import { clone } from "./helpers";
import * as seed from "./seed";

// A single in-memory store shared across the server process. Using
// `globalThis` keeps state alive across Next.js dev-server hot reloads so
// admin CRUD actions feel persistent during a demo session. This is a mock
// data layer only — restarting the server resets everything back to seed.
const GLOBAL_KEY = "__ironvault_store__";

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
    // runtime-only collections (empty at boot, populated by user actions)
    bookings: [],
    ptBookings: [],
    consultations: [],
    eventRegistrations: [],
    orders: [],
    enquiries: [],
    memberships: [],
  };
}

export function getStore() {
  if (!globalThis[GLOBAL_KEY]) {
    globalThis[GLOBAL_KEY] = createStore();
  }
  return globalThis[GLOBAL_KEY];
}
