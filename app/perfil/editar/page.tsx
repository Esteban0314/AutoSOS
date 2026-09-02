"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User as UserIcon, Phone, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Navbar from "@/components/layout/Navbare";
import Footer from "@/components/layout/Footer";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
};

export default function EditProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (!response.ok || !data.authenticated) {
          router.push("/login");
          return;
        }

        setUser(data.user);
        setName(data.user.name || "");
        setPhone(data.user.phone || "");
      } catch (error) {
        console.error("Error loading profile:", error);
        setMessage({ text: "Error al cargar la información del perfil", type: "error" });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage({ text: data.message || "Error al actualizar perfil", type: "error" });
        return;
      }

      setMessage({ text: "¡Perfil actualizado con éxito!", type: "success" });

      setTimeout(() => {
        router.push("/perfil");
        router.refresh();
      }, 900);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ text: "Error al actualizar perfil", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAF8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6D9773] border-t-transparent"></div>
          <p className="text-sm font-semibold text-[#0C3B2E]">Cargando tu perfil...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#0C3B2E] flex flex-col justify-between selection:bg-[#6D9773] selection:text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
          <Link
            href="/perfil"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#0C3B2E]"
          >
            <ArrowLeft size={16} />
            Regresar a Mi Perfil
          </Link>

          <Card className="shadow-xl border-[#DCE7DE] p-8">
            <div className="border-b border-gray-100 pb-5 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0C3B2E]">Editar Información</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Actualiza tus datos de contacto para recibir notificaciones
                </p>
              </div>

              <Badge variant="sage" withDot pulseDot>
                {user.role === "ADMIN"
                  ? "Administrador"
                  : user.role === "BUSINESS"
                  ? "Negocio"
                  : "Cliente"}
              </Badge>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="name"
                label="Nombre completo"
                icon={<UserIcon size={18} />}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                placeholder="Tu nombre completo"
              />

              <div>
                <Input
                  id="email"
                  label="Correo electrónico"
                  icon={<Mail size={18} />}
                  value={user.email}
                  disabled
                  helperText="El correo electrónico está protegido por seguridad."
                />
              </div>

              <Input
                id="phone"
                label="Número de teléfono / WhatsApp"
                icon={<Phone size={18} />}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 70000000"
                helperText="Utilizado por talleres y grúas para contactarte durante una solicitud."
              />

              {message && (
                <div
                  className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold transition animate-enter-scale ${
                    message.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle size={18} className="shrink-0 text-red-500" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Link href="/perfil" className="flex-1">
                  <Button variant="outline" fullWidth>
                    Cancelar
                  </Button>
                </Link>

                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                  className="flex-1"
                >
                  Guardar cambios
                </Button>
              </div>
            </form>
          </Card>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
