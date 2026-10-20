import { getStore, withStoreTransaction } from "./store";
import { clone, makeId } from "./helpers";

export async function listMembers({ search, status, planSlug } = {}) {
  const store = getStore();
  let items = clone(store.members);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q));
  }
  if (status && status !== "all") items = items.filter((m) => m.status === status);
  if (planSlug && planSlug !== "all") items = items.filter((m) => m.planSlug === planSlug);
  return items;
}

export async function getMemberById(id) {
  const store = getStore();
  const member = store.members.find((m) => m.id === id);
  if (!member) return null;
  const bookings = store.bookings.filter((b) => b.email === member.email);
  const orders = store.orders.filter((o) => o.customer?.email === member.email);
  return clone({ ...member, bookings, orders });
}

export async function createMember(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const member = { id: makeId("mb"), status: "active", trainerSlug: null, notes: "", ...data };
    store.members.unshift(member);
    return clone(member);
  });
}

export async function updateMember(id, data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const idx = store.members.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Member not found");
    store.members[idx] = { ...store.members[idx], ...data };
    if (data.status) {
      const request = store.memberships.find((m) => m.email === store.members[idx].email && m.status === "pending");
      if (request) request.status = data.status;
    }
    return clone(store.members[idx]);
  });
}

export async function deleteMember(id) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.members = store.members.filter((m) => m.id !== id);
    return { success: true };
  });
}
