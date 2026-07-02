"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { ProductModal } from "@/components/product-modal";
import { useCart } from "@/lib/cart";
import { initTracking } from "@/lib/tracking";

type Product = { id: string; name: string; price: number; description: string; image_url: string | null; images: string[] | null; categories: { name: string } };
type Category = { id: string; name: string; slug: string };

export default function CatalogPage() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activecat, setActivecat]   = useState("");
  const [search, setSearch]         = useState("");
  const { addItem, count } = useCart();
  const [selected, setSelected]     = useState<Product | null>(null);

  useEffect(() => { initTracking(); }, []);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams();
      if (activecat) params.set("category", activecat);
      if (search)    params.set("search", search);
      fetch(`/api/products?${params}`).then((r) => r.json()).then(setProducts);
    }, 300);
    return () => clearTimeout(id);
  }, [activecat, search]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header cartCount={count} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-rm-purple"
        />

        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setActivecat("")}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${!activecat ? "bg-rm-purple text-white border-rm-purple" : "bg-white text-gray-600 border-gray-300 hover:border-rm-purple hover:text-rm-purple"}`}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActivecat(c.id)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${activecat === c.id ? "bg-rm-purple text-white border-rm-purple" : "bg-white text-gray-600 border-gray-300 hover:border-rm-purple hover:text-rm-purple"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2 hover:shadow-md hover:border-rm-purple transition-all cursor-pointer"
            >
              <div className="relative rounded-lg h-32 overflow-hidden bg-rm-purple-light">
                {p.image_url ? (
                  <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl">🍽️</div>
                )}
              </div>
              <span className="inline-block w-fit bg-rm-amber text-black text-xs font-semibold px-2 py-0.5 rounded-full">{p.categories?.name}</span>
              <h2 className="font-semibold text-gray-900">{p.name}</h2>
              <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="font-bold text-gray-900">${p.price} MXN</span>
                <Button
                  size="sm"
                  className="bg-rm-purple hover:bg-rm-purple-hover text-white"
                  onClick={(e) => { e.stopPropagation(); addItem(p); }}
                >
                  Agregar
                </Button>
              </div>
            </div>
          ))}
        </div>

        <ProductModal
          key={selected?.id ?? ""}
          product={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
          onAddToCart={addItem}
        />
      </div>
    </main>
  );
}
