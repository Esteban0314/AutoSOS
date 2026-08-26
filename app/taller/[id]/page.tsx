import Link from "next/link";

import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  Car,
} from "lucide-react";

import Navbar from "@/components/layout/Navbare";
import Button from "@/components/ui/Button";
import BusinessInfoRow from "@/components/ui/BusinessInfoRow";
import ServiceTag from "@/components/ui/ServiceTag";

interface TallerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TallerPage({
  params,
}: TallerPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#F8FAF8] text-[#0C3B2E]">

      {/* NAVBAR */}

      <Navbar active="services" />

      {/* CONTENIDO */}

      <section className="mx-auto max-w-6xl px-6 py-8">

        {/* VOLVER */}

        <Link
          href="/servicios"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0C3B2E]"
        >
          <ArrowLeft size={18} />
          Volver a servicios
        </Link>


        {/* PORTADA */}

        <div className="overflow-hidden rounded-3xl bg-[#0C3B2E]">

          <div className="flex min-h-[300px] items-center justify-center bg-[#0C3B2E]">

            <div className="text-center text-white">

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#6D9773]">
                <Car size={40} />
              </div>

              <p className="text-sm font-medium text-[#FFBA00]">
                TALLER MECÁNICO
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Taller AutoMax
              </h1>

              <div className="mt-3 flex items-center justify-center gap-4 text-sm text-gray-200">

                <span className="flex items-center gap-1.5">
                  <Star
                    size={16}
                    fill="#FFBA00"
                    className="text-[#FFBA00]"
                  />
                  4.8
                </span>

                <span>
                  126 reseñas
                </span>

                <span>
                  •
                </span>

                <span>
                  1.2 km
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* INFORMACIÓN PRINCIPAL */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

          {/* IZQUIERDA */}

          <div className="space-y-6">

            {/* DESCRIPCIÓN */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6">

              <h2 className="text-xl font-bold">
                Sobre el taller
              </h2>

              <p className="mt-3 leading-7 text-gray-500">
                Taller especializado en diagnóstico, mantenimiento
                y reparación general de vehículos. Nuestro equipo
                trabaja para ofrecer un servicio rápido y confiable.
              </p>

            </section>


            {/* SERVICIOS */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6">

              <h2 className="text-xl font-bold">
                Servicios disponibles
              </h2>

              <div className="mt-5 flex flex-wrap gap-3">

                <ServiceTag>
                  Cambio de aceite
                </ServiceTag>

                <ServiceTag>
                  Diagnóstico computarizado
                </ServiceTag>

                <ServiceTag>
                  Sistema de frenos
                </ServiceTag>

                <ServiceTag>
                  Mantenimiento
                </ServiceTag>

                <ServiceTag>
                  Motor
                </ServiceTag>

                <ServiceTag>
                  Suspensión
                </ServiceTag>

              </div>

            </section>


            {/* INFORMACIÓN */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6">

              <h2 className="text-xl font-bold">
                Información
              </h2>

              <div className="mt-3">

                <BusinessInfoRow
                  icon={<MapPin size={18} />}
                  label="Dirección"
                  value="Av. Principal #123, La Paz"
                />

                <BusinessInfoRow
                  icon={<Phone size={18} />}
                  label="Teléfono"
                  value="+591 70000000"
                />

                <BusinessInfoRow
                  icon={<Clock size={18} />}
                  label="Horario"
                  value="Lun - Sáb · 08:00 - 18:00"
                />

              </div>

            </section>

          </div>


          {/* DERECHA */}

          <aside>

            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              {/* ESTADO */}

              <div className="flex items-center gap-2 text-sm font-semibold text-[#6D9773]">

                <CheckCircle2 size={18} />

                Abierto ahora

              </div>


              <h2 className="mt-4 text-xl font-bold">
                ¿Necesitas ayuda con tu vehículo?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Solicita atención directamente con este taller.
              </p>


              <Button
                variant="yellow"
                className="mt-6 w-full py-3"
              >
                Solicitar servicio
              </Button>


              <Button
                variant="primary"
                className="mt-3 w-full"
              >
                Contactar taller
              </Button>


              <p className="mt-4 text-center text-xs text-gray-400">
                Puedes cancelar la solicitud antes de ser aceptada.
              </p>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}