import { getStore } from "./store";
import { delay, clone, makeId, slugify } from "./helpers";

export async function listPlans() {
  await delay();
  const store = getStore();
  return clone(store.membershipPlans);
}

export async function getPlanBySlug(slug) {
  await delay();
  const store = getStore();
  const plan = store.membershipPlans.find((p) => p.slug === slug);
  return plan ? clone(plan) : null;
}

export async function listBillingCycles() {
  await delay(80);
  const store = getStore();
  return clone(store.billingCycles);
}

export async function createPlan(data) {
  await delay();
  const store = getStore();
  const plan = { id: makeId("mp"), slug: slugify(data.name), features: [], highlighted: false, ...data };
  store.membershipPlans.push(plan);
  return clone(plan);
}

export async function updatePlan(id, data) {
  await delay();
  const store = getStore();
  const idx = store.membershipPlans.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Plan not found");
  store.membershipPlans[idx] = { ...store.membershipPlans[idx], ...data };
  return clone(store.membershipPlans[idx]);
}

export async function deletePlan(id) {
  await delay();
  const store = getStore();
  store.membershipPlans = store.membershipPlans.filter((p) => p.id !== id);
  return { success: true };
}

function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export async function createMembershipSignup(data) {
  await delay(400);
  const store = getStore();
  const plan = store.membershipPlans.find((p) => p.slug === data.planSlug);
  const cycle = store.billingCycles.find((c) => c.id === data.billingCycleId);
  const expiryDate = addMonths(data.startDate, cycle?.months || 1);

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
    price: data.price,
    createdAt: new Date().toISOString(),
    status: "active",
  };

  store.memberships.unshift(membership);

  // also register/refresh a member record so it appears in admin > members
  const existingMember = store.members.find((m) => m.email === data.email);
  if (existingMember) {
    Object.assign(existingMember, {
      planSlug: data.planSlug,
      startDate: data.startDate,
      expiryDate,
      fitnessGoal: data.fitnessGoal,
      status: "active",
    });
  } else {
    store.members.unshift({
      id: makeId("mb"),
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      planSlug: data.planSlug,
      startDate: data.startDate,
      expiryDate,
      fitnessGoal: data.fitnessGoal,
      trainerSlug: null,
      status: "active",
    });
  }

  return clone(membership);
}

export async function getMembershipById(id) {
  await delay();
  const store = getStore();
  const membership = store.memberships.find((m) => m.id === id);
  return membership ? clone(membership) : null;
}

export async function listMemberships() {
  await delay();
  const store = getStore();
  return clone(store.memberships);
}
