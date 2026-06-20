"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { useCart } from "@/lib/cart";

type Product = { id: string; name: string; price: number; image_url: string | null; categories: { name: string } };

export default function SearchPage() {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);
  const { addItem, count }      = useCart();

  const handleSearch = async () => {
    if (!query.trim()) return;
    const res  = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
    const data: Product[] = await res.json();
    setResults(data);
    setSearched(true);

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "search",
        query: query.trim(),
        results_count: data.length,
        used_search: true,
        completed_purchase: false,
      }),
    }).catch(() => {});
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header cartCount={count} />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Búsqueda</h1>
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="¿Qué quieres comer?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rm-purple"
          />
          <Button onClick={handleSearch} className="bg-rm-purple hover:bg-rm-purple-hover text-white">Buscar</Button>
        </div>

        {searched && results.length === 0 && (
          <p className="text-center text-gray-400">No se encontraron productos.</p>
        )}

        <div className="flex flex-col gap-3">
          {results.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:border-rm-purple hover:shadow-sm transition-all">
              <div>
                <p className="font-medium text-gray-900">{p.name}</p>
                <span className="inline-block bg-rm-amber text-black text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5">{p.categories?.name}</span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-bold text-gray-900">${Number(p.price).toFixed(2)} MXN</span>
                <Button
                  size="sm"
                  className="bg-rm-purple hover:bg-rm-purple-hover text-white"
                  onClick={() => addItem(p)}
                >
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
