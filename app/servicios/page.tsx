import {
  ArrowLeft,
  MapPin,
  Search,
  SlidersHorizontal,
  Wrench,
  Truck,
  Store,
  Navigation,
} from "lucide-react";

import BusinessCard from "@/components/ui/BusinessCard";
import Navbar from "@/components/layout/Navbare";
import { businesses } from "@/data/businesses";

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF8] text-[#0C3B2E]">

      {/* HEADER */}
      <Navbar active="services" />

      {/* CONTENIDO */}
      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* UBICACIÓN */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#DCE7DE] bg-white p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0E9]">
              <Navigation
                size={19}
                className="text-[#0C3B2E]"
              />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Tu ubicación
              </p>

              <p className="text-sm font-semibold">
                La Paz, Bolivia
              </p>
            </div>

          </div>

          <button className="text-sm font-semibold text-[#6D9773]">
            Cambiar
          </button>

        </div>


        {/* BUSCADOR */}
        <div className="mb-6 flex gap-3">

          <div className="relative flex-1">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Buscar talleres, grúas o repuestos..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#6D9773]"
            />

          </div>

          <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50">
            <SlidersHorizontal size={19} />
          </button>

        </div>


        {/* FILTROS */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-1">

          <FilterButton
            icon={<Store size={17} />}
            label="Todos"
            active
          />

          <FilterButton
            icon={<Wrench size={17} />}
            label="Talleres"
          />

          <FilterButton
            icon={<Truck size={17} />}
            label="Grúas"
          />

          <FilterButton
            icon={<Store size={17} />}
            label="Repuestos"
          />

        </div>


        {/* MAPA + RESULTADOS */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

          {/* MAPA SIMULADO */}
          <div className="relative min-h-[550px] overflow-hidden rounded-3xl bg-[#DCE7DE]">

            {/* CUADRÍCULA DEL MAPA */}
            <div className="absolute inset-0 opacity-30">

              <div className="absolute left-[15%] top-0 h-full w-[2px] rotate-[20deg] bg-white" />

              <div className="absolute left-[45%] top-0 h-full w-[3px] -rotate-[15deg] bg-white" />

              <div className="absolute left-[75%] top-0 h-full w-[2px] rotate-[25deg] bg-white" />

              <div className="absolute left-0 top-[30%] h-[3px] w-full rotate-[8deg] bg-white" />

              <div className="absolute left-0 top-[65%] h-[2px] w-full -rotate-[6deg] bg-white" />

            </div>


            {/* TEXTO DEL MAPA */}
            <div className="absolute left-6 top-6 rounded-xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur">

              <p className="text-xs font-medium text-gray-500">
                MAPA
              </p>

              <p className="text-sm font-bold text-[#0C3B2E]">
                Servicios en tu zona
              </p>

            </div>


            {/* UBICACIÓN DEL USUARIO */}
            <MapMarker
              className="left-[47%] top-[48%]"
              current
            />

            {/* NEGOCIOS */}
            <MapMarker
              className="left-[24%] top-[30%]"
            />

            <MapMarker
              className="left-[70%] top-[28%]"
            />

            <MapMarker
              className="left-[32%] top-[72%]"
            />

            <MapMarker
              className="left-[78%] top-[67%]"
            />


            {/* BOTÓN UBICACIÓN */}
            <button className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-md">
              <Navigation
                size={19}
                className="text-[#0C3B2E]"
              />
            </button>

          </div>


          {/* LISTA */}
          <div>

            <div className="mb-4 flex items-end justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Cerca de ti
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  12 servicios encontrados
                </p>
              </div>

              <button className="text-sm font-semibold text-[#6D9773]">
                Ordenar
              </button>

            </div>


            <div className="space-y-5">

                {businesses.map((business) => (
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

        </div>

      </section>

    </main>
  );
}


/* FILTRO REUTILIZABLE */

function FilterButton({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-[#0C3B2E] text-white"
          : "border border-gray-200 bg-white text-gray-600 hover:border-[#6D9773]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}


/* MARCADOR DEL MAPA */

function MapMarker({
  className = "",
  current = false,
}: {
  className?: string;
  current?: boolean;
}) {
  return (
    <div
      className={`absolute ${className} flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white shadow-lg ${
        current ? "bg-[#FFBA00]" : "bg-[#6D9773]"
      }`}
    >
      {current ? (
        <Navigation
          size={17}
          className="text-[#0C3B2E]"
          fill="#0C3B2E"
        />
      ) : (
        <MapPin
          size={18}
          className="text-white"
          fill="#6D9773"
        />
      )}
    </div>
  );
}