"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function VerifyPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleResend = async () => {
    try {
      setResending(true);
      setMessage("");
      setSuccessInfo("");

      const userId = sessionStorage.getItem("verificationUserId");
      if (!userId) {
        setMessage("Sesión expirada. Por favor vuelve a iniciar sesión.");
        return;
      }

      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId) }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error al reenviar el código");
      }

      setSuccessInfo("¡Nuevo código enviado con éxito a tu correo!");
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage(err instanceof Error ? err.message : "Error reenviando código");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const userId = sessionStorage.getItem("verificationUserId");

      if (!userId) {
        setMessage("No se encontró una sesión de verificación activa. Inicia sesión nuevamente.");
        return;
      }

      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Código incorrecto o expirado");
        return;
      }

      await refreshUser();
      sessionStorage.removeItem("verificationUserId");

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Ocurrió un error al verificar el código de seguridad");
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
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-[#FFBA00] shadow-xl">
            <KeyRound size={28} />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white mt-4">
            Verificación de Seguridad
          </h1>
          <p className="text-xs text-gray-200 mt-1 font-medium">
            Ingresa el código temporal de 6 dígitos
          </p>
        </div>

        <Card className="shadow-2xl border-white/20 bg-white/95 backdrop-blur-md p-8 rounded-3xl">
          <div className="mb-6 border-b border-gray-100 pb-4 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              Hemos enviado un código seguro de verificación de acceso a tu correo electrónico.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label
                htmlFor="code"
                className="block text-center text-xs font-bold uppercase tracking-wider text-[#0C3B2E] mb-3"
              >
                Código de 6 dígitos
              </label>

              <input
                id="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full rounded-2xl border border-[#DCE7DE] bg-white px-4 py-3.5 text-center text-3xl font-extrabold tracking-[0.4em] text-[#0C3B2E] outline-none transition-all placeholder:text-gray-300 focus:border-[#6D9773] focus:ring-4 focus:ring-[#6D9773]/20 shadow-inner"
                required
                autoFocus
              />
            </div>

            {/* Success Message */}
            {successInfo && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-enter-scale">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span>{successInfo}</span>
              </div>
            )}

            {/* Error Message */}
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
              disabled={loading || code.length !== 6}
              loading={loading}
              className="font-bold shadow-md hover:shadow-[#6D9773]/25"
            >
              Verificar código
            </Button>

            {/* Reenviar código */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || countdown > 0}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D9773] hover:text-[#0C3B2E] transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
                <span>
                  {countdown > 0
                    ? `Reenviar código en ${countdown}s`
                    : resending
                    ? "Enviando nuevo código..."
                    : "¿No recibiste el código? Reenviar al correo"}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D9773] hover:underline"
            >
              <ArrowLeft size={14} />
              <span>Volver a iniciar sesión</span>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}