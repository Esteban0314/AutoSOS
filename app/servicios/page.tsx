"use client";

import { useState } from "react";
import {
  Search,
  Wrench,
  Truck,
  Store,
  MapPin,
  Star,
  ArrowRight,
  Layers,
  Navigation,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import BusinessCard, { BusinessType } from "@/components/ui/BusinessCard";
import Navbar from "@/components/layout/Navbare";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { businesses, Business } from "@/data/businesses";

export default function ServiciosPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | BusinessType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(businesses[0] || null);

  const filteredBusinesses = businesses.filter((b) => {
    const matchesCategory = activeCategory === "all" || b.type === activeCategory;
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.services.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const filterTabs: { id: "all" | BusinessType; label: string; icon: React.ReactNode; count: number }[] = [
    { id: "all", label: "Todos los servicios", icon: <Layers size={16} />, count: businesses.length },
    { id: "workshop", label: "Talleres mecánicos", icon: <Wrench size={16} />, count: businesses.filter(b => b.type === "workshop").length },
    { id: "tow", label: "Grúas 24/7", icon: <Truck size={16} />, count: businesses.filter(b => b.type === "tow").length },
    { id: "store", label: "Repuestos", icon: <Store size={16} />, count: businesses.filter(b => b.type === "store").length },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#0C3B2E] flex flex-col justify-between selection:bg-[#6D9773] selection:text-white">
      {/* HEADER */}
      <Navbar active="services" />

      {/* CONTENIDO */}
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          {/* UBICACIÓN & TITULAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6D9773]">
                DIRECTORIO GEO-LOCALIZADO
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C3B2E] mt-1">
                Servicios y Asistencia en tu zona
              </h1>
            </div>

            {/* Pill Ubicación Actual */}
            <div className="inline-flex items-center gap-3 rounded-2xl border border-[#DCE7DE] bg-white px-4 py-2.5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E]">
                <Navigation size={17} className="text-[#6D9773]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Tu Ubicación GPS</p>
                <p className="text-xs font-bold text-[#0C3B2E]">La Paz · Zona Central</p>
              </div>
              <Badge variant="sage" size="sm" withDot pulseDot className="ml-2">
                En vivo
              </Badge>
            </div>
          </div>

          {/* BUSCADOR Y FILTROS */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por taller, grúa, tipo de repuesto o falla..."
                className="h-12 w-full rounded-2xl border border-[#DCE7DE] bg-white pl-12 pr-4 text-sm text-[#0C3B2E] outline-none transition-all placeholder:text-gray-400 focus:border-[#6D9773] focus:ring-2 focus:ring-[#6D9773]/20 shadow-xs font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchTerm("");
                }}
                className="flex h-12 items-center gap-2 px-4 rounded-2xl border border-[#DCE7DE] bg-white text-xs font-bold text-gray-700 transition hover:bg-gray-50 shadow-xs cursor-pointer"
              >
                <SlidersHorizontal size={16} className="text-[#6D9773]" />
                <span>Restablecer</span>
              </button>
            </div>
          </div>

          {/* CHIPS DE CATEGORÍAS */}
          <div className="mb-8 flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {filterTabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#0C3B2E] text-white shadow-md shadow-[#0C3B2E]/15 scale-[1.02]"
                      : "border border-[#DCE7DE] bg-white text-gray-700 hover:border-[#6D9773] hover:bg-[#E8F0E9]/50 shadow-xs"
                  }`}
                >
                  <span className={isActive ? "text-[#FFBA00]" : "text-[#6D9773]"}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* MAPA + RESULTADOS */}
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
            {/* MAPA INTERACTIVO SIMULADO */}
            <div className="sticky top-20 rounded-3xl overflow-hidden border border-[#DCE7DE] bg-[#DCE7DE]/90 shadow-lg min-h-[580px] relative">
              {/* Topographic Background Simulation */}
              <div className="absolute inset-0 bg-[#E0EBE2] opacity-80" />

              {/* Map grid streets */}
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute left-[18%] top-0 h-full w-[4px] rotate-[18deg] bg-white shadow-sm" />
                <div className="absolute left-[48%] top-0 h-full w-[6px] -rotate-[12deg] bg-white shadow-sm" />
                <div className="absolute left-[78%] top-0 h-full w-[4px] rotate-[22deg] bg-white shadow-sm" />
                <div className="absolute left-0 top-[28%] h-[5px] w-full rotate-[6deg] bg-white shadow-sm" />
                <div className="absolute left-0 top-[62%] h-[4px] w-full -rotate-[5deg] bg-white shadow-sm" />
                <div className="absolute left-0 top-[80%] h-[3px] w-full rotate-[12deg] bg-white shadow-sm" />
              </div>

              {/* Top Floating Map Info Bar */}
              <div className="absolute left-4 top-4 right-4 z-20 flex items-center justify-between gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-md backdrop-blur-md border border-white/40">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D9773] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#6D9773]"></span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      MAPA DE COBERTURA EN VIVO
                    </p>
                    <p className="text-xs font-bold text-[#0C3B2E]">
                      {filteredBusinesses.length} servicios detectados
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                  <span className="hidden sm:inline">Haz clic en un marcador</span>
                </div>
              </div>

              {/* USER LOCATION MARKER */}
              <div
                className="absolute left-[48%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                title="Tu ubicación actual"
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-14 w-14 rounded-full bg-[#FFBA00]/30 animate-pulse-gold-radar" />
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFBA00] border-4 border-white shadow-xl">
                    <Navigation size={18} className="text-[#0C3B2E] fill-[#0C3B2E]" />
                  </div>
                </div>
              </div>

              {/* BUSINESS MARKERS */}
              {businesses.map((business, index) => {
                const positions = [
                  { left: "32%", top: "28%" }, // Sopocachi
                  { left: "74%", top: "32%" }, // Miraflores
                  { left: "28%", top: "68%" }, // San Pedro
                  { left: "78%", top: "62%" }, // Zona Central
                  { left: "44%", top: "18%" }, // Calacoto 15
                  { left: "84%", top: "44%" }, // Miraflores Busch
                  { left: "18%", top: "48%" }, // El Alto Autopista
                  { left: "62%", top: "78%" }, // Obrajes
                  { left: "38%", top: "42%" }, // San Jorge
                  { left: "52%", top: "64%" }, // Achumani
                  { left: "72%", top: "18%" }, // Cota Cota
                  { left: "22%", top: "32%" }, // Ciudad Satélite
                  { left: "66%", top: "36%" }, // Los Pinos
                  { left: "46%", top: "82%" }, // Calacoto 12
                ];
                const pos = positions[index % positions.length];
                const isSelected = selectedBusiness?.id === business.id;

                return (
                  <button
                    key={business.id}
                    onClick={() => setSelectedBusiness(business)}
                    style={{ left: pos.left, top: pos.top }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 cursor-pointer group ${
                      isSelected ? "scale-125 z-30" : "hover:scale-110"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`absolute h-12 w-12 rounded-full ${
                          isSelected ? "bg-[#6D9773]/40 animate-pulse-radar" : ""
                        }`}
                      />
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-white shadow-lg transition-colors ${
                          isSelected
                            ? "bg-[#0C3B2E] text-[#FFBA00]"
                            : "bg-[#6D9773] text-white group-hover:bg-[#0C3B2E]"
                        }`}
                      >
                        {business.type === "workshop" && <Wrench size={17} />}
                        {business.type === "tow" && <Truck size={17} />}
                        {business.type === "store" && <Store size={17} />}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* FLOATING SELECTED BUSINESS PREVIEW MODAL ON MAP */}
              {selectedBusiness && (
                <div className="absolute bottom-4 left-4 right-4 z-20 animate-enter-scale">
                  <div className="rounded-2xl border border-white/40 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0C3B2E] text-[#FFBA00] shadow-md">
                          {selectedBusiness.type === "workshop" && <Wrench size={22} />}
                          {selectedBusiness.type === "tow" && <Truck size={22} />}
                          {selectedBusiness.type === "store" && <Store size={22} />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#6D9773]">
                              {selectedBusiness.type === "workshop"
                                ? "Taller mecánico"
                                : selectedBusiness.type === "tow"
                                ? "Servicio de grúa"
                                : "Tienda de repuestos"}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-[#FFBA00]">
                              <Star size={13} fill="#FFBA00" />
                              {selectedBusiness.rating}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-[#0C3B2E]">
                            {selectedBusiness.name}
                          </h3>
                        </div>
                      </div>

                      <Link href={`/taller/${selectedBusiness.id}`}>
                        <Button variant="yellow" size="sm" icon={<ArrowRight size={14} />}>
                          Ver taller
                        </Button>
                      </Link>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2.5">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-[#6D9773]" />
                        {selectedBusiness.address}
                      </span>

                      <span className="font-semibold text-[#0C3B2E]">
                        {selectedBusiness.distance} de ti
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LISTA DE RESULTADOS */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0C3B2E]">
                    Negocios listados
                  </h2>
                  <p className="text-xs text-gray-500">
                    {filteredBusinesses.length} resultados encontrados
                  </p>
                </div>

                <Badge variant="sage" size="sm">
                  Orden: Más cercanos
                </Badge>
              </div>

              {filteredBusinesses.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#DCE7DE] bg-white p-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F0E9] text-[#0C3B2E] mx-auto mb-3">
                    <Search size={24} className="text-[#6D9773]" />
                  </div>
                  <h3 className="text-base font-bold text-[#0C3B2E]">
                    No se encontraron servicios
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Intenta buscar con otros términos o cambiar la categoría seleccionada.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setActiveCategory("all");
                      setSearchTerm("");
                    }}
                  >
                    Ver todos los servicios
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBusinesses.map((business) => (
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
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}