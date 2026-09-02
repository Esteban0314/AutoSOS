"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Credenciales incorrectas o error en el inicio de sesión");
        return;
      }

      if (data.requiresVerification) {
        sessionStorage.setItem("verificationUserId", data.userId.toString());
        router.push("/verify");
      } else {
        router.push(data.user?.role === "ADMIN" ? "/admin" : "/");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setMessage("Ocurrió un error al conectar con el servidor de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0C3B2E] via-[#0F4C3A] to-[#07261D] flex items-center justify-center px-4 py-12 relative overflow-hidden text-[#0C3B2E] selection:bg-[#FFBA00] selection:text-[#0C3B2E]">
      {/* Background Ambient Glows */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#6D9773]/25 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#FFBA00]/20 blur-3xl pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-enter-scale">
        {/* LOGO & BRAND */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[#FFBA00] shadow-xl group-hover:scale-105 transition-transform">
              <Car size={26} />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">
              Auto<span className="text-[#FFBA00]">SOS</span>
            </span>
          </Link>

          <p className="text-sm text-gray-200 mt-2 font-medium">
            Ingresa a tu cuenta para gestionar tus asistencias y vehículos
          </p>
        </div>

        {/* CARD */}
        <Card className="shadow-2xl border-white/20 bg-white/95 backdrop-blur-md p-8 rounded-3xl">
          <div className="mb-6 border-b border-gray-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0C3B2E]">Iniciar sesión</h2>
              <p className="text-xs text-gray-500 mt-0.5">Ingresa tus credenciales registradas</p>
            </div>
            <ShieldCheck size={24} className="text-[#6D9773]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Correo electrónico"
              placeholder="ejemplo@correo.com"
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Error message */}
            {message && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-700 border border-red-200 animate-enter-scale">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{message}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              icon={<ArrowRight size={16} />}
              className="mt-2 font-bold shadow-md hover:shadow-[#6D9773]/25"
            >
              Continuar
            </Button>
          </form>

          {/* Footer Card */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            <span>¿Olvidaste tu contraseña o necesitas ayuda?</span>
            <div className="mt-2">
              <Link href="/" className="text-[#6D9773] font-bold hover:underline">
                Volver al inicio
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}