export type BusinessType = "workshop" | "tow" | "store";

export interface ServicePackage {
  id: string;
  name: string;
  category: string;
  description: string;
  includes: string[];
  priceSmall: number;   // Auto pequeño (Hatchbacks, compactos: ej. Swift, Alto, Grand i10, Yaris)
  priceMedium: number;  // Auto mediano (Sedanes, SUVs compactas: ej. Corolla, Vitara, Versa, Tucson)
  priceLarge: number;   // Auto grande / 4x4 (Pickups, camionetas, vans: ej. Hilux, Patrol, Land Cruiser)
  durationEstimate: string;
  isPopular?: boolean;
}

export interface Business {
  id: string;
  type: BusinessType;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  distance: string;
  location: string;
  zone: string;
  address: string;
  phone: string;
  whatsapp?: string;
  schedule: string;
  services: string[];
  open: boolean;
  nit?: string;
  packages?: ServicePackage[];
}

export const defaultPackages: ServicePackage[] = [
  {
    id: "pkg-1",
    name: "Mantenimiento Preventivo Básico",
    category: "Preventivo",
    description: "Revisión integral de 25 puntos clave, cambio de aceite de motor y filtro, inspección de frenos y niveles.",
    includes: [
      "Cambio de aceite de motor multigrado",
      "Filtro de aceite nuevo",
      "Revisión y limpieza de frenos delanteros y traseros",
      "Comprobación de niveles (frenos, refrigerante, dirección)",
      "Inspección de luces, batería y presión de neumáticos",
      "Informe técnico de estado general",
    ],
    priceSmall: 180,
    priceMedium: 240,
    priceLarge: 320,
    durationEstimate: "1.5 a 2 horas",
    isPopular: true,
  },
  {
    id: "pkg-2",
    name: "Afinación Mayor y Aceite Sintético",
    category: "Afinación",
    description: "Mantenimiento profundo para optimizar el rendimiento, consumo de combustible y emisiones en la altura de La Paz.",
    includes: [
      "Cambio de aceite 100% sintético de alta calidad",
      "Filtro de aceite y filtro de aire nuevos",
      "Limpieza y calibración de cuerpo de aceleración",
      "Limpieza de inyectores por ultrasonido / aditivo pro",
      "Inspección o reemplazo de bujías",
      "Escaneo computarizado OBD-II y reseteo de servicio",
    ],
    priceSmall: 350,
    priceMedium: 460,
    priceLarge: 620,
    durationEstimate: "3 a 4 horas",
    isPopular: true,
  },
  {
    id: "pkg-3",
    name: "Servicio Integral de Frenos y Seguridad",
    category: "Frenos",
    description: "Mantenimiento completo del sistema de frenado para máxima seguridad en las pendientes pronunciadas de La Paz.",
    includes: [
      "Cambio de pastillas de freno delanteras (calidad premium)",
      "Rectificación de discos de freno (ambos lados)",
      "Purga y reemplazo de líquido de frenos DOT4",
      "Regulación de freno de mano / tambores traseros",
      "Prueba dinámica de frenado en rampa",
    ],
    priceSmall: 220,
    priceMedium: 310,
    priceLarge: 420,
    durationEstimate: "2.5 horas",
    isPopular: false,
  },
  {
    id: "pkg-4",
    name: "Diagnóstico Computarizado & Escáner Completo",
    category: "Diagnóstico",
    description: "Lectura profunda de parámetros en tiempo real de motor, transmisión, ABS, Airbag y mapeo de sensores.",
    includes: [
      "Escaneo electrónico multimarca",
      "Lectura y borrado de códigos de falla (DTC)",
      "Prueba de sensores de oxígeno y flujo de aire (MAF/MAP)",
      "Test de carga de alternador y vida útil de batería",
      "Reporte digital entregado por WhatsApp/Email",
    ],
    priceSmall: 120,
    priceMedium: 120,
    priceLarge: 150,
    durationEstimate: "45 minutos",
    isPopular: false,
  },
];

