import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Wrench,
  Store,
  Truck,
  ArrowRight,
  Brain,
  BarChart3,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LogoutButton from "@/components/ui/LogoutButton";
import Navbar from "@/components/layout/Navbare";

export default async function AdminPage() {
  let user;

  try {
    user = await requireAdmin();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        redirect("/login");
      }
      if (error.message === "FORBIDDEN") {
        redirect("/");
      }
    }
    throw error;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#0C3B2E]">
      {/* NAVBAR */}
      <Navbar />

      {/* HEADER HERO */}
      <div className="border-b border-[#145341] bg-gradient-to-r from-[#0C3B2E] via-[#0F4C3A] to-[#07261D] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="amber" size="sm" withDot pulseDot>
                Panel de Control
              </Badge>
              <span className="text-xs text-gray-300">AutoSOS Core Admin</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
              Bienvenido, {user.name}
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Monitorea y administra los servicios, usuarios y cobertura de la plataforma.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/reportes">
              <Button variant="yellow" size="sm" icon={<BarChart3 size={16} />}>
                Ver Reportes y Métricas
              </Button>
            </Link>

            <Link href="/admin/users">
              <Button variant="outline" size="sm" icon={<Users size={16} />} className="text-white border-white/30 hover:bg-white/10">
                Usuarios
              </Button>
            </Link>

            <LogoutButton
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition"
              showIcon
            />
          </div>
        </div>
      </div>

      {/* CONTENIDO DASHBOARD */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-10">
        {/* STATS GRID */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#6D9773]">
              Métricas Principales
            </h2>
            <span className="text-xs text-gray-400 font-semibold">Actualizado en tiempo real</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Usuarios"
              value="142"
              subtitle="Clientes y propietarios de autos"
              icon={<Users size={24} className="text-[#6D9773]" />}
              trend={{ value: "+14% este mes", isPositive: true }}
            />

            <StatCard
              title="Talleres"
              value="45"
              subtitle="Talleres mecánicos registrados"
              icon={<Wrench size={24} className="text-[#6D9773]" />}
              trend={{ value: "+4 nuevos", isPositive: true }}
            />

            <StatCard
              title="Grúas Activas"
              value="18"
              subtitle="Unidades de rescate 24/7"
              icon={<Truck size={24} className="text-[#6D9773]" />}
              trend={{ value: "100% operativas", isPositive: true }}
            />

            <StatCard
              title="Tiendas"
              value="30"
              subtitle="Locales de repuestos certificados"
              icon={<Store size={24} className="text-[#6D9773]" />}
              trend={{ value: "+2 esta semana", isPositive: true }}
            />
          </div>
        </div>

        {/* ACCESOS DIRECTOS Y GESTIÓN */}
        <div>
          <h2 className="text-base font-bold uppercase tracking-wider text-[#6D9773] mb-4">
            Herramientas de Administración
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gestión de Usuarios */}
            <Card hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0E9] text-[#0C3B2E] mb-4">
                  <Users size={24} className="text-[#6D9773]" />
                </div>
                <h3 className="text-lg font-bold text-[#0C3B2E]">
                  Gestión de Usuarios
                </h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Crea, edita, asigna roles de administración o cliente y gestiona accesos al sistema.
                </p>
              </div>

              <Link href="/admin/users" className="mt-6 block">
                <Button variant="outline" fullWidth icon={<ArrowRight size={15} />}>
                  Abrir lista de usuarios
                </Button>
              </Link>
            </Card>

            {/* Reportes y Analíticas */}
            <Card hoverEffect className="flex flex-col justify-between border-[#FFBA00]/40">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4D6] text-[#8C5D00] mb-4">
                  <BarChart3 size={24} className="text-[#FFBA00]" />
                </div>
                <h3 className="text-lg font-bold text-[#0C3B2E]">
                  Reportes y Métricas
                </h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Métricas en tiempo real, fallas diagnosticadas por IA y exportación a CSV/PDF.
                </p>
              </div>

              <Link href="/admin/reportes" className="mt-6 block">
                <Button variant="yellow" fullWidth icon={<ArrowRight size={15} />}>
                  Ver Analíticas
                </Button>
              </Link>
            </Card>

            {/* Gestión de Negocios */}
            <Card hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0E9] text-[#0C3B2E] mb-4">
                  <Wrench size={24} className="text-[#6D9773]" />
                </div>
                <h3 className="text-lg font-bold text-[#0C3B2E]">
                  Directorio de Negocios
                </h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Supervisa talleres mecánicos, servicios de grúa y repuestos con verificación de licencias.
                </p>
              </div>

              <Link href="/servicios" className="mt-6 block">
                <Button variant="outline" fullWidth icon={<ArrowRight size={15} />}>
                  Ver catálogo
                </Button>
              </Link>
            </Card>

            {/* Diagnóstico IA Monitor */}
            <Card hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0E9] text-[#0C3B2E] mb-4">
                  <Brain size={24} className="text-[#6D9773]" />
                </div>
                <h3 className="text-lg font-bold text-[#0C3B2E]">
                  Asistente IA AutoSOS
                </h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Revisa el motor de diagnóstico automotriz y las consultas en tiempo real.
                </p>
              </div>

              <Link href="/diagnostico" className="mt-6 block">
                <Button variant="outline" fullWidth icon={<ArrowRight size={15} />}>
                  Probar Asistente IA
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}