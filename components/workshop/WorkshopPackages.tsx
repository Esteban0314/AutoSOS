"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Sparkles, Phone, MessageSquare, ShieldCheck, Car, Truck } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ServicePackage } from "@/data/businesses";

type VehicleSize = "small" | "medium" | "large";

interface WorkshopPackagesProps {
  packages: ServicePackage[];
  workshopName: string;
  workshopPhone: string;
  workshopWhatsapp?: string;
}

export default function WorkshopPackages({
  packages,
  workshopName,
  workshopPhone,
  workshopWhatsapp,
}: WorkshopPackagesProps) {
  const [selectedSize, setSelectedSize] = useState<VehicleSize>("medium");

  const sizeOptions = [
    {
      id: "small" as VehicleSize,
      label: "Auto Pequeño",
      sublabel: "Hatchbacks & Compactos",
      examples: "Suzuki Swift/Alto, Hyundai i10, Toyota Yaris",
      icon: <Car size={18} />,
    },
    {
      id: "medium" as VehicleSize,
      label: "Auto Mediano",
      sublabel: "Sedanes & SUVs Medianas",
      examples: "Toyota Corolla, Suzuki Vitara, Nissan Versa",
      icon: <Car size={20} />,
    },
    {
      id: "large" as VehicleSize,
      label: "Auto Grande / 4x4",
      sublabel: "Camionetas, Pickups & Vans",
      examples: "Toyota Hilux, Land Cruiser, Nissan Patrol",
      icon: <Truck size={20} />,
    },
  ];

  const getPackagePrice = (pkg: ServicePackage) => {
    switch (selectedSize) {
      case "small":
        return pkg.priceSmall;
      case "large":
        return pkg.priceLarge;
      case "medium":
      default:
        return pkg.priceMedium;
    }
  };

  const getSelectedSizeLabel = () => {
    switch (selectedSize) {
      case "small":
        return "Auto Pequeño (Hatchback/Compacto)";
      case "large":
        return "Auto Grande (Camioneta/4x4/Pickup)";
      case "medium":
      default:
        return "Auto Mediano (Sedán/SUV)";
    }
  };

  const cleanPhone = (workshopWhatsapp || workshopPhone).replace(/\D/g, "");

  return (
    <div className="space-y-6">
      <Card className="border-[#6D9773]/30 shadow-md bg-white">
        {/* TÍTULO Y DESCRIPCIÓN */}
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E]">
              <Sparkles size={16} className="text-[#6D9773]" />
            </span>
            <h2 className="text-xl font-black text-[#0C3B2E]">
              Paquetes de Mantenimiento con Precios Transparentes
            </h2>
          </div>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
            Los precios de repuestos, lubricantes y mano de obra varían según la capacidad del motor y volumen del vehículo. Selecciona el tamaño de tu auto para ver el costo exacto:
          </p>
        </div>

        {/* SELECTOR DE TAMAÑO DE VEHÍCULO */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
            Paso 1: Selecciona el tamaño de tu vehículo
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sizeOptions.map((opt) => {
              const isSelected = selectedSize === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedSize(opt.id)}
                  className={`flex flex-col p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#0C3B2E] bg-[#0C3B2E] text-white shadow-md scale-[1.02]"
                      : "border-[#DCE7DE] bg-[#F8FAF8] hover:border-[#6D9773] hover:bg-white text-[#0C3B2E]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`p-2 rounded-xl ${
                        isSelected ? "bg-white/15 text-[#FFBA00]" : "bg-[#E8F0E9] text-[#6D9773]"
                      }`}
                    >
                      {opt.icon}
                    </span>
                    {isSelected && (
                      <span className="rounded-full bg-[#FFBA00] px-2 py-0.5 text-[10px] font-extrabold text-[#0C3B2E]">
                        Activo
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm">{opt.label}</h4>
                  <p className={`text-xs mt-0.5 font-semibold ${isSelected ? "text-emerald-100" : "text-gray-500"}`}>
                    {opt.sublabel}
                  </p>
                  <p className={`text-[11px] mt-1.5 line-clamp-1 italic ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                    {opt.examples}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* LISTADO DE PAQUETES */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Paso 2: Elige el paquete deseado
            </h3>
            <span className="text-xs font-bold text-[#6D9773] bg-[#E8F0E9] px-2.5 py-1 rounded-lg">
              Precios calculados para: <strong>{getSelectedSizeLabel()}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => {
              const currentPrice = getPackagePrice(pkg);
              const whatsappMessage = encodeURIComponent(
                `Hola ${workshopName}, deseo solicitar el "${pkg.name}" (Precio: ${currentPrice} Bs.) para mi vehículo tamaño ${getSelectedSizeLabel()}. ¿Tienen turno disponible?`
              );

              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-3xl border p-5 transition-all flex flex-col justify-between ${
                    pkg.isPopular
                      ? "border-[#6D9773] bg-gradient-to-b from-white to-[#F8FAF8] shadow-md ring-1 ring-[#6D9773]/30"
                      : "border-[#DCE7DE] bg-white shadow-xs hover:border-[#6D9773]"
                  }`}
                >
                  <div>
                    {/* Header Paquete */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        {pkg.isPopular && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFBA00] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#0C3B2E] mb-2 shadow-xs">
                            <Sparkles size={11} />
                            Más Solicitado
                          </span>
                        )}
                        <h4 className="text-base font-extrabold text-[#0C3B2E]">
                          {pkg.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-semibold">
                            <Clock size={13} className="text-[#6D9773]" />
                            {pkg.durationEstimate}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-gray-400">{pkg.category}</span>
                        </div>
                      </div>

                      {/* Precio Destacado */}
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-black text-[#0C3B2E] tracking-tight">
                          {currentPrice}{" "}
                          <span className="text-xs font-bold text-[#6D9773]">Bs.</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">
                          Mano de obra + repuestos
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Incluye */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        El paquete incluye:
                      </p>
                      <ul className="space-y-1.5">
                        {pkg.includes.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                            <CheckCircle2 size={14} className="text-[#6D9773] shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant={pkg.isPopular ? "yellow" : "primary"}
                        fullWidth
                        size="sm"
                        icon={<MessageSquare size={14} />}
                        className="font-bold shadow-xs"
                      >
                        Reservar {currentPrice} Bs.
                      </Button>
                    </a>

                    <a href={`tel:${workshopPhone}`}>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCE7DE] bg-white text-gray-600 hover:text-[#0C3B2E] hover:border-[#6D9773] transition cursor-pointer"
                        title="Llamar al taller para coordinar"
                      >
                        <Phone size={14} />
                      </button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Garantía y transparencia */}
        <div className="mt-6 rounded-2xl bg-[#E8F0E9]/60 p-4 border border-[#DCE7DE] flex items-center gap-3 text-xs text-gray-600">
          <ShieldCheck size={20} className="text-[#6D9773] shrink-0" />
          <p>
            <strong>Transparencia AutoSOS:</strong> Todos los paquetes son cotizados a precio cerrado. En caso de detectarse fallas adicionales durante la revisión, el taller te solicitará aprobación antes de realizar cualquier cambio.
          </p>
        </div>
      </Card>
    </div>
  );
}
