"use client";
import { useState, useEffect } from "react";
import { logCartAdd } from "@/lib/tracking";

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
    const existing = cart.find((i) => i.id === product.id);
    const next = existing
      ? cart.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cart, { ...product, quantity: 1 }];
    save(next);
    const newCount = next.reduce((s, i) => s + i.quantity, 0);
    const newTotal = next.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
    logCartAdd(product.id, newCount, newTotal);
  };

  const removeItem = (id: string) => {
    save(cart.filter((i) => i.id !== id));
  };

  const clearCart = () => save([]);

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  return { cart, ready, addItem, removeItem, clearCart, total, count };
}
