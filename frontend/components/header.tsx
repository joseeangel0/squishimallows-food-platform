"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  cartCount?: number;
}

export function Header({ cartCount = 0 }: HeaderProps) {
  const router = useRouter();
  const [user, setUser]       = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        try {
          const res = await fetch("/api/admin/check");
          const { isAdmin } = await res.json();
          setIsAdmin(isAdmin);
        } catch {
          setIsAdmin(false);
        }
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setIsAdmin(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <Link href="/">
        <h1 className="text-2xl font-bold text-rm-purple">Raccoon Market 🦝</h1>
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/search" className="text-sm text-gray-600 hover:text-rm-purple transition-colors">
          Buscar
        </Link>

        <Link href="/cart">
          <Button variant="outline" size="sm" className="border-rm-purple text-rm-purple hover:bg-rm-purple hover:text-white transition-colors">
            🛒 Carrito
            {cartCount > 0 && (
              <span className="ml-2 bg-rm-amber text-black text-xs font-bold rounded-full px-1.5">{cartCount}</span>
            )}
          </Button>
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link href="/admin">
                <Button size="sm" variant="outline" className="text-xs border-rm-amber text-rm-amber hover:bg-rm-amber hover:text-black transition-colors">
                  Admin ⚙️
                </Button>
              </Link>
            )}
            <span className="text-xs text-gray-500 hidden sm:block truncate max-w-[160px]">{user.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500 transition-colors"
            >
              Salir
            </Button>
          </div>
        ) : (
          <Link href="/auth">
            <Button size="sm" className="bg-rm-purple hover:bg-rm-purple-hover text-white text-xs">
              Iniciar sesión
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
