"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "ironvault_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    function hydrateFromStorage() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        // ignore corrupt local storage
      }
      setHydrated(true);
    }
    hydrateFromStorage();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.slug === product.slug);
      if (existing) {
        return current.map((i) => (i.slug === product.slug ? { ...i, qty: Math.min(i.qty + qty, product.stock ?? 99) } : i));
      }
      return [
        ...current,
        {
          slug: product.slug,
          name: product.name,
          price: product.discountPrice || product.price,
          tone: product.tone,
          image: product.image,
          category: product.category,
          stock: product.stock,
          qty,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((slug) => {
    setItems((current) => current.filter((i) => i.slug !== slug));
  }, []);

  const updateQty = useCallback((slug, qty) => {
    setItems((current) =>
      current
        .map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, Math.min(qty, i.stock ?? 99)) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = { items, addItem, removeItem, updateQty, clear, subtotal, count, hydrated };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
