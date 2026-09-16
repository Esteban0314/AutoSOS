"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Building2,
  MapPin,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import Card from "@/components/ui/Card";

type AccountType = "CUSTOMER" | "BUSINESS";

export default function RegisterPage() {
  const router = useRouter();

  const [accountType, setAccountType] = useState<AccountType>("CUSTOMER");

  // Campos comunes
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Campos específicos de Negocio
  const [businessType, setBusinessType] = useState<"workshop" | "tow" | "store">("workshop");
  const [businessAddress, setBusinessAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden", type: "error" });
      return;
    }

    if (password.length < 6) {
      setMessage({ text: "La contraseña debe tener al menos 6 caracteres", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role: accountType,
          businessType: accountType === "BUSINESS" ? businessType : undefined,
          businessAddress: accountType === "BUSINESS" ? businessAddress : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage({
          text: data.message || "Error al crear la cuenta. Inténtalo de nuevo.",
          type: "error",
        });
        return;
      }

      if (data.requiresVerification && data.userId) {
        sessionStorage.setItem("verificationUserId", data.userId.toString());
        router.push("/verify");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setMessage({
        text: "Error al conectar con el servidor. Por favor revisa tu conexión.",
        type: "error",
      });
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

      <div className="w-full max-w-xl relative z-10 animate-enter-scale">
        {/* LOGO & BRAND */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[#FFBA00] shadow-xl group-hover:scale-105 transition-transform">
              <Car size={26} />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">
              Auto<span className="text-[#FFBA00]">SOS</span>
            </span>
          </Link>

          <p className="text-sm text-gray-200 mt-2 font-medium">
            Crea tu cuenta oficial y accede a la red de auxilio mecánico de Bolivia
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <Card className="shadow-2xl border-white/20 bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl">
          {/* SELECTOR DE TIPO DE CUENTA */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 text-center">
              Selecciona tu tipo de registro
            </p>

            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#F0F5F1] border border-[#DCE7DE]">
              <button
                type="button"
                onClick={() => {
                  setAccountType("CUSTOMER");
                  setMessage(null);
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  accountType === "CUSTOMER"
                    ? "bg-[#0C3B2E] text-white shadow-md"
                    : "text-gray-600 hover:text-[#0C3B2E] hover:bg-white/60"
                }`}
              >
                <Car size={16} className={accountType === "CUSTOMER" ? "text-[#FFBA00]" : "text-gray-400"} />
                <span>Cliente / Conductor</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAccountType("BUSINESS");
                  setMessage(null);
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  accountType === "BUSINESS"
                    ? "bg-[#0C3B2E] text-white shadow-md"
                    : "text-gray-600 hover:text-[#0C3B2E] hover:bg-white/60"
                }`}
              >
                <Building2 size={16} className={accountType === "BUSINESS" ? "text-[#FFBA00]" : "text-gray-400"} />
                <span>Negocio Automotriz</span>
              </button>
            </div>
          </div>

          {/* DESCRIPCIÓN DEL ROL */}
          <div className="mb-6 rounded-2xl bg-[#E8F0E9]/60 p-3.5 border border-[#DCE7DE] flex items-center gap-3 text-xs text-[#0C3B2E]">
            <ShieldCheck size={20} className="text-[#6D9773] shrink-0" />
            <p>
              {accountType === "CUSTOMER"
                ? "Registra tu cuenta personal para solicitar grúas, agendar citas en talleres y gestionar tus vehículos con Diagnóstico IA."
                : "Registra tu taller, servicio de grúa o tienda de repuestos para recibir solicitudes directas de conductores."}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* FORMULARIO CLIENTE O NEGOCIO */}
            {accountType === "CUSTOMER" ? (
              <>
                <Input
                  id="customer-name"
                  type="text"
                  label="Nombre y Apellido"
                  placeholder="Ej. Juan Pérez"
                  icon={<UserIcon size={18} />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="customer-email"
                    type="email"
                    label="Correo electrónico"
                    placeholder="juan@correo.com"
                    icon={<Mail size={18} />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Input
                    id="customer-phone"
                    type="tel"
                    label="Teléfono / WhatsApp"
                    placeholder="Ej. 70000000"
                    icon={<Phone size={18} />}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    id="business-type"
                    label="Especialidad Comercial"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as "workshop" | "tow" | "store")}
                  >
                    <option value="workshop">Taller Mecánico General</option>
                    <option value="tow">Servicio de Grúa y Auxilio 24/7</option>
                    <option value="store">Tienda de Repuestos y Accesorios</option>
                  </Select>

                  <Input
                    id="business-name"
                    type="text"
                    label="Nombre Comercial"
                    placeholder="Ej. AutoMax Taller"
                    icon={<Building2 size={18} />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="business-email"
                    type="email"
                    label="Correo electrónico corporativo"
                    placeholder="contacto@taller.com"
                    icon={<Mail size={18} />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Input
                    id="business-phone"
                    type="tel"
                    label="Teléfono de Emergencias / WhatsApp"
                    placeholder="Ej. 70000000"
                    icon={<Phone size={18} />}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <Input
                  id="business-address"
                  type="text"
                  label="Dirección Física"
                  placeholder="Av. Principal #123, Zona Sur, La Paz"
                  icon={<MapPin size={18} />}
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  required
                />
              </>
            )}

            {/* CONTRASEÑA Y CONFIRMACIÓN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <Input
                id="password"
                type="password"
                label="Contraseña"
                placeholder="Mínimo 6 caracteres"
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />

              <Input
                id="confirm-password"
                type="password"
                label="Confirmar Contraseña"
                placeholder="Repite tu contraseña"
                icon={<Lock size={18} />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {/* MENSAJES DE ERROR / ÉXITO */}
            {message && (
              <div
                className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-semibold border animate-enter-scale ${
                  message.type === "error"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                }`}
              >
                {message.type === "error" ? (
                  <AlertCircle size={16} className="shrink-0 text-red-500" />
                ) : (
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="yellow"
              fullWidth
              size="lg"
              loading={loading}
              icon={<ArrowRight size={16} />}
              className="mt-3 font-extrabold shadow-md hover:shadow-[#FFBA00]/30"
            >
              {accountType === "CUSTOMER" ? "Registrarme como Cliente" : "Registrar mi Negocio"}
            </Button>
          </form>

          {/* FOOTER DEL CARD */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            <span>¿Ya tienes una cuenta registrada?</span>
            <Link href="/login" className="ml-1 text-[#6D9773] font-bold hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
