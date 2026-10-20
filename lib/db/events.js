import { todayInIndia } from "../utils/dates";
import { getStore, withStoreTransaction } from "./store";
import { clone, makeId, slugify } from "./helpers";

export async function listEvents({ category } = {}) {
  const store = getStore();
  let items = clone(store.events);
  if (category && category !== "all") items = items.filter((e) => e.category === category);
  items.sort((a, b) => new Date(a.date) - new Date(b.date));
  return items;
}

export async function getEventBySlug(slug) {
  const store = getStore();
  const event = store.events.find((e) => e.slug === slug);
  return event ? clone(event) : null;
}

export async function registerForEvent({ eventSlug, name, email, phone, guests }) {
  return withStoreTransaction(() => {
    const store = getStore();
    const event = store.events.find((e) => e.slug === eventSlug);
    if (!event) return { success: false, error: "Event not found." };
    if (event.date < todayInIndia()) return { success: false, error: "Registration for this event has closed." };
    const requested = 1 + Number(guests || 0);
    if (event.seatsBooked + requested > event.seatsTotal) {
      return { success: false, error: "Not enough seats remaining for this event." };
    }
    const duplicate = store.eventRegistrations.find((r) => r.eventSlug === eventSlug && r.email === email && r.status !== "cancelled");
    if (duplicate) {
      return { success: false, error: "You are already registered for this event." };
    }
    const registration = {
      id: makeId("EVR"),
      eventSlug,
      eventName: event.name,
      name,
      email,
      phone,
      guests: Number(guests || 0),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    event.seatsBooked += requested;
    store.eventRegistrations.unshift(registration);
    return { success: true, registration: clone(registration) };
  });
}

export async function listEventRegistrations({ eventSlug } = {}) {
  const store = getStore();
  let items = clone(store.eventRegistrations);
  if (eventSlug) items = items.filter((r) => r.eventSlug === eventSlug);
  return items;
}

export async function createEvent(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const event = { id: makeId("ev"), slug: slugify(data.name), seatsBooked: 0, ...data };
    store.events.push(event);
    return clone(event);
  });
}

export async function updateEvent(id, data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const idx = store.events.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Event not found");
    store.events[idx] = { ...store.events[idx], ...data };
    return clone(store.events[idx]);
  });
}

export async function deleteEvent(id) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.events = store.events.filter((e) => e.id !== id);
    return { success: true };
  });
}
