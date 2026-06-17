"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { cart, ready, removeItem, clearCart, total, count } = useCart();

  return (
    <main className="min-h-screen bg-gray-50">
      <Header cartCount={count} />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tu carrito</h1>

        {!ready ? null : cart.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-sm">Tu carrito está vacío.</p>
            <Link href="/">
              <Button className="mt-4 bg-rm-purple hover:bg-rm-purple-hover text-white">Ver productos</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-rm-purple-light shrink-0">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-2xl">🍽️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">${Number(item.price).toFixed(2)} MXN × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold text-gray-900">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Subtotal ({count} {count === 1 ? "producto" : "productos"})</span>
                <span>${total.toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg border-t pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)} MXN</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500"
                  onClick={clearCart}
                >
                  Vaciar
                </Button>
                <Link href="/order" className="flex-1">
                  <Button className="w-full bg-rm-purple hover:bg-rm-purple-hover text-white">Confirmar pedido</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
