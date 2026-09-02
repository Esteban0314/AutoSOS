import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Share2,
  Wrench,
  Truck,
  Store,
} from "lucide-react";

import Navbar from "@/components/layout/Navbare";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import BusinessInfoRow from "@/components/ui/BusinessInfoRow";
import ServiceTag from "@/components/ui/ServiceTag";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { businesses } from "@/data/businesses";

interface TallerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TallerPage({ params }: TallerPageProps) {
  const { id } = await params;
  const business = businesses.find((b) => b.id === id) || businesses[0];

  const businessTypeLabels = {
    workshop: "Taller Mecánico Certificado",
    tow: "Servicio de Grúa y Rescate",
    store: "Tienda Oficial de Repuestos",
  };

  const IconComponent =
    business.type === "workshop"
      ? Wrench
      : business.type === "tow"
      ? Truck
      : Store;

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#0C3B2E] flex flex-col justify-between selection:bg-[#6D9773] selection:text-white">
      {/* NAVBAR */}
      <Navbar active="services" />

      {/* CONTENIDO */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          {/* VOLVER & COMPARTIR */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#0C3B2E]"
            >
              <ArrowLeft size={18} />
              Volver al directorio de servicios
            </Link>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE7DE] bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 shadow-xs cursor-pointer"
            >
              <Share2 size={14} />
              Compartir
            </button>
          </div>

          {/* PORTADA PRINCIPAL HERO */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C3B2E] via-[#0F4C3A] to-[#07261D] text-white shadow-xl border border-[#145341]">
            {/* Ambient Background Glow */}
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#6D9773]/25 blur-3xl pointer-events-none" />
            <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-[#FFBA00]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-[#FFBA00] shadow-2xl">
                <IconComponent size={52} strokeWidth={1.7} />
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <Badge variant="amber" size="sm" withDot pulseDot={business.open}>
                    {business.open ? "Abierto ahora" : "Cerrado"}
                  </Badge>

                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold text-[#E8F0E9] border border-white/15">
                    <ShieldCheck size={14} className="text-[#6D9773]" />
                    {businessTypeLabels[business.type]}
                  </span>
                </div>

                <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {business.name}
                </h1>

                <p className="mt-2 text-sm text-gray-300 max-w-xl">
                  {business.description}
                </p>

                {/* Métricas rápidas */}
                <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-5 text-xs font-semibold text-gray-200">
                  <span className="flex items-center gap-1.5 rounded-lg bg-black/20 px-2.5 py-1 border border-white/10">
                    <Star size={14} fill="#FFBA00" className="text-[#FFBA00]" />
                    <strong className="text-white text-sm">{business.rating}</strong>
                    <span className="text-gray-300">({business.reviews} opiniones)</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-[#6D9773]" />
                    {business.distance} de distancia
                  </span>

                  <span>•</span>

                  <span>{business.location}, Bolivia</span>
                </div>
              </div>
            </div>
          </div>

          {/* INFORMACIÓN PRINCIPAL & PANEL LATERAL */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-start">
            {/* COLUMNA IZQUIERDA */}
            <div className="space-y-6">
              {/* SERVICIOS DISPONIBLES */}
              <Card>
                <h2 className="text-lg font-bold text-[#0C3B2E] border-b border-gray-100 pb-3">
                  Especialidades y Servicios
                </h2>

                <p className="mt-3 text-xs text-gray-500">
                  Selecciona cualquiera de las especialidades para solicitar una cotización estimada:
                </p>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {business.services.map((service, index) => (
                    <ServiceTag key={index} icon={<CheckCircle2 size={13} />}>
                      {service}
                    </ServiceTag>
                  ))}
                </div>
              </Card>

              {/* INFORMACIÓN DE CONTACTO Y HORARIOS */}
              <Card>
                <h2 className="text-lg font-bold text-[#0C3B2E] border-b border-gray-100 pb-3">
                  Información y Contacto
                </h2>

                <div className="mt-3 space-y-1">
                  <BusinessInfoRow
                    icon={<MapPin size={18} />}
                    label="Dirección física"
                    value={business.address}
                  />

                  <BusinessInfoRow
                    icon={<Phone size={18} />}
                    label="Teléfono / WhatsApp de atención"
                    value={business.phone}
                    action={
                      <a
                        href={`tel:${business.phone}`}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#6D9773] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#5b8361] transition"
                      >
                        Llamar
                      </a>
                    }
                  />

                  <BusinessInfoRow
                    icon={<Clock size={18} />}
                    label="Horario de atención"
                    value={business.schedule}
                  />
                </div>
              </Card>

              {/* GARANTÍA */}
              <div className="rounded-3xl border border-[#DCE7DE] bg-[#E8F0E9]/60 p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0C3B2E] text-white">
                  <ShieldCheck size={24} className="text-[#FFBA00]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0C3B2E]">
                    Garantía y Confianza AutoSOS
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    Todos los trabajos coordinados mediante AutoSOS cuentan con respaldo de repuestos y transparencia en precios.
                  </p>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: SOLICITAR ATENCIÓN */}
            <aside className="sticky top-20">
              <Card className="border-[#6D9773]/40 shadow-xl bg-gradient-to-b from-white to-[#F8FAF8]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-[#0C3B2E]">
                      Recepción Activa
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#6D9773]">
                    Turnos disponibles hoy
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#0C3B2E]">
                  Solicitar atención directa
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  Agenda una cita o solicita auxilio prioritario con este taller.
                </p>

                <div className="mt-6 space-y-3">
                  <Button
                    variant="yellow"
                    fullWidth
                    size="lg"
                    icon={<Calendar size={18} />}
                    className="font-extrabold shadow-md hover:shadow-[#FFBA00]/30"
                  >
                    Solicitar Turno / Cita
                  </Button>

                  <a href={`tel:${business.phone}`} className="block w-full">
                    <Button
                      variant="outline"
                      fullWidth
                      size="md"
                      icon={<Phone size={16} />}
                      className="border-[#DCE7DE] hover:border-[#6D9773]"
                    >
                      Llamar por teléfono
                    </Button>
                  </a>
                </div>

                <div className="mt-6 rounded-2xl bg-[#E8F0E9]/50 p-4 border border-[#DCE7DE] text-xs text-gray-600 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-[#0C3B2E]">
                    <CheckCircle2 size={14} className="text-[#6D9773]" />
                    <span>Sin cobros anticipados</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Pagas directamente en el taller una vez realizado el presupuesto o servicio.
                  </p>
                </div>
              </Card>
            </aside>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}