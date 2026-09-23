"use client";

import { useState } from "react";
import {
  Truck,
  PhoneCall,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Compass,
} from "lucide-react";
import { Business } from "@/data/businesses";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface TowViewProps {
  business: Business;
}

type ServiceType = "platform" | "hook" | "battery" | "tire";

export default function TowView({ business }: TowViewProps) {
  const [serviceType, setServiceType] = useState<ServiceType>("platform");
  const [distanceKm, setDistanceKm] = useState<number>(8);
  const [originLocation, setOriginLocation] = useState("Zona Sur / Calacoto");
  const [destinationLocation, setDestinationLocation] = useState("Taller en Miraflores");
  const [vehicleType, setVehicleType] = useState("Sedán / SUV");

  const serviceOptions = [
    {
      id: "platform" as ServiceType,
      name: "Grúa Plataforma Hidráulica",
      description: "Ideal para autos automáticos, 4x4 y vehículos siniestrados sin rodamiento",
      basePrice: 160,
      pricePerKm: 12,
      icon: <Truck size={20} />,
      recommended: true,
    },
    {
      id: "hook" as ServiceType,
      name: "Grúa de Pluma / Arrastre",
      description: "Para vehículos mecánicos livianos en distancias cortas urbanas",
      basePrice: 130,
      pricePerKm: 10,
      icon: <Compass size={20} />,
    },
    {
      id: "battery" as ServiceType,
      name: "Auxilio de Batería y Puenteo Móvil",
      description: "Arranque asistido con arrancador portátil de 12V a domicilio o ruta",
      basePrice: 80,
      pricePerKm: 0,
      fixed: true,
      icon: <Zap size={20} />,
    },
    {
      id: "tire" as ServiceType,
      name: "Cambio de Rueda / Auxilio de Aire",
      description: "Reemplazo por rueda de auxilio y calibración de presión",
      basePrice: 70,
      pricePerKm: 0,
      fixed: true,
      icon: <CheckCircle2 size={20} />,
    },
  ];

  const currentService = serviceOptions.find((s) => s.id === serviceType)!;
  const calculatedFare = currentService.fixed
    ? currentService.basePrice
    : currentService.basePrice + distanceKm * currentService.pricePerKm;

  const handleRequestSOS = () => {
    let message = `🚨 *SOLICITUD DE AUXILIO VIAL / GRÚA 24/7* 🚨\n\n`;
    message += `*Empresa:* ${business.name}\n`;
    message += `• *Tipo de Auxilio:* ${currentService.name}\n`;
    message += `• *Vehículo:* ${vehicleType}\n`;
    message += `• *Ubicación del Auto:* ${originLocation}\n`;
    if (!currentService.fixed) {
      message += `• *Destino de Traslado:* ${destinationLocation}\n`;
      message += `• *Distancia Estimada:* ${distanceKm} km\n`;
    }
    message += `• *Tarifa Calculada:* ${calculatedFare} Bs\n\n`;
    message += `📍 *Por favor, indíquenme el tiempo estimado de llegada de la unidad más cercana.* ¡Gracias!`;

    const cleanPhone = business.phone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* BANNER SOS DE EMERGENCIA INMEDIATA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-red-600 to-[#0C3B2E] text-white p-6 sm:p-8 shadow-xl border border-red-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-white animate-ping" />
              <Badge variant="amber" size="sm" withDot pulseDot>
                Guardia 24 Horas Activa
              </Badge>
              <span className="text-xs text-red-100 font-semibold">Rescate Urbano y Carretera</span>
            </div>

            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ¿Varado o Necesitas Grúa de Inmediato?
            </h2>

            <p className="mt-1.5 text-xs sm:text-sm text-red-100 max-w-xl leading-relaxed">
              Unidades de rescate equipadas con plataforma hidráulica y cabrestante. Despacho prioritario en 15 a 25 minutos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a href={`tel:${business.phone}`} className="w-full sm:w-auto">
              <Button
                variant="danger"
                size="lg"
                icon={<PhoneCall size={18} />}
                className="font-extrabold shadow-xl w-full bg-white text-red-600 hover:bg-red-50 border-0"
              >
                Llamar Grúa 24/7
              </Button>
            </a>

            <Button
              variant="yellow"
              size="lg"
              icon={<Send size={18} />}
              onClick={handleRequestSOS}
              className="font-extrabold shadow-xl w-full sm:w-auto"
            >
              Pedir Grúa por WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* CALCULADORA DE TARIFA INTERACTIVA */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        {/* SELECTOR DE SERVICIO Y DISTANCIA */}
        <Card className="p-6">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E]">
              <Calculator size={20} className="text-[#6D9773]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0C3B2E]">
                Calculadora de Tarifa de Remolque
              </h3>
              <p className="text-xs text-gray-500">
                Selecciona tu tipo de asistencia para cotizar el costo exacto en Bolivianos
              </p>
            </div>
          </div>

          {/* Opciones de tipo de grúa */}
          <div className="space-y-3 mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
              1. Tipo de Servicio Requerido:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setServiceType(opt.id)}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    serviceType === opt.id
                      ? "border-[#0C3B2E] bg-[#E8F0E9]/60 ring-2 ring-[#0C3B2E]/20"
                      : "border-[#DCE7DE] bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 font-bold text-xs text-[#0C3B2E]">
                      {opt.icon}
                      {opt.name}
                    </span>
                    {opt.recommended && (
                      <span className="rounded-full bg-[#FFBA00] px-2 py-0.5 text-[9px] font-extrabold text-[#0C3B2E]">
                        Sugerido
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    {opt.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Datos de origen y destino */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Ubicación del vehículo
                </label>
                <input
                  type="text"
                  value={originLocation}
                  onChange={(e) => setOriginLocation(e.target.value)}
                  placeholder="Ej. Av. Ballivián Calle 18, La Paz"
                  className="w-full rounded-xl border border-[#DCE7DE] bg-white px-3.5 py-2.5 text-xs text-[#0C3B2E] outline-none focus:border-[#6D9773]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Destino de traslado
                </label>
                <input
                  type="text"
                  disabled={currentService.fixed}
                  value={currentService.fixed ? "Servicio in situ (En el lugar)" : destinationLocation}
                  onChange={(e) => setDestinationLocation(e.target.value)}
                  placeholder="Ej. Taller en Miraflores / Garage personal"
                  className="w-full rounded-xl border border-[#DCE7DE] bg-white px-3.5 py-2.5 text-xs text-[#0C3B2E] outline-none focus:border-[#6D9773] disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
            </div>

            {/* Slider de distancia (si no es tarifa fija) */}
            {!currentService.fixed && (
              <div className="rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#0C3B2E]">
                  <span>Distancia Estimada de Recorrido:</span>
                  <span className="text-sm text-[#6D9773] font-extrabold">{distanceKm} km</span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={50}
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseInt(e.target.value, 10))}
                  className="w-full accent-[#0C3B2E] cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>1 km (Urbano)</span>
                  <span>25 km</span>
                  <span>50 km (Carretera)</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* RESUMEN DE COTIZACIÓN Y BOTÓN DE DISPARO */}
        <div className="space-y-6">
          <Card className="border-[#6D9773]/40 bg-gradient-to-b from-white to-[#F8FAF8] shadow-lg">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
              Resumen de Tarifa Estimada
            </h4>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Servicio:</span>
                <span className="font-bold text-[#0C3B2E]">{currentService.name}</span>
              </div>

              {!currentService.fixed && (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>Base de enganche y rescate:</span>
                    <span className="font-semibold">{currentService.basePrice} Bs</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Recorrido ({distanceKm} km × {currentService.pricePerKm} Bs):</span>
                    <span className="font-semibold">
                      {distanceKm * currentService.pricePerKm} Bs
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-baseline justify-between border-t border-gray-200 pt-3 text-[#0C3B2E]">
                <span className="text-sm font-bold">Total Estimado:</span>
                <span className="text-3xl font-extrabold text-[#6D9773]">
                  {calculatedFare} Bs
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Button
                variant="yellow"
                fullWidth
                size="lg"
                icon={<Send size={16} />}
                onClick={handleRequestSOS}
                className="font-extrabold shadow-md"
              >
                Solicitar Grúa con esta Tarifa
              </Button>

              <a href={`tel:${business.phone}`} className="block w-full">
                <Button
                  variant="outline"
                  fullWidth
                  size="sm"
                  icon={<PhoneCall size={14} />}
                >
                  Llamar por teléfono
                </Button>
              </a>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 text-center">
              <Clock size={12} className="text-[#6D9773]" />
              <span>Tiempo de llegada aproximado: <strong>15 a 25 min</strong></span>
            </div>
          </Card>

          {/* ESPECIFICACIONES DE LA UNIDAD */}
          <div className="rounded-2xl bg-[#E8F0E9]/60 p-5 border border-[#DCE7DE] space-y-2 text-xs text-gray-700">
            <h5 className="font-bold text-[#0C3B2E] flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#6D9773]" />
              <span>Garantía de Transporte Seguro</span>
            </h5>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Plataformas con seguro de carga, cadenas forradas y operarios certificados para evitar raspones en parachoques o faldones bajos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
