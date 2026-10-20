import { getStore, withStoreTransaction } from "./store";
import { clone, makeId, slugify } from "./helpers";

function withStockStatus(product) {
  const stockStatus = product.stock <= 0 ? "out-of-stock" : product.stock <= 10 ? "low-stock" : "in-stock";
  return { ...product, stockStatus };
}

export async function listSupplements({ category, search } = {}) {
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
  const store = getStore();
  const product = store.supplements.find((p) => p.slug === slug);
  if (!product) return null;
  const related = store.supplements.filter((p) => product.relatedSlugs?.includes(p.slug)).map(withStockStatus);
  return clone({ ...withStockStatus(product), relatedProducts: related });
}

export async function listSupplementCategories() {
  const store = getStore();
  return [...new Set(store.supplements.map((p) => p.category))];
}

export async function createSupplement(data) {
  return withStoreTransaction(() => {
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
  });
}

export async function updateSupplement(id, data) {
  return withStoreTransaction(() => {
    const store = getStore();
    const idx = store.supplements.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Product not found");
    store.supplements[idx] = { ...store.supplements[idx], ...data };
    return clone(store.supplements[idx]);
  });
}

export async function deleteSupplement(id) {
  return withStoreTransaction(() => {
    const store = getStore();
    store.supplements = store.supplements.filter((p) => p.id !== id);
    return { success: true };
  });
}

// --- Orders ---

export async function createOrder(data) {
  return withStoreTransaction(() => {
    const store = getStore();
    if (!Array.isArray(data.items) || data.items.length === 0 || data.items.length > 100) {
      return { success: false, error: "Choose between 1 and 100 cart items." };
    }
    const quantities = new Map();
    for (const item of data.items) {
      if (!item || typeof item.slug !== "string" || !Number.isSafeInteger(item.qty) || item.qty < 1 || item.qty > 999) {
        return { success: false, error: "Cart quantities must be positive whole numbers (maximum 999)." };
      }
      quantities.set(item.slug, (quantities.get(item.slug) || 0) + item.qty);
    }
    const items = [];
    for (const [slug, qty] of quantities) {
      const product = store.supplements.find((p) => p.slug === slug);
      const price = product?.discountPrice ?? product?.price;
      if (!product || qty > 999 || product.stock < qty || !Number.isFinite(price) || price < 0) {
        return { success: false, error: "A product is unavailable or has insufficient stock. Please update your cart." };
      }
      items.push({ slug, qty, name: product.name, price });
    }
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= 2000 ? 0 : 99;
    for (const item of items) store.supplements.find((p) => p.slug === item.slug).stock -= item.qty;

    const order = {
      id: makeId("ORD"),
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      customer: data.customer,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    store.orders.unshift(order);
    return { success: true, order: clone(order) };
  });
}

export async function getOrderById(id) {
  const store = getStore();
  const order = store.orders.find((o) => o.id === id);
  return order ? clone(order) : null;
}

export async function listOrders({ status } = {}) {
  const store = getStore();
  let items = clone(store.orders);
  if (status && status !== "all") items = items.filter((o) => o.status === status);
  return items;
}

export async function updateOrderStatus(id, status) {
  return withStoreTransaction(() => {
    const store = getStore();
    const order = store.orders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    order.status = status;
    return clone(order);
  });
}
