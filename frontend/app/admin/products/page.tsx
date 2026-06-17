"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Product = { id: string; name: string; price: number; is_available: boolean; categories: { name: string } | null };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  const load = () => {
    fetch("/api/products?all=1")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: string, current: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_available: !current }),
    });
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_available: !current } : p));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Categoría</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Precio</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.categories?.name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-700">${Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${p.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {p.is_available ? "Disponible" : "No disponible"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-gray-300 hover:border-rm-purple hover:text-rm-purple"
                    onClick={() => toggle(p.id, p.is_available)}
                  >
                    {p.is_available ? "Deshabilitar" : "Habilitar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
