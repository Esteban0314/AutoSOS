"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Wrench,
  Truck,
  Store,
  MapPin,
  Star,
  ArrowRight,
  Plus,
  Minus,
  Navigation,
  Layers,
  Search,
  Crosshair,
  ExternalLink,
  X,
} from "lucide-react";
import { Business } from "@/data/businesses";
import Button from "@/components/ui/Button";

interface LatLng {
  lat: number;
  lng: number;
}

// Coordenadas reales de los 14 negocios en La Paz
const BUSINESS_COORDINATES: Record<string, LatLng> = {
  "1": { lat: -16.5412, lng: -68.0812 }, // Bosch Car Service - Calacoto
  "2": { lat: -16.5435, lng: -68.0845 }, // Taller San Cristóbal - Calacoto
  "3": { lat: -16.4950, lng: -68.1380 }, // AutoTotal - Centro
  "4": { lat: -16.5020, lng: -68.1390 }, // Taller El Tunari - San Pedro
  "5": { lat: -16.5015, lng: -68.1210 }, // ToyoPaz - Miraflores
  "6": { lat: -16.5050, lng: -68.1235 }, // Grúas La Paz 24/7 - Miraflores
  "7": { lat: -16.5120, lng: -68.1290 }, // Grúas SOS Bolivia - Sopocachi
  "8": { lat: -16.5080, lng: -68.1620 }, // Grúas Illimani - El Alto / Autopista
  "9": { lat: -16.5460, lng: -68.0780 }, // Auxilio Cóndor - Calacoto 21
  "10": { lat: -16.4990, lng: -68.1375 }, // Autorepuestos Illimani - San Pedro
  "11": { lat: -16.4930, lng: -68.1400 }, // ToyoParts - Centro Montes
  "12": { lat: -16.5030, lng: -68.1215 }, // Repuestos La Paz Central - Miraflores
  "13": { lat: -16.5045, lng: -68.1340 }, // Casa del Freno - San Pedro
  "14": { lat: -16.5390, lng: -68.0860 }, // Repuestos Zona Sur - Calacoto
};

// Coordenadas de centro de La Paz
const DEFAULT_CENTER: LatLng = { lat: -16.5150, lng: -68.1200 };

interface GoogleMapViewProps {
  businesses: Business[];
  selectedBusiness: Business | null;
  onSelectBusiness: (b: Business) => void;
}

