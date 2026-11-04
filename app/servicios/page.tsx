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
import GoogleMapView from "@/components/map/GoogleMapView";

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
            {/* MAPA INTERACTIVO ESTILO GOOGLE MAPS */}
            <div className="sticky top-20">
              <GoogleMapView
                businesses={filteredBusinesses}
                selectedBusiness={selectedBusiness}
                onSelectBusiness={setSelectedBusiness}
              />
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