"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Product = { id: string; name: string; price: number; description: string; categories: { name: string } };
type Category = { id: string; name: string; slug: string };

export default function CatalogPage() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activecat, setActivecat]   = useState("");
  const [search, setSearch]         = useState("");
  const [cart, setCart]             = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activecat) params.set("category", activecat);
    if (search)    params.set("search", search);
    fetch(`/api/products?${params}`).then((r) => r.json()).then(setProducts);
  }, [activecat, search]);

  const addToCart = (product: Product) => setCart((prev) => [...prev, product]);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-orange-500">Squishimallows 🍜</h1>
        <div className="flex gap-4 items-center">
          <Link href="/search" className="text-sm text-gray-600 hover:text-orange-500">Buscar</Link>
          <Link href="/cart" className="relative">
            <Button variant="outline" size="sm">
              🛒 Carrito
              {cart.length > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-1.5">{cart.length}</span>
              )}
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />

        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setActivecat("")}
            className={`px-3 py-1 rounded-full text-sm border transition ${!activecat ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600"}`}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActivecat(c.id)}
              className={`px-3 py-1 rounded-full text-sm border transition ${activecat === c.id ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border p-4 flex flex-col gap-2 hover:shadow-md transition">
              <div className="bg-orange-50 rounded-lg h-32 flex items-center justify-center text-4xl">🍽️</div>
              <span className="text-xs text-orange-500 font-medium">{p.categories?.name}</span>
              <h2 className="font-semibold text-gray-800">{p.name}</h2>
              <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="font-bold text-gray-900">${p.price} MXN</span>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => addToCart(p)}>
                  Agregar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
