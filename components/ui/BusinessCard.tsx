import { MapPin, Star, Wrench, Truck, Store, ArrowRight, ShieldCheck } from "lucide-react";
import Button from "./Button";
import Link from "next/link";
import Badge from "./Badge";

export type BusinessType = "workshop" | "tow" | "store";

export interface BusinessCardProps {
  id: string;
  type: BusinessType;
  name: string;
  description: string;
  rating: number;
  reviews?: number;
  distance: string;
  location: string;
  image?: string;
  isOpen?: boolean;
}

export default function BusinessCard({
  id,
  type,
  name,
  description,
  rating,
  reviews = 84,
  distance,
  location,
  image,
  isOpen = true,
}: BusinessCardProps) {
  const businessConfig = {
    workshop: {
      label: "Taller mecánico",
      icon: Wrench,
      href: `/taller/${id}`,
      color: "bg-[#0C3B2E]",
    },
    tow: {
      label: "Servicio de grúa",
      icon: Truck,
      href: `/taller/${id}`,
      color: "bg-[#8C5D00]",
    },
    store: {
      label: "Tienda de repuestos",
      icon: Store,
      href: `/taller/${id}`,
      color: "bg-[#145341]",
    },
  };

  const config = businessConfig[type] || businessConfig.workshop;
  const Icon = config.icon;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#DCE7DE] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#6D9773] hover:shadow-xl hover:shadow-[#0C3B2E]/10">
      <div>
        {/* IMAGEN / BANNER SUPERIOR */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-[#0C3B2E] via-[#145341] to-[#07261D]">
          {image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6D9773_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-[#6D9773] shadow-inner transition-transform duration-300 group-hover:scale-110">
                <Icon size={38} strokeWidth={1.7} className="text-[#FFBA00]" />
              </div>
            </div>
          )}

          {/* TIPO DE NEGOCIO & VERIFICADO */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#0C3B2E] shadow-md backdrop-blur-md">
              <Icon size={13} className="text-[#6D9773]" />
              {config.label}
            </span>

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6D9773] text-white shadow-md" title="Verificado por AutoSOS">
              <ShieldCheck size={14} />
            </span>
          </div>

          {/* ESTADO EN VIVO */}
          <div className="absolute right-4 top-4">
            <Badge
              variant={isOpen ? "amber" : "neutral"}
              size="sm"
              withDot
              pulseDot={isOpen}
              className="shadow-md bg-white/95 backdrop-blur-md font-bold"
            >
              {isOpen ? "Abierto" : "Cerrado"}
            </Badge>
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-[#0C3B2E] transition-colors group-hover:text-[#6D9773]">
                {name}
              </h3>

              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {description}
              </p>
            </div>

            {/* CALIFICACIÓN */}
            <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#FFF4D6] px-2.5 py-1.5 border border-[#FFE699]">
              <Star
                size={15}
                fill="#FFBA00"
                className="text-[#FFBA00]"
              />
              <span className="text-sm font-extrabold text-[#0C3B2E]">
                {rating}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                ({reviews})
              </span>
            </div>
          </div>

          {/* UBICACIÓN Y DISTANCIA */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500 border-t border-gray-100 pt-4">
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#E8F0E9] px-2.5 py-1 text-[#0C3B2E] font-semibold">
              <MapPin size={13} className="text-[#6D9773]" />
              {distance}
            </span>

            <span className="text-gray-400">•</span>

            <span className="text-gray-600 truncate max-w-[170px]">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* BOTÓN INFERIOR */}
      <div className="px-6 pb-6 pt-2">
        <Link href={config.href} className="block w-full">
          <Button
            variant="outline"
            fullWidth
            icon={<ArrowRight size={16} />}
            className="group-hover:bg-[#0C3B2E] group-hover:text-white group-hover:border-[#0C3B2E] transition-all"
          >
            Ver detalles y servicios
          </Button>
        </Link>
      </div>
    </div>
  );
}