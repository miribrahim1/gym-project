import { getStore } from "./store";
import { delay, clone, makeId } from "./helpers";

export async function createEnquiry(data) {
  await delay(400);
  const store = getStore();
  const enquiry = { id: makeId("MSG"), status: "new", createdAt: new Date().toISOString(), ...data };
  store.enquiries.unshift(enquiry);
  return clone(enquiry);
}

export async function listEnquiries({ status } = {}) {
  await delay();
  const store = getStore();
  let items = clone(store.enquiries);
  if (status && status !== "all") items = items.filter((e) => e.status === status);
  return items;
}

export async function updateEnquiryStatus(id, status) {
  await delay();
  const store = getStore();
  const enquiry = store.enquiries.find((e) => e.id === id);
  if (!enquiry) throw new Error("Message not found");
  enquiry.status = status;
  return clone(enquiry);
}