export const businesses: Business[] = [
  // 1. Bosch Car Service La Paz
  {
    id: "1",
    type: "workshop",
    name: "Bosch Car Service La Paz",
    description: "Centro automotriz certificado en diagnóstico computarizado, inyección y mantenimiento integral",
    rating: 4.9,
    reviews: 215,
    distance: "1.5 km",
    location: "La Paz",
    zone: "Zona Sur - Calacoto",
    address: "Av. Costanera #1040 entre calles 15 y 16, Calacoto, La Paz",
    phone: "+591 2 2794500",
    whatsapp: "+591 76789012",
    schedule: "Lun - Vie · 08:00 - 18:30 | Sáb · 08:30 - 13:00",
    services: [
      "Diagnóstico computarizado Bosch",
      "Inyección electrónica",
      "Sistema de frenos ABS/ESP",
      "Mantenimiento preventivo",
      "Aire acondicionado automotriz",
      "Baterías y alternadores",
    ],
    open: true,
    nit: "1028475021",
    packages: defaultPackages,
  },

  // 2. Taller Mecánico San Cristóbal
  {
    id: "2",
    type: "workshop",
    name: "Taller Mecánico San Cristóbal",
    description: "Especialistas en suspensión 4x4, tren delantero, alineación computarizada y mecánica general",
    rating: 4.8,
    reviews: 148,
    distance: "1.8 km",
    location: "La Paz",
    zone: "Zona Sur - Calacoto",
    address: "Calle 15 de Calacoto esq. Los Sauces #210, Calacoto, La Paz",
    phone: "+591 77234567",
    whatsapp: "+591 77234567",
    schedule: "Lun - Sáb · 08:00 - 18:00",
    services: [
      "Suspensión y dirección 4x4",
      "Alineación y balanceo láser",
      "Mantenimiento de cajas mecánicas",
      "Frenos cerámicos",
      "Cambio de embragues",
    ],
    open: true,
    nit: "3491823019",
    packages: defaultPackages,
  },

  // 3. AutoTotal Centro Automotriz
  {
    id: "3",
    type: "workshop",
    name: "AutoTotal Centro Automotriz",
    description: "Servicio express de cambio de aceite, afinación de motor y revisión integral multimarca",
    rating: 4.7,
    reviews: 182,
    distance: "850 m",
    location: "La Paz",
    zone: "Zona Central",
    address: "Av. Ismael Montes #680, Centro, La Paz",
    phone: "+591 2 2281234",
    whatsapp: "+591 78912345",
    schedule: "Lun - Sáb · 08:30 - 19:00",
    services: [
      "Mantenimiento preventivo express",
      "Cambio de fluidos y filtros",
      "Alineación 3D",
      "Frenos",
      "Diagnóstico scanner OBD-II",
    ],
    open: true,
    nit: "4829102013",
    packages: defaultPackages,
  },

  // 4. Taller Mecánico El Tunari
  {
    id: "4",
    type: "workshop",
    name: "Taller Mecánico El Tunari",
    description: "Mecánica pesada, reparación de motores a gasolina/diésel, rectificación y cajas de transmisión",
    rating: 4.7,
    reviews: 94,
    distance: "1.2 km",
    location: "La Paz",
    zone: "San Pedro",
    address: "Calle Nicolás Acosta #380, San Pedro, La Paz",
    phone: "+591 71567890",
    whatsapp: "+591 71567890",
    schedule: "Lun - Sáb · 08:00 - 18:30",
    services: [
      "Reparación de motores",
      "Rectificación de culatas",
      "Cajas de cambio",
      "Embragues",
      "Electricidad automotriz",
    ],
    open: true,
    nit: "2847193014",
    packages: defaultPackages,
  },

  // 5. Taller Especializado ToyoPaz
  {
    id: "5",
    type: "workshop",
    name: "Taller Especializado ToyoPaz",
    description: "Especialistas en vehículos Toyota, Lexus y marcas japonesas con repuestos genuinos",
    rating: 4.9,
    reviews: 167,
    distance: "2.1 km",
    location: "La Paz",
    zone: "Miraflores",
    address: "Av. Busch #1420 esq. Villalobos, Miraflores, La Paz",
    phone: "+591 72089123",
    whatsapp: "+591 72089123",
    schedule: "Lun - Vie · 08:00 - 18:30 | Sáb · 08:30 - 14:00",
    services: [
      "Especialista en Toyota y marcas japonesas",
      "Repuestos genuinos",
      "Mantenimiento 4x4",
      "Inyección VVT-i",
      "Frenos y suspensión",
    ],
    open: true,
    nit: "5192840018",
    packages: defaultPackages,
  },

  // 6. Grúas La Paz 24/7 Auxilio Vial
  {
    id: "6",
    type: "tow",
    name: "Grúas La Paz 24/7 Auxilio Vial",
    description: "Servicio de auxilio vial rápido con plataformas hidráulicas modernas en toda La Paz y El Alto",
    rating: 4.8,
    reviews: 139,
    distance: "1.9 km",
    location: "La Paz",
    zone: "Miraflores / Cobertura Departamental",
    address: "Av. Saavedra #1890, Miraflores, La Paz",
    phone: "+591 70123456",
    whatsapp: "+591 70123456",
    schedule: "24 horas los 365 días",
    services: [
      "Grúa de plataforma hidráulica",
      "Rescate en autopista La Paz - El Alto",
      "Paso de corriente y auxilio de batería",
      "Apertura de puertas",
      "Auxilio en carretera Yungas/Oruro",
    ],
    open: true,
  },

  // 7. Grúas SOS Bolivia
  {
    id: "7",
    type: "tow",
    name: "Grúas SOS Bolivia",
    description: "Rescate urbano y carretero 24/7 para automóviles, vagonetas y vehículos 4x4",
    rating: 4.7,
    reviews: 112,
    distance: "1.1 km",
    location: "La Paz",
    zone: "Sopocachi / Cobertura Urbana",
    address: "Av. 20 de Octubre #2240, Sopocachi, La Paz",
    phone: "+591 71239876",
    whatsapp: "+591 71239876",
    schedule: "24 horas",
    services: [
      "Plataformas para autos bajos y deportivos",
      "Remolque de vagonetas 4x4",
      "Auxilio mecánico en sitio",
      "Cambio de llanta",
    ],
    open: true,
  },

  // 8. Grúas y Remolques Illimani
  {
    id: "8",
    type: "tow",
    name: "Grúas y Remolques Illimani",
    description: "Flota de grúas pesadas para rescate en barrancos, pendientes y autopistas interdepartamentales",
    rating: 4.6,
    reviews: 88,
    distance: "3.5 km",
    location: "La Paz",
    zone: "El Alto y Autopista",
    address: "Av. 6 de Marzo #450, El Alto / Autopista La Paz",
    phone: "+591 73045678",
    whatsapp: "+591 73045678",
    schedule: "24 horas",
    services: [
      "Grúas de arrastre pesado",
      "Rescate en pendientes pronunciadas",
      "Traslado interdepartamental",
      "Remolque de minibuses y camiones",
    ],
    open: true,
  },

  // 9. Auxilio Vial Cóndor Grúas
  {
    id: "9",
    type: "tow",
    name: "Auxilio Vial Cóndor Grúas",
    description: "Base operativa permanente en Zona Sur para auxilio rápido en Calacoto, Achumani y Cota Cota",
    rating: 4.9,
    reviews: 96,
    distance: "2.3 km",
    location: "La Paz",
    zone: "Zona Sur (Calacoto, Achumani, Los Pinos)",
    address: "Calle 21 de Calacoto #150, Calacoto, La Paz",
    phone: "+591 76543210",
    whatsapp: "+591 76543210",
    schedule: "24 horas",
    services: [
      "Respuesta rápida en Zona Sur",
      "Plataforma hidráulica",
      "Suministro de combustible",
      "Paso de corriente 12V/24V",
    ],
    open: true,
  },

  // 10. Autorepuestos Illimani
  {
    id: "10",
    type: "store",
    name: "Autorepuestos Illimani",
    description: "Venta mayorista y minorista de repuestos originales y alternativos para Toyota, Suzuki y Nissan",
    rating: 4.9,
    reviews: 204,
    distance: "650 m",
    location: "La Paz",
    zone: "San Pedro / Centro",
    address: "Calle Murillo #745 entre Sagárnaga y Santa Cruz, San Pedro, La Paz",
    phone: "+591 2 2314567",
    whatsapp: "+591 74567890",
    schedule: "Lun - Sáb · 08:30 - 19:30",
    services: [
      "Repuestos originales y alternativos japoneses",
      "Pastillas y zapatas de freno",
      "Kits de distribución y correas",
      "Filtros Mann y Denso",
      "Delivery en La Paz y El Alto",
    ],
    open: true,
    nit: "1928471015",
  },

  // 11. Importadora ToyoParts La Paz
  {
    id: "11",
    type: "store",
    name: "Importadora ToyoParts La Paz",
    description: "Importadores directos de partes de suspensión, amortiguadores KYB, bombas de agua y embragues",
    rating: 4.8,
    reviews: 178,
    distance: "900 m",
    location: "La Paz",
    zone: "Zona Central",
    address: "Av. Ismael Montes #890, Centro, La Paz",
    phone: "+591 2 2289900",
    whatsapp: "+591 79012345",
    schedule: "Lun - Sáb · 08:30 - 19:00",
    services: [
      "Repuestos genuinos Toyota y Suzuki",
      "Amortiguadores KYB y Tokico",
      "Bombas de agua y gasolina",
      "Bujías Iridium NGK/Denso",
      "Embragues Aisin",
    ],
    open: true,
    nit: "3928174011",
  },

  // 12. Repuestos y Baterías La Paz Central
  {
    id: "12",
    type: "store",
    name: "Repuestos y Baterías La Paz Central",
    description: "Distribuidor oficial de baterías con garantía y lubricantes sintéticos de alto rendimiento",
    rating: 4.8,
    reviews: 125,
    distance: "1.7 km",
    location: "La Paz",
    zone: "Miraflores",
    address: "Av. Busch #1120, Miraflores, La Paz",
    phone: "+591 77561234",
    whatsapp: "+591 77561234",
    schedule: "Lun - Sáb · 08:00 - 19:30 | Dom · 09:00 - 13:00",
    services: [
      "Baterías Moura, Bosch y Toyo con garantía",
      "Instalación y test de alternador",
      "Lubricantes sintéticos Mobil 1, Motul, Castrol",
      "Líquidos de freno Valvoline",
    ],
    open: true,
    nit: "4819203016",
  },

  // 13. Casa del Freno y Embrague San Pedro
  {
    id: "13",
    type: "store",
    name: "Casa del Freno y Embrague San Pedro",
    description: "Especialistas en discos, pastillas cerámicas, tambores, cilindros de freno y kits de embrague",
    rating: 4.7,
    reviews: 110,
    distance: "1.3 km",
    location: "La Paz",
    zone: "San Pedro",
    address: "Calle Cañada Strongest #1890, San Pedro, La Paz",
    phone: "+591 71987654",
    whatsapp: "+591 71987654",
    schedule: "Lun - Sáb · 08:30 - 18:30",
    services: [
      "Discos de freno y tambores",
      "Kits de embrague LUK y Valeo",
      "Cilindros maestros y bombines",
      "Líquidos de freno DOT3 y DOT4",
      "Rectificación de discos",
    ],
    open: true,
    nit: "2948102017",
  },

  // 14. Repuestos y Accesorios Zona Sur
  {
    id: "14",
    type: "store",
    name: "Repuestos y Accesorios Zona Sur",
    description: "Autopartes premium, filtros originales, iluminación LED homologada y accesorios para vehículos 4x4",
    rating: 4.9,
    reviews: 142,
    distance: "1.6 km",
    location: "La Paz",
    zone: "Zona Sur - Calacoto",
    address: "Av. Ballivián Calle 12 #820, Calacoto, La Paz",
    phone: "+591 2 2774321",
    whatsapp: "+591 76234567",
    schedule: "Lun - Sáb · 09:00 - 19:00",
    services: [
      "Filtros y aceites sintéticos premium",
      "Pastillas de freno cerámicas",
      "Luminotecnia LED Philips",
      "Plumillas limpiaparabrisas Bosch",
      "Accesorios interiores",
    ],
    open: true,
    nit: "5829104012",
  },
];