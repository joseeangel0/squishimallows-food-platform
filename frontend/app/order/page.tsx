"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pedido confirmado!</h1>
        <p className="text-gray-500 text-sm mb-6">Tu orden fue recibida y está en preparación.</p>

        <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 mb-6">
          <div className="flex justify-between mb-1">
            <span>Número de orden</span><span className="font-mono text-gray-800">#—</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Estado</span><span className="text-green-600 font-medium">Confirmado</span>
          </div>
          <div className="flex justify-between">
            <span>Total</span><span className="font-bold text-gray-800">$0.00 MXN</span>
          </div>
        </div>

        <Link href="/">
          <Button className="w-full bg-rm-purple hover:bg-rm-purple-hover text-white">Volver al menú</Button>
        </Link>
      </div>
    </main>
  );
}
