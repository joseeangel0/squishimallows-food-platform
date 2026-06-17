import { createServiceClient } from "@/lib/supabase/service";

type OrderItem = {
  quantity: number;
  unit_price: number;
  products: { name: string } | null;
};

type Order = {
  id: string;
  order_total: number;
  status: string;
  completed_at: string;
  order_items: OrderItem[];
};

export default async function AdminOrders() {
  const s = createServiceClient();
  const { data: orders } = await s
    .from("orders")
    .select("id, order_total, status, completed_at, order_items(quantity, unit_price, products(name))")
    .order("completed_at", { ascending: false })
    .limit(50);

  const statusColor: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    pending:   "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Órdenes</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">ID</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Productos</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Total</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Estado</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(orders ?? []).length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Sin órdenes</td></tr>
            ) : (orders as Order[] ?? []).map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.id.slice(0, 8)}…</td>
                <td className="px-4 py-3 text-gray-700">
                  {(o.order_items ?? []).map((i) => `${i.products?.name} ×${i.quantity}`).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">${Number(o.order_total).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(o.completed_at).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
