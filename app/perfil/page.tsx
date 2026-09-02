import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Car,
  Plus,
  ArrowRight,
  Edit3,
} from "lucide-react";
import { requireAuth } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Navbar from "@/components/layout/Navbare";
import Footer from "@/components/layout/Footer";

export default async function PerfilPage() {
  let user;

  try {
    user = await requireAuth();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        redirect("/login");
      }
      if (error.message === "FORBIDDEN") {
        redirect("/");
      }
    }
    redirect("/login");
  }

  const roleLabel =
    user.role === "ADMIN"
      ? "Administrador del Sistema"
      : user.role === "BUSINESS"
      ? "Cuenta Comercial"
      : "Conductor / Cliente";

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#0C3B2E] flex flex-col justify-between selection:bg-[#6D9773] selection:text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENIDO */}
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-8">
          {/* HEADER PERFIL HERO */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C3B2E] via-[#0F4C3A] to-[#07261D] text-white p-8 sm:p-10 shadow-xl border border-[#145341]">
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                {/* Avatar */}
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[#FFBA00] text-[#0C3B2E] text-4xl font-extrabold shadow-2xl border-4 border-white/20">
                  {user.name.charAt(0).toUpperCase()}
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-400" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Badge variant="amber" size="sm" withDot pulseDot>
                      {roleLabel}
                    </Badge>
                    <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs text-gray-200 border border-white/15">
                      AutoSOS Miembro
                    </span>
                  </div>

                  <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                    {user.name}
                  </h1>

                  <p className="mt-1 text-sm text-gray-300 font-medium">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Botón Editar Perfil */}
              <Link href="/perfil/editar">
                <Button variant="yellow" size="sm" icon={<Edit3 size={15} />}>
                  Editar perfil
                </Button>
              </Link>
            </div>
          </div>

          {/* INFORMACIÓN PERSONAL */}
          <Card>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#0C3B2E]">Información personal</h2>
                <p className="text-xs text-gray-500 mt-0.5">Datos asociados a tu cuenta de AutoSOS</p>
              </div>

              <Link href="/perfil/editar" className="text-xs font-bold text-[#6D9773] hover:underline">
                Actualizar datos
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE]/60">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <UserIcon size={14} className="text-[#6D9773]" />
                  <span>Nombre</span>
                </div>
                <p className="mt-2 font-bold text-sm text-[#0C3B2E]">{user.name}</p>
              </div>

              <div className="rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE]/60">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <Mail size={14} className="text-[#6D9773]" />
                  <span>Correo</span>
                </div>
                <p className="mt-2 font-bold text-sm text-[#0C3B2E] truncate">{user.email}</p>
              </div>

              <div className="rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE]/60">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <Phone size={14} className="text-[#6D9773]" />
                  <span>Teléfono</span>
                </div>
                <p className="mt-2 font-bold text-sm text-[#0C3B2E]">{user.phone || "No registrado"}</p>
              </div>

              <div className="rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE]/60">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <Shield size={14} className="text-[#6D9773]" />
                  <span>Rol</span>
                </div>
                <p className="mt-2 font-bold text-sm text-[#0C3B2E]">{roleLabel}</p>
              </div>
            </div>
          </Card>

          {/* MIS VEHÍCULOS / GARAGE */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F0E9] text-[#0C3B2E]">
                  <Car size={22} className="text-[#6D9773]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0C3B2E]">Mi Garage de Vehículos</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Registra tus autos para agilizar cotizaciones y diagnósticos automáticos
                  </p>
                </div>
              </div>

              <Link href="/perfil/editar">
                <Button variant="primary" size="sm" icon={<Plus size={15} />}>
                  Agregar vehículo
                </Button>
              </Link>
            </div>

            {/* Garage Empty State / Preview */}
            <div className="mt-6 rounded-2xl border-2 border-dashed border-[#DCE7DE] bg-[#F8FAF8]/60 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#E8F0E9] text-[#0C3B2E] mb-3 shadow-xs">
                <Car size={28} className="text-[#6D9773]" />
              </div>
              <h3 className="text-base font-bold text-[#0C3B2E]">
                Aún no tienes vehículos vinculados
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Al vincular la placa, marca y modelo de tu auto, los talleres mecánicos podrán brindarte diagnósticos y repuestos exactos sin demoras.
              </p>
              <Link href="/servicios" className="inline-block mt-4">
                <Button variant="outline" size="sm" icon={<ArrowRight size={14} />}>
                  Explorar talleres para mi auto
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}