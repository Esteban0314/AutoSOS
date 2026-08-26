import { MapPin, Star, Wrench, Truck, Store } from "lucide-react";
import Button from "./Button";
import Link from "next/link";

type BusinessType = "workshop" | "tow" | "store";

interface BusinessCardProps {
  id: string;
  type: BusinessType;
  name: string;
  description: string;
  rating: number;
  distance: string;
  location: string;
  image?: string;
}

export default function BusinessCard({
  id,
 type,
  name,
  description,
  rating,
  distance,
  location,
  image,
}: BusinessCardProps) {

  const businessConfig = {
    workshop: {
      label: "Taller mecánico",
      icon: Wrench,
    },
    tow: {
      label: "Servicio de grúa",
      icon: Truck,
    },
    store: {
      label: "Tienda de repuestos",
      icon: Store,
    },
  };

  const config = businessConfig[type];
  const Icon = config.icon;

  return (
    <Link
        href={
            type === "workshop"
            ? `/taller/${id}`
            : type === "tow"
                ? `/grua/${id}`
                : `/tienda/${id}`
        }
        className="block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
      {/* IMAGEN */}
      <div className="relative h-44 bg-[#E8F0E9]">

        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Icon
              size={55}
              strokeWidth={1.3}
              className="text-[#6D9773]"
            />
          </div>
        )}

        {/* TIPO DE NEGOCIO */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#0C3B2E] shadow-sm">
          <Icon size={14} />
          {config.label}
        </div>

      </div>

      {/* INFORMACIÓN */}
      <div className="p-5">

        <div className="flex items-start justify-between gap-4">

          <div>
            <h3 className="text-lg font-bold text-[#0C3B2E]">
              {name}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          </div>

          {/* CALIFICACIÓN */}
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-[#FFF4D6] px-2 py-1">
            <Star
              size={14}
              fill="#FFBA00"
              className="text-[#FFBA00]"
            />

            <span className="text-sm font-bold text-[#0C3B2E]">
              {rating}
            </span>
          </div>

        </div>

        {/* UBICACIÓN */}
        <div className="mt-5 flex items-center gap-4 text-sm text-gray-500">

          <span className="flex items-center gap-1.5">
            <MapPin size={15} />
            {distance}
          </span>

          <span>
            {location}
          </span>

        </div>

        {/* BOTÓN */}
        <Button className="mt-5 w-full">
        Ver detalles
        </Button>

      </div>

    </Link>
  );
}