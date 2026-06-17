import { createServiceClient } from "@/lib/supabase/service";

export default async function AdminUsers() {
  const s = createServiceClient();
  const { data } = await s.auth.admin.listUsers({ perPage: 100 });
  const users = data?.users ?? [];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Usuarios <span className="text-base font-normal text-gray-400">({users.length})</span></h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Confirmado</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Registro</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Último acceso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Sin usuarios</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-900 font-medium">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${u.email_confirmed_at ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {u.email_confirmed_at ? "Confirmado" : "Pendiente"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(u.created_at).toLocaleDateString("es-MX")}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
