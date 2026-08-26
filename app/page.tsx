import {
  Car,
  Wrench,
  Truck,
  ShoppingBag,
  Brain,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import ServiceCard from "@/components/ui/ServiceCard";
import Button from "@/components/ui/Button";
import BusinessCard from "@/components/ui/BusinessCard";
import Navbar from "@/components/layout/Navbare";
import { businesses } from "@/data/businesses";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#0C3B2E]">
      
      {/* NAVBAR */}
      <Navbar active="home" />

      {/* CONTENIDO */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* SALUDO */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#6D9773]">
            BIENVENIDO A AUTOSOS
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            ¿Qué necesitas hoy?
          </h1>

          <p className="mt-2 max-w-xl text-gray-500">
            Encuentra talleres, grúas y repuestos cerca de ti o utiliza
            nuestro diagnóstico inteligente.
          </p>
        </div>

        {/* SERVICIOS RÁPIDOS */}
        <div className="grid gap-5 md:grid-cols-3">

          <ServiceCard
            icon={<Wrench size={25} />}
            title="Talleres"
            description="Encuentra talleres mecánicos cercanos."
            href="/servicios"
          />

          <ServiceCard
            icon={<Truck size={25} />}
            title="Grúas"
            description="Solicita asistencia y transporte para tu vehículo."
            href="/servicios"
          />

          <ServiceCard
            icon={<ShoppingBag size={25} />}
            title="Repuestos"
            description="Busca repuestos y accesorios disponibles."
            href="/servicios"
          />

        </div>

        {/* DIAGNÓSTICO IA */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-[#0C3B2E]">
          <div className="grid items-center md:grid-cols-2">

            <div className="p-8 md:p-10">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6D9773]">
                <Brain className="text-white" size={26} />
              </div>

              <p className="mb-2 text-sm font-semibold tracking-widest text-[#6D9773]">
                DIAGNÓSTICO INTELIGENTE
              </p>

              <h2 className="text-2xl font-bold text-white md:text-3xl">
                ¿Tu vehículo presenta algún problema?
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-gray-300">
                Describe los síntomas de tu vehículo y obtén un diagnóstico
                preliminar con posibles causas, nivel de urgencia y
                recomendaciones.
              </p>

              <Button
                variant="yellow"
                icon={<ChevronRight size={18} />}
                className="mt-6 px-6 py-3 font-bold"
              >
                Analizar vehículo
              </Button>

            </div>

            <div className="hidden h-full min-h-[300px] bg-[#092F25] md:flex md:items-center md:justify-center">
              <div className="text-center">
                <Brain
                  size={100}
                  strokeWidth={1}
                  className="mx-auto text-[#6D9773]"
                />

                <p className="mt-4 text-sm text-gray-400">
                  Diagnóstico preliminar mediante IA
                </p>
              </div>
            </div>

          </div>
        </div>
        {/* NEGOCIOS CERCANOS */}
        <div className="mt-10">

          <div className="mb-5">
            <p className="text-sm font-semibold tracking-wide text-[#6D9773]">
              CERCA DE TI
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Servicios recomendados
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Encuentra servicios para tu vehículo cerca de tu ubicación.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {businesses
              .filter((business) => business.type === "workshop")
              .slice(0, 3)
              .map((business) => (
                <BusinessCard
                  key={business.id}
                  id={business.id}
                  type={business.type}
                  name={business.name}
                  description={business.description}
                  rating={business.rating}
                  distance={business.distance}
                  location={business.location}
                />
              ))}

          </div>

        </div>
        {/* ACTIVIDAD */}
        <div className="mt-10">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Actividad reciente
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Tus últimos servicios y solicitudes
              </p>
            </div>

            <button className="text-sm font-semibold text-[#6D9773]">
              Ver historial
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F0E9]">
                  <Wrench size={20} className="text-[#0C3B2E]" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Servicio en Taller AutoMax
                  </h3>

                  <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Hoy
                    </span>

                    <span>•</span>

                    <span>Completado</span>
                  </div>
                </div>

              </div>

              <div className="text-right">
                <p className="font-bold text-[#0C3B2E]">
                  Bs. 250
                </p>

                <p className="mt-1 flex items-center justify-end gap-1 text-xs text-gray-400">
                  <MapPin size={12} />
                  La Paz
                </p>
              </div>

            </div>

          </div>
        </div>

      </section>
    </main>
  );
}


