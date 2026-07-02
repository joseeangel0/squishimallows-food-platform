"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

type OrderResult = { id: string; order_total: number };

export default function OrderPage() {
  const { cart, clearCart } = useCart();
  const [order, setOrder]   = useState<OrderResult | null>(null);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (cart.length === 0) return;

    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setOrder(data);
        clearCart();
      })
      .catch(() => setError("Error al crear la orden. Intenta de nuevo."));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Algo salió mal</h1>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/cart">
            <Button className="w-full bg-rm-purple hover:bg-rm-purple-hover text-white">Volver al carrito</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Procesando tu pedido...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pedido confirmado!</h1>
        <p className="text-gray-500 text-sm mb-6">Tu orden fue recibida y está en preparación.</p>

        <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 mb-6">
          <div className="flex justify-between mb-1">
            <span>Número de orden</span>
            <span className="font-mono text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Estado</span>
            <span className="text-green-600 font-medium">Confirmado</span>
          </div>
          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-bold text-gray-800">${Number(order.order_total).toFixed(2)} MXN</span>
          </div>
        </div>

        <Link href="/">
          <Button className="w-full bg-rm-purple hover:bg-rm-purple-hover text-white">Volver al menú</Button>
        </Link>
      </div>
    </main>
  );
}
