"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        setMessage(data.message || "Error al iniciar sesión");
        return;
      }

      if (data.requiresVerification) {
        // Guardamos temporalmente el ID para verificar el código
        sessionStorage.setItem(
          "verificationUserId",
          data.userId.toString()
        );

        router.push("/verify");
      }
    } catch (error) {
      console.error(error);

      setMessage("Ocurrió un error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0C3B2E]">
            AutoSOS
          </h1>

          <p className="text-gray-500 mt-2">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Card */}
        <div className="border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0C3B2E] mb-6">
            Iniciar sesión
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#0C3B2E] mb-2"
              >
                Correo electrónico
              </label>

              <input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                        w-full
                        border
                        border-gray-300
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                        focus:border-[#6D9773]
                        text-gray-900
                        bg-white
                    "
                    required
                />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#0C3B2E] mb-2"
              >
                Contraseña
              </label>

              <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                        w-full
                        border
                        border-gray-300
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                        focus:border-[#6D9773]
                        text-gray-900
                        bg-white
                        dark:text-gray-900
                        dark:bg-white
                    "
                    required
                />
            </div>

            {/* Mensaje */}
            {message && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {message}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
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
              {loading
                ? "Verificando..."
                : "Continuar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            ¿No tienes una cuenta?
            <button
              type="button"
              className="ml-1 text-[#6D9773] font-semibold hover:underline"
            >
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}