import {
  Wrench,
  Truck,
  ShoppingBag,
  Brain,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import ServiceCard from "@/components/ui/ServiceCard";
import Button from "@/components/ui/Button";
import BusinessCard from "@/components/ui/BusinessCard";
import Navbar from "@/components/layout/Navbare";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import { businesses } from "@/data/businesses";

export default function Home() {
  const workshops = businesses.filter((b) => b.type === "workshop");

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#0C3B2E] flex flex-col justify-between selection:bg-[#6D9773] selection:text-white">
      {/* NAVBAR */}
      <Navbar active="home" />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-[#DCE7DE] bg-gradient-to-b from-[#0C3B2E] via-[#0F4C3A] to-[#07261D] text-white">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#6D9773]/20 blur-3xl pointer-events-none" />
          <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#FFBA00]/15 blur-3xl pointer-events-none" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
            <div className="max-w-3xl">
              {/* Top pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#FFBA00] backdrop-blur-md border border-white/15 shadow-inner">
                <Sparkles size={14} className="text-[#FFBA00] animate-spin" style={{ animationDuration: "6s" }} />
                <span>ASISTENCIA VEHICULAR INTELIGENTE EN BOLIVIA</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
                Tu auto en las mejores manos, <span className="text-[#FFBA00]">siempre</span>.
              </h1>

              <p className="mt-5 text-base sm:text-lg text-gray-200 leading-relaxed max-w-2xl font-normal">
                Encuentra talleres mecánicos certificados, auxilio de grúas en tiempo real y repuestos originales, o diagnostica fallas con nuestra IA avanzada.
              </p>

              {/* Quick Interactive Search Bar */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 rounded-2xl bg-white/95 p-2 shadow-2xl backdrop-blur-md border border-white/20 max-w-2xl">
                <div className="flex flex-1 items-center gap-3 px-3 py-2 text-gray-800">
                  <Search size={20} className="text-[#6D9773] shrink-0" />
                  <input
                    type="text"
                    placeholder="¿Qué servicio o repuesto necesitas hoy?"
                    className="w-full bg-transparent text-sm text-[#0C3B2E] placeholder:text-gray-400 outline-none font-medium"
                  />
                </div>

                <div className="hidden sm:flex items-center gap-2 border-l border-gray-200 px-3 text-xs text-gray-500 font-semibold">
                  <MapPin size={15} className="text-[#6D9773]" />
                  <span>La Paz, BO</span>
                </div>

                <Link href="/servicios" className="shrink-0">
                  <Button variant="yellow" size="md" fullWidth className="font-bold">
                    Buscar ahora
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#6D9773]" />
                  <span>Talleres 100% Verificados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[#FFBA00]" />
                  <span>Respuesta rápida 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-[#6D9773]" />
                  <span>Diagnóstico preliminar IA</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENIDO PRINCIPAL */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16">
          {/* SERVICIOS RÁPIDOS */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#6D9773]">
                  EXPLORAR CATEGORÍAS
                </p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C3B2E]">
                  Servicios disponibles
                </h2>
              </div>
              <p className="text-sm text-gray-500 max-w-md">
                Selecciona la categoría de atención que requieres para desplegar los negocios más cercanos.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <ServiceCard
                icon={<Wrench size={26} />}
                title="Talleres Mecánicos"
                description="Mantenimiento preventivo, frenos, motor, suspensión y escaneo computarizado."
                href="/servicios"
                badge="Más solicitado"
                count="+45 Talleres"
                gradient="forest"
              />

              <ServiceCard
                icon={<Truck size={26} />}
                title="Servicio de Grúas"
                description="Auxilio vial inmediato, rescate en carretera y transporte seguro para tu vehículo."
                href="/servicios"
                badge="24 Horas"
                count="+18 Grúas"
                gradient="amber"
              />

              <ServiceCard
                icon={<ShoppingBag size={26} />}
                title="Tiendas de Repuestos"
                description="Repuestos originales y alternativos certificados, aceites, baterías y accesorios."
                href="/servicios"
                count="+30 Tiendas"
                gradient="sage"
              />
            </div>
          </div>

          {/* DIAGNÓSTICO INTELIGENTE IA */}
          <div id="diagnostico" className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C3B2E] via-[#145341] to-[#07261D] text-white shadow-2xl border border-[#145341]">
            {/* Background Glow */}
            <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(#6D9773_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

            <div className="grid items-center lg:grid-cols-12 gap-8 p-8 sm:p-12 relative z-10">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#6D9773]/30 px-3.5 py-1 text-xs font-bold text-[#FFBA00] border border-[#6D9773]/40">
                  <Brain size={14} className="text-[#FFBA00] animate-pulse" />
                  <span>INTELIGENCIA ARTIFICIAL A BORDO</span>
                </div>

                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  ¿Tu vehículo hace un ruido extraño o se encendió un testigo?
                </h2>

                <p className="mt-4 text-sm sm:text-base text-gray-200 leading-relaxed">
                  Describe los síntomas de tu motor, frenos o sistema eléctrico en lenguaje natural. Nuestro asistente IA analizará el caso y te brindará una estimación de gravedad y posibles soluciones.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/diagnostico">
                    <Button
                      variant="yellow"
                      size="lg"
                      icon={<ChevronRight size={18} />}
                      className="font-extrabold shadow-xl hover:shadow-[#FFBA00]/30"
                    >
                      Diagnosticar mi vehículo
                    </Button>
                  </Link>

                  <a
                    href="tel:+59170000000"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition"
                  >
                    Hablar con un mecánico
                  </a>
                </div>
              </div>

              {/* Visual Card Mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-[#07261D]/80 p-6 border border-[#6D9773]/30 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-3 border-b border-[#145341] pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D9773] text-white">
                      <Brain size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-300">Diagnóstico preliminar</p>
                      <p className="text-xs text-[#6D9773] font-semibold">Listo para consultar</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5 text-xs text-gray-300">
                    <div className="rounded-xl bg-[#0C3B2E] p-3 border border-[#145341]">
                      <span className="font-semibold text-[#FFBA00]">Ejemplo de consulta:</span>
                      <p className="mt-1 text-gray-300 italic">
                        &quot;Siento una vibración en el pedal al frenar a más de 60 km/h&quot;
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#145341]/60 p-3 border border-[#6D9773]/20 text-gray-200">
                      <span className="font-semibold text-emerald-400">Resultado estimado:</span>
                      <p className="mt-1">
                        Posible deformación en discos de freno delanteros. Prioridad: Media.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NEGOCIOS CERCANOS */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#6D9773]">
                  TALLERES DESTACADOS
                </p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C3B2E]">
                  Recomendados en tu zona
                </h2>
              </div>

              <Link
                href="/servicios"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6D9773] hover:text-[#0C3B2E] transition"
              >
                <span>Ver todos los {businesses.length} servicios</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workshops.slice(0, 3).map((business) => (
                <BusinessCard
                  key={business.id}
                  id={business.id}
                  type={business.type}
                  name={business.name}
                  description={business.description}
                  rating={business.rating}
                  reviews={business.reviews}
                  distance={business.distance}
                  location={business.location}
                  isOpen={business.open}
                />
              ))}
            </div>
          </div>

          {/* ACTIVIDAD RECIENTE */}
          <div className="rounded-3xl border border-[#DCE7DE] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h3 className="text-xl font-bold text-[#0C3B2E]">
                  Actividad reciente de servicios
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tus últimas solicitudes de mantenimiento y asistencias
                </p>
              </div>

              <Link href="/perfil">
                <Button variant="outline" size="sm">
                  Ver historial completo
                </Button>
              </Link>
            </div>

            <div className="mt-6 divide-y divide-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0E9] text-[#0C3B2E] shadow-xs">
                    <Wrench size={22} className="text-[#6D9773]" />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-[#0C3B2E]">
                      Mantenimiento de Frenos en Taller AutoMax
                    </h4>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        Hoy a las 14:30
                      </span>
                      <span>•</span>
                      <Badge variant="sage" size="sm" withDot>
                        Completado
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between">
                  <p className="text-lg font-extrabold text-[#0C3B2E]">
                    Bs. 250
                  </p>
                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={12} />
                    La Paz
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}



