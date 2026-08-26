"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function VerifyPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const userId = sessionStorage.getItem("verificationUserId");

      if (!userId) {
        setMessage(
          "No se encontró una sesión de verificación. Inicia sesión nuevamente."
        );
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
        setMessage(data.message || "Código incorrecto");
        return;
      }
      await refreshUser();

      // El código fue verificado correctamente
      sessionStorage.removeItem("verificationUserId");

      // Redirigir según el rol
      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);

      setMessage("Ocurrió un error al verificar el código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0C3B2E]">
            AutoSOS
          </h1>

          <p className="text-gray-500 mt-2">
            Verificación de seguridad
          </p>
        </div>

        {/* Card */}
        <div className="border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0C3B2E] mb-3">
            Ingresa tu código
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Introduce el código de 6 dígitos enviado a tu correo.
          </p>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-[#0C3B2E] mb-2"
              >
                Código de verificación
              </label>

              <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    className="
                        w-full
                        border
                        border-gray-300
                        rounded-lg
                        px-4
                        py-3
                        text-center
                        text-2xl
                        tracking-[0.5em]
                        outline-none
                        focus:border-[#6D9773]
                        text-gray-900
                        bg-white
                    "
                    required
                />
            </div>

            {/* Mensaje de error */}
            {message && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="
                w-full
                bg-[#6D9773]
                text-white
                py-3
                rounded-lg
                font-semibold
                transition
                hover:opacity-90
                disabled:opacity-50
              "
            >
              {loading ? "Verificando..." : "Verificar código"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full mt-5 text-sm text-[#6D9773] font-semibold hover:underline"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </main>
  );
}