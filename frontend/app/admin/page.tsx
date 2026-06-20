import { createServiceClient } from "@/lib/supabase/service";

async function getMetrics() {
  const s = createServiceClient();
  const now = new Date();
  const todayStart  = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart   = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).toISOString();
  const monthStart  = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { data: revenue },
    { count: ordersToday },
    { count: ordersWeek },
    { count: ordersMonth },
    { count: totalProducts },
    { count: totalReviews },
    { data: topViewed },
    { data: topSold },
    { data: dailyOrders },
    { data: authUsers },
  ] = await Promise.all([
    s.from("orders").select("order_total"),
    s.from("orders").select("*", { count: "exact", head: true }).gte("completed_at", todayStart),
    s.from("orders").select("*", { count: "exact", head: true }).gte("completed_at", weekStart),
    s.from("orders").select("*", { count: "exact", head: true }).gte("completed_at", monthStart),
    s.from("products").select("*", { count: "exact", head: true }),
    s.from("reviews").select("*", { count: "exact", head: true }),
    s.rpc("top_viewed_products", { lim: 5 }),
    s.rpc("top_sold_products",   { lim: 5 }),
    s.from("orders").select("completed_at").gte("completed_at", weekStart).order("completed_at"),
    s.auth.admin.listUsers(),
  ]);

  const totalRevenue = (revenue ?? []).reduce((sum, o) => sum + Number(o.order_total), 0);
  const totalUsers   = authUsers?.users?.length ?? 0;

  const topViewedList = (topViewed ?? []) as { name: string; count: number }[];
  const topSoldList   = (topSold   ?? []) as { name: string; count: number }[];

  const dayMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    dayMap[d.toISOString().slice(0, 10)] = 0;
  }
  (dailyOrders ?? []).forEach((o: any) => {
    const day = o.completed_at.slice(0, 10);
    if (day in dayMap) dayMap[day]++;
  });
  const chartData = Object.entries(dayMap).map(([date, count]) => ({
    label: new Date(date + "T12:00:00").toLocaleDateString("es-MX", { weekday: "short", day: "numeric" }),
    count,
  }));

  return { totalRevenue, ordersToday: ordersToday ?? 0, ordersWeek: ordersWeek ?? 0, ordersMonth: ordersMonth ?? 0, totalProducts: totalProducts ?? 0, totalReviews: totalReviews ?? 0, totalUsers, topViewedList, topSoldList, chartData };
}

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default async function AdminOverview() {
  const { totalRevenue, ordersToday, ordersWeek, ordersMonth, totalProducts, totalReviews, totalUsers, topViewedList, topSoldList, chartData } = await getMetrics();
  const maxOrders = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Revenue total" value={`$${totalRevenue.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN`} />
        <MetricCard label="Órdenes hoy"    value={ordersToday}  />
        <MetricCard label="Esta semana"    value={ordersWeek}   />
        <MetricCard label="Este mes"       value={ordersMonth}  />
        <MetricCard label="Productos"      value={totalProducts} />
        <MetricCard label="Usuarios"       value={totalUsers}   />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Órdenes — últimos 7 días</h2>
        <div className="flex items-end gap-3 h-32">
          {chartData.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{d.count || ""}</span>
              <div
                className="w-full bg-rm-purple rounded-t-md transition-all"
                style={{ height: `${(d.count / maxOrders) * 100}%`, minHeight: d.count ? "4px" : "0" }}
              />
              <span className="text-xs text-gray-400 text-center leading-tight">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top viewed */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Más vistos</h2>
          {topViewedList.length === 0 ? <p className="text-sm text-gray-400">Sin datos</p> : (
            <ol className="flex flex-col gap-2">
              {topViewedList.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <span className="text-gray-400 w-4">{i + 1}.</span>{p.name}
                  </span>
                  <span className="font-semibold text-rm-purple">{p.count} vistas</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Top sold */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Más vendidos</h2>
          {topSoldList.length === 0 ? <p className="text-sm text-gray-400">Sin datos</p> : (
            <ol className="flex flex-col gap-2">
              {topSoldList.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <span className="text-gray-400 w-4">{i + 1}.</span>{p.name}
                  </span>
                  <span className="font-semibold text-rm-amber">{p.count} vendidos</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
