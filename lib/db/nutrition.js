import { isBookableSlot, isValidDate } from "../utils/dates";
import { getStore, withStoreTransaction } from "./store";
import { clone, makeId, slugify } from "./helpers";

export async function createNutritionist(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const nutritionist = { id: makeId("nt"), slug: slugify(data.name), availability: [], ...data };
    store.nutritionists.push(nutritionist);
    return clone(nutritionist);
  });
}

export async function updateNutritionist(id, data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const idx = store.nutritionists.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error("Nutritionist not found");
    store.nutritionists[idx] = { ...store.nutritionists[idx], ...data };
    return clone(store.nutritionists[idx]);
  });
}

export async function deleteNutritionist(id) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.nutritionists = store.nutritionists.filter((n) => n.id !== id);
    return { success: true };
  });
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

export async function listNutritionPlans() {
  const store = getStore();
  return clone(store.nutritionPlans);
}

export async function getNutritionPlanBySlug(slug) {
  const store = getStore();
  const plan = store.nutritionPlans.find((p) => p.slug === slug);
  return plan ? clone(plan) : null;
}

export async function listNutritionists() {
  const store = getStore();
  return clone(store.nutritionists);
}

export async function getConsultationAvailability({ nutritionistSlug, date }) {
  const store = getStore();
  const nutritionist = store.nutritionists.find((n) => n.slug === nutritionistSlug);
  if (!nutritionist) return [];
  if (!isValidDate(date)) return [];
  const dayName = DAY_NAMES[new Date(`${date}T12:00:00Z`).getUTCDay()];
  if (!nutritionist.availability.includes(dayName)) return [];
  const bookedTimes = new Set(
    store.consultations
      .filter((c) => c.nutritionistSlug === nutritionistSlug && c.date === date && c.status !== "cancelled")
      .map((c) => c.time)
  );
  return TIME_SLOTS.map((time) => ({ time, available: isBookableSlot(date, time, nutritionist.availability, TIME_SLOTS) && !bookedTimes.has(time) }));
}

export async function bookConsultation({ nutritionistSlug, date, time, name, email, phone, goal }) {
  return withStoreTransaction(() => {
    const store = getStore();
    const nutritionist = store.nutritionists.find((n) => n.slug === nutritionistSlug);
    if (!nutritionist) return { success: false, error: "Nutritionist not found." };
    if (!isBookableSlot(date, time, nutritionist.availability, TIME_SLOTS)) return { success: false, error: "Choose an available future appointment during working hours." };
    const conflict = store.consultations.find(
      (c) => c.nutritionistSlug === nutritionistSlug && c.date === date && c.time === time && c.status !== "cancelled"
    );
    if (conflict) {
      return { success: false, error: "That slot was just booked. Please choose a different time." };
    }
    const consultation = {
      id: makeId("NC"),
      nutritionistSlug,
      nutritionistName: nutritionist.name,
      date,
      time,
      name,
      email,
      phone,
      goal,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    store.consultations.unshift(consultation);
    return { success: true, consultation: clone(consultation) };
  });
}

export async function listConsultations({ status } = {}) {
  const store = getStore();
  let items = clone(store.consultations);
  if (status && status !== "all") items = items.filter((c) => c.status === status);
  return items;
}

export async function updateConsultationStatus(id, status) {
  return withStoreTransaction(() => {
    const store = getStore();
    const consultation = store.consultations.find((c) => c.id === id);
    if (!consultation) throw new Error("Consultation not found");
    if (!["confirmed", "completed", "cancelled", "pending"].includes(status)) throw new Error("Invalid appointment status");
    if (consultation.status === "cancelled" && status !== "cancelled" && store.consultations.some((other) => other.id !== id && other.nutritionistSlug === consultation.nutritionistSlug && other.date === consultation.date && other.time === consultation.time && other.status !== "cancelled")) throw new Error("This appointment slot is already occupied");
    consultation.status = status;
    return clone(consultation);
  });
}

export async function createNutritionPlan(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const plan = { id: makeId("np"), slug: slugify(data.name), sampleMeals: [], mealTiming: [], ...data };
    store.nutritionPlans.push(plan);
    return clone(plan);
  });
}

export async function updateNutritionPlan(id, data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const idx = store.nutritionPlans.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Plan not found");
    store.nutritionPlans[idx] = { ...store.nutritionPlans[idx], ...data };
    return clone(store.nutritionPlans[idx]);
  });
}

export async function deleteNutritionPlan(id) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.nutritionPlans = store.nutritionPlans.filter((p) => p.id !== id);
    return { success: true };
  });
}
