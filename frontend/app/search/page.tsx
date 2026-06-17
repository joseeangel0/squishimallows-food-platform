"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Product = { id: string; name: string; price: number; categories: { name: string } };

export default function SearchPage() {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const res  = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setSearched(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-orange-500">Squishimallows 🍜</Link>
        <Link href="/cart"><Button variant="outline" size="sm">🛒 Carrito</Button></Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Búsqueda</h1>
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="¿Qué quieres comer?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600 text-white">Buscar</Button>
        </div>

        {searched && results.length === 0 && (
          <p className="text-center text-gray-400">No se encontraron productos.</p>
        )}

        <div className="flex flex-col gap-3">
          {results.map((p) => (
            <div key={p.id} className="bg-white border rounded-xl px-4 py-3 flex items-center justify-between hover:shadow-sm transition">
              <div>
                <p className="font-medium text-gray-800">{p.name}</p>
                <p className="text-xs text-orange-500">{p.categories?.name}</p>
              </div>
              <span className="font-bold text-gray-900">${p.price} MXN</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
