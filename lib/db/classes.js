import { getStore } from "./store";
import { delay, clone, makeId, slugify } from "./helpers";

function enrich(store, session) {
  const def = store.classDefinitions.find((c) => c.slug === session.classSlug);
  const trainer = store.trainers.find((t) => t.slug === session.trainerSlug);
  return {
    ...session,
    className: def?.name || session.classSlug,
    difficulty: def?.difficulty || "All Levels",
    duration: def?.defaultDuration || 45,
    icon: def?.icon || "Dumbbell",
    trainerName: trainer?.name || "Unassigned",
    spotsLeft: Math.max(session.capacity - session.booked, 0),
    isFull: session.booked >= session.capacity,
  };
}

export async function listClassDefinitions() {
  await delay();
  const store = getStore();
  return clone(store.classDefinitions);
}

export async function getClassDefinitionBySlug(slug) {
  await delay();
  const store = getStore();
  const def = store.classDefinitions.find((c) => c.slug === slug);
  return def ? clone(def) : null;
}

export async function listSchedule({ day, classSlug, trainerSlug, difficulty } = {}) {
  await delay();
  const store = getStore();
  let items = store.classSchedule.map((s) => enrich(store, s));
  if (day && day !== "all") items = items.filter((s) => s.day === day);
  if (classSlug && classSlug !== "all") items = items.filter((s) => s.classSlug === classSlug);
  if (trainerSlug && trainerSlug !== "all") items = items.filter((s) => s.trainerSlug === trainerSlug);
  if (difficulty && difficulty !== "all") items = items.filter((s) => s.difficulty === difficulty);
  const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  items.sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day) || a.time.localeCompare(b.time));
  return clone(items);
}

export async function getSessionById(id) {
  await delay();
  const store = getStore();
  const session = store.classSchedule.find((s) => s.id === id);
  return session ? clone(enrich(store, session)) : null;
}

export async function bookClass({ sessionId, name, email, phone }) {
  await delay(400);
  const store = getStore();
  const session = store.classSchedule.find((s) => s.id === sessionId);
  if (!session) return { success: false, error: "Class session not found." };
  if (session.booked >= session.capacity) {
    return { success: false, error: "This class is fully booked. Please choose another slot." };
  }
  const duplicate = store.bookings.find(
    (b) => b.sessionId === sessionId && b.email === email && b.status !== "cancelled"
  );
  if (duplicate) {
    return { success: false, error: "You already have a booking for this class session." };
  }
  const booking = {
    id: makeId("BK"),
    type: "class",
    sessionId,
    className: store.classDefinitions.find((c) => c.slug === session.classSlug)?.name || session.classSlug,
    day: session.day,
    time: session.time,
    trainerSlug: session.trainerSlug,
    name,
    email,
    phone,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  session.booked += 1;
  store.bookings.unshift(booking);
  return { success: true, booking: clone(booking) };
}

export async function listBookings({ status, day, trainerSlug } = {}) {
  await delay();
  const store = getStore();
  let items = clone(store.bookings);
  if (status && status !== "all") items = items.filter((b) => b.status === status);
  if (day && day !== "all") items = items.filter((b) => b.day === day);
  if (trainerSlug && trainerSlug !== "all") items = items.filter((b) => b.trainerSlug === trainerSlug);
  return items;
}

export async function updateBookingStatus(id, status) {
  await delay();
  const store = getStore();
  const booking = store.bookings.find((b) => b.id === id);
  if (!booking) throw new Error("Booking not found");
  if (status === "cancelled" && booking.status !== "cancelled") {
    const session = store.classSchedule.find((s) => s.id === booking.sessionId);
    if (session) session.booked = Math.max(0, session.booked - 1);
  }
  booking.status = status;
  return clone(booking);
}

// --- Admin CRUD for class definitions & schedule sessions ---

export async function createClassDefinition(data) {
  await delay();
  const store = getStore();
  const def = { id: makeId("cd"), slug: slugify(data.name), ...data };
  store.classDefinitions.push(def);
  return clone(def);
}

export async function updateClassDefinition(id, data) {
  await delay();
  const store = getStore();
  const idx = store.classDefinitions.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Class not found");
  store.classDefinitions[idx] = { ...store.classDefinitions[idx], ...data };
  return clone(store.classDefinitions[idx]);
}

export async function deleteClassDefinition(id) {
  await delay();
  const store = getStore();
  store.classDefinitions = store.classDefinitions.filter((c) => c.id !== id);
  return { success: true };
}

export async function createSession(data) {
  await delay();
  const store = getStore();
  const session = { id: makeId("cs"), booked: 0, ...data };
  store.classSchedule.push(session);
  return clone(enrich(store, session));
}

export async function updateSession(id, data) {
  await delay();
  const store = getStore();
  const idx = store.classSchedule.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Session not found");
  store.classSchedule[idx] = { ...store.classSchedule[idx], ...data };
  return clone(enrich(store, store.classSchedule[idx]));
}

export async function deleteSession(id) {
  await delay();
  const store = getStore();
  store.classSchedule = store.classSchedule.filter((s) => s.id !== id);
  return { success: true };
}
