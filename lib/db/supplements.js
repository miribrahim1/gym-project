import { getStore } from "./store";
import { delay, clone, makeId, slugify } from "./helpers";

function withStockStatus(product) {
  const stockStatus = product.stock <= 0 ? "out-of-stock" : product.stock <= 10 ? "low-stock" : "in-stock";
  return { ...product, stockStatus };
}

export async function listSupplements({ category, search } = {}) {
  await delay();
  const store = getStore();
  let items = store.supplements.map(withStockStatus);
  if (category && category !== "all") items = items.filter((p) => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
  }
  return clone(items);
}

export async function getSupplementBySlug(slug) {
  await delay();
  const store = getStore();
  const product = store.supplements.find((p) => p.slug === slug);
  if (!product) return null;
  const related = store.supplements.filter((p) => product.relatedSlugs?.includes(p.slug)).map(withStockStatus);
  return clone({ ...withStockStatus(product), relatedProducts: related });
}

export async function listSupplementCategories() {
  await delay(80);
  const store = getStore();
  return [...new Set(store.supplements.map((p) => p.category))];
}

export async function createSupplement(data) {
  await delay();
  const store = getStore();
  const product = {
    id: makeId("sp"),
    slug: slugify(data.name),
    reviews: [],
    relatedSlugs: [],
    rating: 4.5,
    reviewsCount: 0,
    ...data,
  };
  store.supplements.unshift(product);
  return clone(product);
}

export async function updateSupplement(id, data) {
  await delay();
  const store = getStore();
  const idx = store.supplements.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  store.supplements[idx] = { ...store.supplements[idx], ...data };
  return clone(store.supplements[idx]);
}

export async function deleteSupplement(id) {
  await delay();
  const store = getStore();
  store.supplements = store.supplements.filter((p) => p.id !== id);
  return { success: true };
}

// --- Orders ---

export async function createOrder(data) {
  await delay(500);
  const store = getStore();
  for (const item of data.items) {
    const product = store.supplements.find((p) => p.slug === item.slug);
    if (!product || product.stock < item.qty) {
      return { success: false, error: `${item.name} no longer has enough stock available.` };
    }
  }
  data.items.forEach((item) => {
    const product = store.supplements.find((p) => p.slug === item.slug);
    if (product) product.stock -= item.qty;
  });

  const order = {
    id: makeId("ORD"),
    items: data.items,
    subtotal: data.subtotal,
    shipping: data.shipping,
    total: data.total,
    customer: data.customer,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store.orders.unshift(order);
  return { success: true, order: clone(order) };
}

export async function getOrderById(id) {
  await delay();
  const store = getStore();
  const order = store.orders.find((o) => o.id === id);
  return order ? clone(order) : null;
}

export async function listOrders({ status } = {}) {
  await delay();
  const store = getStore();
  let items = clone(store.orders);
  if (status && status !== "all") items = items.filter((o) => o.status === status);
  return items;
}

export async function updateOrderStatus(id, status) {
  await delay();
  const store = getStore();
  const order = store.orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  order.status = status;
  return clone(order);
}
