"use client";

import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ChangePasswordCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setStatus(null);
  };

  const handleToggle = () => {
    if (isOpen) {
      resetForm();
    }
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!currentPassword) {
      setStatus({
        type: "error",
        message: "Por favor ingresa tu contraseña actual.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({
        type: "error",
        message: "La nueva contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        type: "error",
        message: "La nueva contraseña y su confirmación no coinciden.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus({
          type: "error",
          message: data.message || "Error al actualizar la contraseña.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: data.message || "¡Contraseña actualizada con éxito!",
      });

      // Limpiar campos tras éxito
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Cerrar formulario tras 3 segundos
      setTimeout(() => {
        setIsOpen(false);
        setStatus(null);
      }, 3500);
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setStatus({
        type: "error",
        message: "Ocurrió un problema de conexión. Inténtalo nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-[#DCE7DE] shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0C3B2E]/10 text-[#0C3B2E]">
            <KeyRound size={22} className="text-[#0C3B2E]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0C3B2E]">
              Seguridad y Contraseña
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Gestiona o cambia la clave de acceso a tu cuenta
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant={isOpen ? "outline" : "yellow"}
          size="sm"
          onClick={handleToggle}
          icon={isOpen ? <ChevronUp size={16} /> : <Lock size={15} />}
        >
          {isOpen ? "Cerrar formulario" : "Cambiar contraseña"}
        </Button>
      </div>

      {!isOpen ? (
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE]/60 text-xs">
          <div className="flex items-center gap-2.5 text-gray-600">
            <ShieldCheck size={18} className="text-[#6D9773]" />
            <span>
              Contraseña protegida por cifrado criptográfico. Te recomendamos actualizar periódicamente tus credenciales.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-xs font-bold text-[#0C3B2E] hover:text-[#6D9773] transition shrink-0 ml-2"
          >
            Actualizar clave →
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-5 animate-enter-scale">
          {/* Banner explicativo para nuevos usuarios */}
          <div className="rounded-2xl bg-amber-50/80 p-4 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-[#FFBA00] text-[#0C3B2E] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              !
            </div>
            <div className="space-y-1">
              <p className="font-bold text-[#0C3B2E]">
                ¿Iniciaste sesión con la contraseña temporal que te llegó a tu correo?
              </p>
              <p className="text-gray-600 leading-relaxed">
                Ingresa esa clave provisional en el campo <strong>Contraseña actual</strong> y luego escribe tu nueva contraseña personal definitiva para mantener tu cuenta 100% protegida.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contraseña Actual */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-xs font-bold uppercase tracking-wider text-[#0C3B2E] mb-2"
              >
                Contraseña actual
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Tu clave actual o la temporal que llegó a tu correo"
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-11 py-3 text-sm text-gray-900 transition-all outline-none focus:border-[#6D9773] focus:ring-2 focus:ring-[#6D9773]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nueva Contraseña */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-xs font-bold uppercase tracking-wider text-[#0C3B2E] mb-2"
                >
                  Nueva contraseña
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none text-gray-400">
                    <KeyRound size={16} />
                  </div>
                  <input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-11 py-3 text-sm text-gray-900 transition-all outline-none focus:border-[#6D9773] focus:ring-2 focus:ring-[#6D9773]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Nueva Contraseña */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-bold uppercase tracking-wider text-[#0C3B2E] mb-2"
                >
                  Confirmar nueva contraseña
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none text-gray-400">
                    <KeyRound size={16} />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    minLength={6}
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-11 py-3 text-sm text-gray-900 transition-all outline-none focus:border-[#6D9773] focus:ring-2 focus:ring-[#6D9773]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mensajes de Feedback */}
            {status && (
              <div
                className={`flex items-center gap-3 rounded-2xl p-4 text-xs font-semibold animate-enter-scale ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleToggle}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={loading}
                icon={<Lock size={15} />}
              >
                Guardar nueva contraseña
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}
