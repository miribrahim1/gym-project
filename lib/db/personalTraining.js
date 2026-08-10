import { getStore } from "./store";
import { delay, clone, makeId } from "./helpers";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_SLOTS = ["06:00", "07:00", "08:00", "09:00", "10:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

export async function getAvailability({ trainerSlug, date }) {
  await delay(250);
  const store = getStore();
  const trainer = store.trainers.find((t) => t.slug === trainerSlug);
  if (!trainer) return [];
  const dayName = DAY_NAMES[new Date(date).getDay()];
  if (!trainer.availability.includes(dayName)) return [];

  const bookedTimes = new Set(
    store.ptBookings
      .filter((b) => b.trainerSlug === trainerSlug && b.date === date && b.status !== "cancelled")
      .map((b) => b.time)
  );

  return TIME_SLOTS.map((time) => ({ time, available: !bookedTimes.has(time) }));
}

export async function bookPersonalTraining({ trainerSlug, date, time, name, email, phone, goal, notes }) {
  await delay(450);
  const store = getStore();
  const trainer = store.trainers.find((t) => t.slug === trainerSlug);
  if (!trainer) return { success: false, error: "Trainer not found." };

  const conflict = store.ptBookings.find(
    (b) => b.trainerSlug === trainerSlug && b.date === date && b.time === time && b.status !== "cancelled"
  );
  if (conflict) {
    return { success: false, error: "That slot was just booked by another member. Please choose a different time." };
  }

  const booking = {
    id: makeId("PT"),
    trainerSlug,
    trainerName: trainer.name,
    date,
    time,
    name,
    email,
    phone,
    goal,
    notes: notes || "",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  store.ptBookings.unshift(booking);
  return { success: true, booking: clone(booking) };
}

export async function listPersonalTrainingBookings({ status, trainerSlug } = {}) {
  await delay();
  const store = getStore();
  let items = clone(store.ptBookings);
  if (status && status !== "all") items = items.filter((b) => b.status === status);
  if (trainerSlug && trainerSlug !== "all") items = items.filter((b) => b.trainerSlug === trainerSlug);
  return items;
}

export async function updatePTBookingStatus(id, status) {
  await delay();
  const store = getStore();
  const booking = store.ptBookings.find((b) => b.id === id);
  if (!booking) throw new Error("Booking not found");
  booking.status = status;
  return clone(booking);
}
