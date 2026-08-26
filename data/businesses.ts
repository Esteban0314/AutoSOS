export type BusinessType = "workshop" | "tow" | "store";

export interface Business {
  id: string;
  type: BusinessType;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  distance: string;
  location: string;
  address: string;
  phone: string;
  schedule: string;
  services: string[];
  open: boolean;
}

export const businesses: Business[] = [
  {
    id: "1",
    type: "workshop",
    name: "Taller AutoMax",
    description: "Diagnóstico y reparación general",
    rating: 4.8,
    reviews: 126,
    distance: "1.2 km",
    location: "La Paz",
    address: "Av. Principal #123, La Paz",
    phone: "+591 70000000",
    schedule: "Lun - Sáb · 08:00 - 18:00",
    services: [
      "Cambio de aceite",
      "Diagnóstico computarizado",
      "Sistema de frenos",
      "Mantenimiento",
      "Motor",
      "Suspensión",
    ],
    open: true,
  },

  {
    id: "2",
    type: "workshop",
    name: "Mecánica López",
    description: "Especialistas en mantenimiento vehicular",
    rating: 4.7,
    reviews: 89,
    distance: "2.4 km",
    location: "La Paz",
    address: "Calle 10 #456, La Paz",
    phone: "+591 71111111",
    schedule: "Lun - Vie · 08:30 - 18:30",
    services: [
      "Mantenimiento",
      "Frenos",
      "Suspensión",
      "Motor",
    ],
    open: true,
  },

  {
    id: "3",
    type: "tow",
    name: "Grúas Express",
    description: "Asistencia vehicular las 24 horas",
    rating: 4.6,
    reviews: 74,
    distance: "2.1 km",
    location: "La Paz",
    address: "Av. Arce #789, La Paz",
    phone: "+591 72222222",
    schedule: "24 horas",
    services: [
      "Grúa",
      "Asistencia en carretera",
      "Auxilio vehicular",
    ],
    open: true,
  },

  {
    id: "4",
    type: "store",
    name: "Repuestos La Paz",
    description: "Repuestos y accesorios para vehículos",
    rating: 4.9,
    reviews: 153,
    distance: "800 m",
    location: "La Paz",
    address: "Calle Comercio #321, La Paz",
    phone: "+591 73333333",
    schedule: "Lun - Sáb · 09:00 - 19:00",
    services: [
      "Repuestos",
      "Lubricantes",
      "Filtros",
      "Accesorios",
    ],
    open: true,
  },
];