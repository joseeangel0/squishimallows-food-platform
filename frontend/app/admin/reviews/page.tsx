"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Review = { id: string; user_email: string; rating: number; comment: string | null; verified_purchase: boolean; created_at: string; products: { name: string } | null };

function Stars({ rating }: { rating: number }) {
  return <span className="text-rm-amber">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/reviews/all")
      .then((r) => r.json())
      .then((data) => { setReviews(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Reseñas</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Usuario</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Producto</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Rating</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Comentario</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Sin reseñas</td></tr>
            ) : reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-700">{r.user_email}</td>
                <td className="px-4 py-3 text-gray-700">{r.products?.name ?? "—"}</td>
                <td className="px-4 py-3"><Stars rating={r.rating} /></td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{r.comment ?? "—"}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(r.created_at).toLocaleDateString("es-MX")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => remove(r.id)}
                  >
                    Eliminar
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
