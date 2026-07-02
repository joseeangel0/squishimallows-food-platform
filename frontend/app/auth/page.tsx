"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const ALLOWED_DOMAIN = "@upy.edu.mx";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode]       = useState<"login" | "signup">("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.endsWith(ALLOWED_DOMAIN)) {
      setError(`Solo se permiten correos ${ALLOWED_DOMAIN}`);
      return false;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!validate()) return;

    setLoading(true);

    if (mode === "login") {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Correo o contraseña incorrectos");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } else {
      // El signup pasa por el servidor para que la restricción de dominio
      // se aplique aunque alguien intente saltarse la validación del cliente.
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al crear la cuenta");
        setLoading(false);
        return;
      }
      setMessage("Revisa tu correo institucional para confirmar tu cuenta.");
    }
    setLoading(false);
  };

  const switchMode = (next: "login" | "signup") => {
    setMode(next);
    setError("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-rm-purple text-center mb-1">Raccoon Market 🦝</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Acceso exclusivo {ALLOWED_DOMAIN}</p>

        <div className="flex border border-gray-200 rounded-lg mb-6 p-1 gap-1">
          <button
            onClick={() => switchMode("login")}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === "login" ? "bg-rm-purple text-white" : "text-gray-500 hover:text-rm-purple"}`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => switchMode("signup")}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === "signup" ? "bg-rm-purple text-white" : "text-gray-500 hover:text-rm-purple"}`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder={`correo${ALLOWED_DOMAIN}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rm-purple"
          />
          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rm-purple"
          />

          {error   && <p className="text-red-500 text-xs">{error}</p>}
          {message && <p className="text-green-600 text-xs">{message}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="bg-rm-purple hover:bg-rm-purple-hover text-white w-full mt-1 disabled:opacity-60"
          >
            {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>
      </div>
    </main>
  );
}
