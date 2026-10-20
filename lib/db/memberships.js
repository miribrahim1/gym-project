import { addMonthsClamped, isValidDate, todayInIndia } from "../utils/dates";
import { calculatePlanPrice } from "../utils/pricing";
import { getStore, withStoreTransaction } from "./store";
import { clone, makeId, slugify } from "./helpers";

export async function listPlans() {
  const store = getStore();
  return clone(store.membershipPlans);
}

export async function getPlanBySlug(slug) {
  const store = getStore();
  const plan = store.membershipPlans.find((p) => p.slug === slug);
  return plan ? clone(plan) : null;
}

export async function listBillingCycles() {
  const store = getStore();
  return clone(store.billingCycles);
}

export async function createPlan(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const plan = { id: makeId("mp"), slug: slugify(data.name), features: [], highlighted: false, ...data };
    store.membershipPlans.push(plan);
    return clone(plan);
  });
}

export async function updatePlan(id, data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const idx = store.membershipPlans.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Plan not found");
    store.membershipPlans[idx] = { ...store.membershipPlans[idx], ...data };
    return clone(store.membershipPlans[idx]);
  });
}

export async function deletePlan(id) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.membershipPlans = store.membershipPlans.filter((p) => p.id !== id);
    return { success: true };
  });
}

export async function createMembershipSignup(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const plan = store.membershipPlans.find((p) => p.slug === data.planSlug);
    const cycle = store.billingCycles.find((c) => c.id === data.billingCycleId);
    if (!plan || !cycle) return { success: false, error: "Choose an existing plan and billing cycle." };
    if (!isValidDate(data.startDate) || data.startDate < todayInIndia()) return { success: false, errors: { startDate: "Choose a valid date today or later." } };
    const expiryDate = addMonthsClamped(data.startDate, cycle.months);
    const price = calculatePlanPrice(plan.monthlyPrice, cycle).totalForCycle;

    const membership = {
      id: makeId("MEM"),
      planSlug: data.planSlug,
      planName: plan?.name || "Membership",
      billingCycleId: data.billingCycleId,
      billingLabel: cycle?.label || "Monthly",
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      fitnessGoal: data.fitnessGoal,
      startDate: data.startDate,
      expiryDate,
      price,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    store.memberships.unshift(membership);

    // Public requests cannot overwrite an existing member using only their email.
    if (!store.members.some((m) => m.email === data.email)) {
      store.members.unshift({ id: makeId("mb"), name: data.fullName, email: data.email,
        phone: data.phone, planSlug: data.planSlug, startDate: data.startDate,
        expiryDate, fitnessGoal: data.fitnessGoal, trainerSlug: null, status: "pending" });
    }

    return { success: true, membership: clone(membership) };
  });
}

export async function getMembershipById(id) {
  const store = getStore();
  const membership = store.memberships.find((m) => m.id === id);
  return membership ? clone(membership) : null;
}

export async function listMemberships() {
  const store = getStore();
  return clone(store.memberships);
}
