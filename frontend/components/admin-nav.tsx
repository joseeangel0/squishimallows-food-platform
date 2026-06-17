"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/admin",          label: "Overview",   icon: "📊" },
  { href: "/admin/products", label: "Productos",  icon: "🍽️" },
  { href: "/admin/orders",   label: "Órdenes",    icon: "🧾" },
  { href: "/admin/reviews",  label: "Reseñas",    icon: "⭐" },
  { href: "/admin/users",    label: "Usuarios",   icon: "👥" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push("/auth");
  };

  return (
    <aside className="w-52 min-h-screen bg-rm-purple text-white flex flex-col shrink-0">
      <div className="px-5 py-6 border-b border-white/10">
        <p className="font-bold text-lg">🦝 Raccoon</p>
        <p className="text-xs text-white/60 mt-0.5">Panel Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${active ? "bg-rm-amber text-black" : "text-white/80 hover:bg-white/10"}`}
            >
              <span>{icon}</span> {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-2">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors">
          ← Ir al sitio
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors text-left"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