export default function GoogleMapView({
  businesses,
  selectedBusiness,
  onSelectBusiness,
}: GoogleMapViewProps) {
  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Proyección Web Mercator para convertir lat/lng a pixeles relativos
  const project = useCallback(
    (lat: number, lng: number, zoomLevel: number) => {
      const siny = Math.sin((lat * Math.PI) / 180);
      const clampedSiny = Math.min(Math.max(siny, -0.9999), 0.9999);

      const scale = 256 * Math.pow(2, zoomLevel);
      const x = scale * (0.5 + lng / 360);
      const y = scale * (0.5 - Math.log((1 + clampedSiny) / (1 - clampedSiny)) / (4 * Math.PI));

      return { x, y };
    },
    []
  );

  // Centrar cuando cambia el negocio seleccionado
  useEffect(() => {
    if (selectedBusiness && BUSINESS_COORDINATES[selectedBusiness.id]) {
      setCenter(BUSINESS_COORDINATES[selectedBusiness.id]);
    }
  }, [selectedBusiness]);

  // Manejo de drag / pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const degPerPixelLng = 360 / (256 * Math.pow(2, zoom));
    const degPerPixelLat = 180 / (256 * Math.pow(2, zoom));

    setCenter((prev) => ({
      lat: prev.lat + dy * degPerPixelLat * 0.7,
      lng: prev.lng - dx * degPerPixelLng * 0.7,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // Calcular tiles visibles de OpenStreetMap / Carto estilo Google Maps
  const centerPoint = project(center.lat, center.lng, zoom);
  const width = 600; // tamaño base aproximado
  const height = 580;

  // Rango de tiles
  const tileSize = 256;
  const tileX = Math.floor(centerPoint.x / tileSize);
  const tileY = Math.floor(centerPoint.y / tileSize);

  const tiles = [];
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      const x = tileX + dx;
      const y = tileY + dy;
      const maxTile = Math.pow(2, zoom);
      if (x >= 0 && x < maxTile && y >= 0 && y < maxTile) {
        const left = x * tileSize - (centerPoint.x - width / 2);
        const top = y * tileSize - (centerPoint.y - height / 2);

        // CartoDB Voyager reproduce con fidelidad los colores pastel y trazos de Google Maps
        const subdomains = ["a", "b", "c", "d"];
        const s = subdomains[(x + y) % subdomains.length];
        const tileUrl =
          mapType === "satellite"
            ? `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`
            : `https://${s}.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${x}/${y}.png`;

        tiles.push({ x, y, left, top, url: tileUrl });
      }
    }
  }

  // Centrar en ubicación del usuario (La Paz Sopocachi / Centro)
  const handleLocateMe = () => {
    setCenter(DEFAULT_CENTER);
    setZoom(14);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-[580px] rounded-3xl overflow-hidden border border-[#DCE7DE] shadow-xl select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* CAPA DE MOSAICOS / TILES ESTILO GOOGLE MAPS */}
      <div className="absolute inset-0 bg-[#E5E3DF] overflow-hidden pointer-events-none">
        {tiles.map((tile) => (
          <img
            key={`${tile.x}-${tile.y}-${zoom}-${mapType}`}
            src={tile.url}
            alt="Map Tile"
            style={{
              position: "absolute",
              left: `${tile.left}px`,
              top: `${tile.top}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
            }}
            className="transition-opacity duration-150"
            loading="lazy"
          />
        ))}
      </div>

      {/* HEADER BUSCADOR ESTILO GOOGLE MAPS */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2 pointer-events-auto">
        <div className="flex-1 max-w-sm rounded-2xl bg-white px-3.5 py-2.5 shadow-lg border border-gray-200/80 flex items-center gap-2.5 backdrop-blur-md">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0C3B2E] text-[#FFBA00] shadow-xs">
            <MapPin size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Google Maps · La Paz, Bolivia
            </p>
            <p className="text-xs font-bold text-[#0C3B2E] truncate">
              {businesses.length} servicios automotrices activos
            </p>
          </div>
        </div>

        {/* SELECTOR DE CAPAS GOOGLE MAPS */}
        <div className="flex items-center rounded-2xl bg-white p-1 shadow-lg border border-gray-200/80 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMapType("roadmap")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              mapType === "roadmap"
                ? "bg-[#0C3B2E] text-white shadow-xs"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Mapa
          </button>
          <button
            type="button"
            onClick={() => setMapType("satellite")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              mapType === "satellite"
                ? "bg-[#0C3B2E] text-white shadow-xs"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Satélite
          </button>
        </div>
      </div>

      {/* MARCADOR DE UBICACIÓN ACTUAL DEL CLIENTE (Punto Azul Google Maps) */}
      {(() => {
        const userPoint = project(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng, zoom);
        const left = userPoint.x - (centerPoint.x - width / 2);
        const top = userPoint.y - (centerPoint.y - height / 2);

        return (
          <div
            style={{ left: `${left}px`, top: `${top}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none"
            title="Tu ubicación en La Paz"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute h-10 w-10 rounded-full bg-blue-500/25 animate-ping" />
              <div className="h-5 w-5 rounded-full bg-blue-600 border-3 border-white shadow-lg flex items-center justify-center" />
            </div>
          </div>
        );
      })()}

      {/* MARCADORES ESTILO GOOGLE MAPS PINS */}
      {businesses.map((business) => {
        const coords = BUSINESS_COORDINATES[business.id] || DEFAULT_CENTER;
        const pt = project(coords.lat, coords.lng, zoom);
        const left = pt.x - (centerPoint.x - width / 2);
        const top = pt.y - (centerPoint.y - height / 2);

        const isSelected = selectedBusiness?.id === business.id;

        // Color del Pin estilo Google Maps según categoría
        const pinColor =
          business.type === "workshop"
            ? "bg-[#DC2626]" // Rojo Google Maps para talleres
            : business.type === "tow"
            ? "bg-[#EA580C]" // Naranja para grúas
            : "bg-[#0284C7]"; // Azul para tiendas de repuestos

        return (
          <button
            key={business.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectBusiness(business);
            }}
            style={{ left: `${left}px`, top: `${top}px` }}
            className={`absolute -translate-x-1/2 -translate-y-full z-20 transition-all duration-200 pointer-events-auto cursor-pointer group ${
              isSelected ? "scale-125 z-30" : "hover:scale-115"
            }`}
          >
            {/* GLOBO TEARDROP GOOGLE MAPS */}
            <div className="relative flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl rounded-bl-none rotate-45 border-2 border-white shadow-xl transition-all ${pinColor} ${
                  isSelected ? "ring-3 ring-[#FFBA00]" : ""
                }`}
              >
                <div className="-rotate-45 text-white flex items-center justify-center">
                  {business.type === "workshop" && <Wrench size={15} strokeWidth={2.2} />}
                  {business.type === "tow" && <Truck size={15} strokeWidth={2.2} />}
                  {business.type === "store" && <Store size={15} strokeWidth={2.2} />}
                </div>
              </div>

              {/* Sombra de apoyo en el suelo */}
              <div className="h-1.5 w-3.5 rounded-full bg-black/30 blur-[1px] mt-1" />

              {/* Etiqueta flotante con nombre al hacer hover */}
              <span className="absolute -top-6 whitespace-nowrap rounded-lg bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {business.name}
              </span>
            </div>
          </button>
        );
      })}

      {/* CONTROLES DE ZOOM Y UBICACIÓN ESTILO GOOGLE MAPS (Abajo a la derecha) */}
      <div className="absolute bottom-6 right-3.5 z-20 flex flex-col items-center gap-2 pointer-events-auto">
        {/* Botón Mi Ubicación */}
        <button
          type="button"
          onClick={handleLocateMe}
          className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white shadow-lg text-gray-700 hover:text-[#0C3B2E] hover:bg-gray-50 border border-gray-200 transition cursor-pointer"
          title="Centrar en mi ubicación"
        >
          <Crosshair size={18} />
        </button>

        {/* Botones de Zoom */}
        <div className="flex flex-col rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden divide-y divide-gray-100">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 1, 16))}
            className="h-10 w-10 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-[#0C3B2E] transition cursor-pointer"
            title="Acercar mapa"
          >
            <Plus size={18} />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 1, 11))}
            className="h-10 w-10 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-[#0C3B2E] transition cursor-pointer"
            title="Alejar mapa"
          >
            <Minus size={18} />
          </button>
        </div>
      </div>

      {/* TARJETA INFORMATIVA FLOTANTE GOOGLE MAPS CUANDO UN NEGOCIO ESTÁ SELECCIONADO */}
      {selectedBusiness && (
        <div className="absolute bottom-4 left-3.5 right-16 z-25 pointer-events-auto animate-enter-scale">
          <div className="rounded-2xl border border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${
                    selectedBusiness.type === "workshop"
                      ? "bg-[#DC2626]"
                      : selectedBusiness.type === "tow"
                      ? "bg-[#EA580C]"
                      : "bg-[#0284C7]"
                  }`}
                >
                  {selectedBusiness.type === "workshop" && <Wrench size={20} />}
                  {selectedBusiness.type === "tow" && <Truck size={20} />}
                  {selectedBusiness.type === "store" && <Store size={20} />}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#6D9773]">
                      {selectedBusiness.type === "workshop"
                        ? "Taller Mecánico"
                        : selectedBusiness.type === "tow"
                        ? "Servicio de Grúa"
                        : "Tienda de Repuestos"}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#FFBA00]">
                      <Star size={12} fill="#FFBA00" />
                      {selectedBusiness.rating}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      ({selectedBusiness.reviews})
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-[#0C3B2E] line-clamp-1">
                    {selectedBusiness.name}
                  </h3>
                </div>
              </div>

              <Link href={`/taller/${selectedBusiness.id}`}>
                <Button
                  variant="yellow"
                  size="sm"
                  icon={<ArrowRight size={13} />}
                  className="font-extrabold shadow-xs"
                >
                  Ver Ficha
                </Button>
              </Link>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-2">
              <span className="flex items-center gap-1 truncate max-w-[70%]">
                <MapPin size={12} className="text-[#6D9773] shrink-0" />
                <span className="truncate">{selectedBusiness.address}</span>
              </span>

              <span className="font-bold text-[#0C3B2E] shrink-0">
                {selectedBusiness.distance}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* WATERMARK GOOGLE MAPS / OPENSTREETMAP */}
      <div className="absolute bottom-1 left-2 z-10 text-[9px] text-gray-500 bg-white/70 px-1.5 py-0.5 rounded backdrop-blur-xs pointer-events-none">
        Google Maps Style · La Paz GeoSOS
      </div>
    </div>
  );
}
