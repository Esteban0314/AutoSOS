import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Star,
  ShieldCheck,
  Share2,
  Wrench,
  Truck,
  Store,
} from "lucide-react";

import Navbar from "@/components/layout/Navbare";
import Footer from "@/components/layout/Footer";
import BusinessInfoRow from "@/components/ui/BusinessInfoRow";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { businesses } from "@/data/businesses";
import StoreView from "@/components/store/StoreView";
import WorkshopView from "@/components/workshop/WorkshopView";
import TowView from "@/components/tow/TowView";

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
    tow: "Servicio de Grúa y Rescate 24/7",
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
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
          {/* VOLVER & COMPARTIR */}
          <div className="flex items-center justify-between">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#0C3B2E]"
            >
              <ArrowLeft size={18} />
              Volver al directorio de servicios
            </Link>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE7DE] bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 shadow-xs cursor-pointer"
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

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-10">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-[#FFBA00] shadow-2xl">
                <IconComponent size={48} strokeWidth={1.7} />
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

                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {business.name}
                </h1>

                <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
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

          {/* VISTA ESPECIALIZADA SEGÚN EL TIPO DE NEGOCIO */}
          {business.type === "store" && <StoreView business={business} />}
          {business.type === "workshop" && <WorkshopView business={business} />}
          {business.type === "tow" && <TowView business={business} />}

          {/* INFORMACIÓN DE CONTACTO Y UBICACIÓN FÍSICA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-base font-bold text-[#0C3B2E] border-b border-gray-100 pb-3">
                Ubicación y Horario de Atención
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
                  label="Horario habitual"
                  value={business.schedule}
                />
              </div>
            </Card>

            <Card className="bg-[#E8F0E9]/40 border-[#6D9773]/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 border-b border-[#DCE7DE] pb-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0C3B2E] text-white">
                    <ShieldCheck size={20} className="text-[#FFBA00]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0C3B2E]">
                      Garantía y Respaldo AutoSOS
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Compromiso con conductores y comercios en Bolivia
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Todas las transacciones y servicios coordinados mediante AutoSOS cuentan con soporte directo y verificación de licencias comerciales.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DCE7DE] flex items-center justify-between text-xs font-semibold text-[#0C3B2E]">
                <span>Establecimiento Verificado</span>
                <span className="text-[#6D9773] font-bold">100% Confiable</span>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
