"use client";
import { useState, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

const KEY = "rm_cart";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = localStorage.getItem(KEY);
        if (stored) setCart(JSON.parse(stored));
      } catch {}
      setReady(true);
    };
    load();
  }, []);

  const save = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem(KEY, JSON.stringify(items));
  };

  const addItem = (product: { id: string; name: string; price: number; image_url: string | null }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const next = existing
        ? prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...product, quantity: 1 }];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const next = prev.filter((i) => i.id !== id);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => save([]);

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  return { cart, ready, addItem, removeItem, clearCart, total, count };
}
