"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-orange-500">Squishimallows 🍜</Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tu carrito</h1>

        {/* Empty state skeleton */}
        <div className="bg-white border rounded-xl p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-sm">Tu carrito está vacío.</p>
          <Link href="/">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">Ver productos</Button>
          </Link>
        </div>

        <div className="mt-6 bg-white border rounded-xl p-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Subtotal</span><span>$0.00 MXN</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 text-lg border-t pt-2">
            <span>Total</span><span>$0.00 MXN</span>
          </div>
          <Link href="/order">
            <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white">Confirmar pedido</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
