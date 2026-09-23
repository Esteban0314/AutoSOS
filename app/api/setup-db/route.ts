import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // 1. Tabla users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(30),
        role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Actualizar constraint de roles en users para soportar roles específicos de negocio
    await pool.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
      ALTER TABLE users ADD CONSTRAINT users_role_check 
        CHECK (role IN ('CUSTOMER', 'ADMIN', 'WORKSHOP', 'TOW', 'PARTS_STORE', 'BUSINESS'));
    `);

    // 2. Tabla vehicles
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        plate VARCHAR(20) NOT NULL,
        brand VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        year INTEGER NOT NULL,
        color VARCHAR(30) NOT NULL,
        type VARCHAR(30) NOT NULL,
        fuel_type VARCHAR(30),
        transmission VARCHAR(30),
        engine VARCHAR(50),
        vin VARCHAR(50),
        mileage INTEGER,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_vehicle_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
      );
    `);

    // Asegurar columna image_url si la tabla ya existía
    await pool.query(`
      ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS image_url TEXT;
    `);

    // 3. Tabla verification_codes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        code_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        used BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_verification_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
      );
    `);

    // 4. Tabla sessions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token_hash VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_session_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
      );
    `);

    // 5. Tabla businesses (Negocios de La Paz: Talleres, Grúas, Repuestos)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        type VARCHAR(30) NOT NULL CHECK (type IN ('workshop', 'tow', 'store')),
        name VARCHAR(150) NOT NULL,
        description TEXT,
        rating NUMERIC(2,1) DEFAULT 4.8,
        reviews INTEGER DEFAULT 0,
        distance VARCHAR(30) DEFAULT '1.0 km',
        location VARCHAR(100) DEFAULT 'La Paz',
        zone VARCHAR(100) NOT NULL,
        address VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        whatsapp VARCHAR(50),
        schedule VARCHAR(100) NOT NULL,
        services TEXT[] NOT NULL DEFAULT '{}',
        open BOOLEAN DEFAULT TRUE,
        nit VARCHAR(50),
        specialties TEXT[],
        bay_capacity INTEGER,
        tow_type VARCHAR(50),
        tow_capacity VARCHAR(50),
        has_delivery BOOLEAN DEFAULT FALSE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Tabla service_packages (Paquetes de Taller diferenciados por tamaño)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS service_packages (
        id SERIAL PRIMARY KEY,
        business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(50) DEFAULT 'Mantenimiento',
        description TEXT,
        includes TEXT[] NOT NULL DEFAULT '{}',
        price_small NUMERIC(10,2) NOT NULL,
        price_medium NUMERIC(10,2) NOT NULL,
        price_large NUMERIC(10,2) NOT NULL,
        duration_estimate VARCHAR(50) NOT NULL,
        is_popular BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Poblar datos reales de La Paz si la tabla businesses está vacía
    const existingCount = await pool.query("SELECT COUNT(*) FROM businesses");
    const count = parseInt(existingCount.rows[0].count, 10);

    if (count === 0) {
      // Insertar negocios reales de La Paz
      const businessesData = [
        // TALLERES
        {
          type: "workshop",
          name: "Bosch Car Service La Paz",
          description: "Centro automotriz certificado en diagnóstico computarizado, inyección y mantenimiento integral",
          rating: 4.9,
          reviews: 215,
          distance: "1.5 km",
          zone: "Zona Sur - Calacoto",
          address: "Av. Costanera #1040 entre calles 15 y 16, Calacoto, La Paz",
          phone: "+591 2 2794500",
          whatsapp: "+591 76789012",
          schedule: "Lun - Vie · 08:00 - 18:30 | Sáb · 08:30 - 13:00",
          services: ["Diagnóstico computarizado Bosch", "Inyección electrónica", "Sistema de frenos ABS/ESP", "Mantenimiento preventivo", "Aire acondicionado automotriz", "Baterías y alternadores"],
          open: true,
          nit: "1028475021",
          bay_capacity: 6,
          specialties: ["Inyección Electrónica", "Frenos y Suspensión", "Scanner Avanzado", "Climatización"]
        },
        {
          type: "workshop",
          name: "Taller Mecánico San Cristóbal",
          description: "Especialistas en suspensión 4x4, tren delantero, alineación computarizada y mecánica general",
          rating: 4.8,
          reviews: 148,
          distance: "1.8 km",
          zone: "Zona Sur - Calacoto",
          address: "Calle 15 de Calacoto esq. Los Sauces #210, Calacoto, La Paz",
          phone: "+591 77234567",
          whatsapp: "+591 77234567",
          schedule: "Lun - Sáb · 08:00 - 18:00",
          services: ["Suspensión y dirección 4x4", "Alineación y balanceo láser", "Mantenimiento de cajas mecánicas", "Frenos cerámicos", "Cambio de embragues"],
          open: true,
          nit: "3491823019",
          bay_capacity: 4,
          specialties: ["Suspensión 4x4", "Frenos", "Embragues"]
        },
        {
          type: "workshop",
          name: "AutoTotal Centro Automotriz",
          description: "Servicio express de cambio de aceite, afinación de motor y revisión integral multimarca",
          rating: 4.7,
          reviews: 182,
          distance: "850 m",
          zone: "Zona Central",
          address: "Av. Ismael Montes #680, Centro, La Paz",
          phone: "+591 2 2281234",
          whatsapp: "+591 78912345",
          schedule: "Lun - Sáb · 08:30 - 19:00",
          services: ["Mantenimiento preventivo express", "Cambio de fluidos y filtros", "Alineación 3D", "Frenos", "Diagnóstico scanner OBD-II"],
          open: true,
          nit: "4829102013",
          bay_capacity: 5,
          specialties: ["Mantenimiento Express", "Fluidos", "Alineación 3D"]
        },
        {
          type: "workshop",
          name: "Taller Mecánico El Tunari",
          description: "Mecánica pesada, reparación de motores a gasolina/diésel, rectificación y cajas de transmisión",
          rating: 4.7,
          reviews: 94,
          distance: "1.2 km",
          zone: "San Pedro",
          address: "Calle Nicolás Acosta #380, San Pedro, La Paz",
          phone: "+591 71567890",
          whatsapp: "+591 71567890",
          schedule: "Lun - Sáb · 08:00 - 18:30",
          services: ["Reparación de motores", "Rectificación de culatas", "Cajas de cambio", "Embragues", "Electricidad automotriz"],
          open: true,
          nit: "2847193014",
          bay_capacity: 3,
          specialties: ["Motores", "Cajas", "Electricidad"]
        },
        {
          type: "workshop",
          name: "Taller Especializado ToyoPaz",
          description: "Especialistas en vehículos Toyota, Lexus y marcas japonesas con repuestos genuinos",
          rating: 4.9,
          reviews: 167,
          distance: "2.1 km",
          zone: "Miraflores",
          address: "Av. Busch #1420 esq. Villalobos, Miraflores, La Paz",
          phone: "+591 72089123",
          whatsapp: "+591 72089123",
          schedule: "Lun - Vie · 08:00 - 18:30 | Sáb · 08:30 - 14:00",
          services: ["Especialista en Toyota y marcas japonesas", "Repuestos genuinos", "Mantenimiento 4x4", "Inyección VVT-i", "Frenos y suspensión"],
          open: true,
          nit: "5192840018",
          bay_capacity: 4,
          specialties: ["Toyota/Lexus", "VVT-i", "4x4"]
        },

        // GRÚAS
        {
          type: "tow",
          name: "Grúas La Paz 24/7 Auxilio Vial",
          description: "Servicio de auxilio vial rápido con plataformas hidráulicas modernas en toda La Paz y El Alto",
          rating: 4.8,
          reviews: 139,
          distance: "1.9 km",
          zone: "Miraflores / Cobertura Departamental",
          address: "Av. Saavedra #1890, Miraflores, La Paz",
          phone: "+591 70123456",
          whatsapp: "+591 70123456",
          schedule: "24 horas los 365 días",
          services: ["Grúa de plataforma hidráulica", "Rescate en autopista La Paz - El Alto", "Paso de corriente y auxilio de batería", "Apertura de puertas", "Auxilio en carretera Yungas/Oruro"],
          open: true,
          tow_type: "Plataforma hidráulica",
          tow_capacity: "Hasta 5 Toneladas"
        },
        {
          type: "tow",
          name: "Grúas SOS Bolivia",
          description: "Rescate urbano y carretero 24/7 para automóviles, vagonetas y vehículos 4x4",
          rating: 4.7,
          reviews: 112,
          distance: "1.1 km",
          zone: "Sopocachi / Cobertura Urbana",
          address: "Av. 20 de Octubre #2240, Sopocachi, La Paz",
          phone: "+591 71239876",
          whatsapp: "+591 71239876",
          schedule: "24 horas",
          services: ["Plataformas para autos bajos y deportivos", "Remolque de vagonetas 4x4", "Auxilio mecánico en sitio", "Cambio de llanta"],
          open: true,
          tow_type: "Plataforma basculante",
          tow_capacity: "Hasta 3.5 Toneladas"
        },
        {
          type: "tow",
          name: "Grúas y Remolques Illimani",
          description: "Flota de grúas pesadas para rescate en barrancos, pendientes y autopistas interdepartamentales",
          rating: 4.6,
          reviews: 88,
          distance: "3.5 km",
          zone: "El Alto y Autopista",
          address: "Av. 6 de Marzo #450, El Alto / Autopista La Paz",
          phone: "+591 73045678",
          whatsapp: "+591 73045678",
          schedule: "24 horas",
          services: ["Grúas de arrastre pesado", "Rescate en pendientes pronunciadas", "Traslado interdepartamental", "Remolque de minibuses y camiones"],
          open: true,
          tow_type: "Arrastre pesado y pluma",
          tow_capacity: "Hasta 12 Toneladas"
        },
        {
          type: "tow",
          name: "Auxilio Vial Cóndor Grúas",
          description: "Base operativa permanente en Zona Sur para auxilio rápido en Calacoto, Achumani y Cota Cota",
          rating: 4.9,
          reviews: 96,
          distance: "2.3 km",
          zone: "Zona Sur (Calacoto, Achumani, Los Pinos)",
          address: "Calle 21 de Calacoto #150, Calacoto, La Paz",
          phone: "+591 76543210",
          whatsapp: "+591 76543210",
          schedule: "24 horas",
          services: ["Respuesta rápida en Zona Sur", "Plataforma hidráulica", "Suministro de combustible", "Paso de corriente 12V/24V"],
          open: true,
          tow_type: "Plataforma hidráulica",
          tow_capacity: "Hasta 4 Toneladas"
        },

        // REPUESTOS
        {
          type: "store",
          name: "Autorepuestos Illimani",
          description: "Venta mayorista y minorista de repuestos originales y alternativos para Toyota, Suzuki y Nissan",
          rating: 4.9,
          reviews: 204,
          distance: "650 m",
          zone: "San Pedro / Centro",
          address: "Calle Murillo #745 entre Sagárnaga y Santa Cruz, San Pedro, La Paz",
          phone: "+591 2 2314567",
          whatsapp: "+591 74567890",
          schedule: "Lun - Sáb · 08:30 - 19:30",
          services: ["Repuestos originales y alternativos japoneses", "Pastillas y zapatas de freno", "Kits de distribución y correas", "Filtros Mann y Denso", "Delivery en La Paz y El Alto"],
          open: true,
          nit: "1928471015",
          has_delivery: true
        },
        {
          type: "store",
          name: "Importadora ToyoParts La Paz",
          description: "Importadores directos de partes de suspensión, amortiguadores KYB, bombas de agua y embragues",
          rating: 4.8,
          reviews: 178,
          distance: "900 m",
          zone: "Zona Central",
          address: "Av. Ismael Montes #890, Centro, La Paz",
          phone: "+591 2 2289900",
          whatsapp: "+591 79012345",
          schedule: "Lun - Sáb · 08:30 - 19:00",
          services: ["Repuestos genuinos Toyota y Suzuki", "Amortiguadores KYB y Tokico", "Bombas de agua y gasolina", "Bujías Iridium NGK/Denso", "Embragues Aisin"],
          open: true,
          nit: "3928174011",
          has_delivery: true
        },
        {
          type: "store",
          name: "Repuestos y Baterías La Paz Central",
          description: "Distribuidor oficial de baterías con garantía y lubricantes sintéticos de alto rendimiento",
          rating: 4.8,
          reviews: 125,
          distance: "1.7 km",
          zone: "Miraflores",
          address: "Av. Busch #1120, Miraflores, La Paz",
          phone: "+591 77561234",
          whatsapp: "+591 77561234",
          schedule: "Lun - Sáb · 08:00 - 19:30 | Dom · 09:00 - 13:00",
          services: ["Baterías Moura, Bosch y Toyo con garantía", "Instalación y test de alternador", "Lubricantes sintéticos Mobil 1, Motul, Castrol", "Líquidos de freno Valvoline"],
          open: true,
          nit: "4819203016",
          has_delivery: true
        },
        {
          type: "store",
          name: "Casa del Freno y Embrague San Pedro",
          description: "Especialistas en discos, pastillas cerámicas, tambores, cilindros de freno y kits de embrague",
          rating: 4.7,
          reviews: 110,
          distance: "1.3 km",
          zone: "San Pedro",
          address: "Calle Cañada Strongest #1890, San Pedro, La Paz",
          phone: "+591 71987654",
          whatsapp: "+591 71987654",
          schedule: "Lun - Sáb · 08:30 - 18:30",
          services: ["Discos de freno y tambores", "Kits de embrague LUK y Valeo", "Cilindros maestros y bombines", "Líquidos de freno DOT3 y DOT4", "Rectificación de discos"],
          open: true,
          nit: "2948102017",
          has_delivery: false
        },
        {
          type: "store",
          name: "Repuestos y Accesorios Zona Sur",
          description: "Autopartes premium, filtros originales, iluminación LED homologada y accesorios para vehículos 4x4",
          rating: 4.9,
          reviews: 142,
          distance: "1.6 km",
          zone: "Zona Sur - Calacoto",
          address: "Av. Ballivián Calle 12 #820, Calacoto, La Paz",
          phone: "+591 2 2774321",
          whatsapp: "+591 76234567",
          schedule: "Lun - Sáb · 09:00 - 19:00",
          services: ["Filtros y aceites sintéticos premium", "Pastillas de freno cerámicas", "Luminotecnia LED Philips", "Plumillas limpiaparabrisas Bosch", "Accesorios interiores"],
          open: true,
          nit: "5829104012",
          has_delivery: true
        }
      ];

      for (const b of businessesData) {
        const inserted = await pool.query(
          `
          INSERT INTO businesses (
            type, name, description, rating, reviews, distance, zone, address,
            phone, whatsapp, schedule, services, open, nit, specialties,
            bay_capacity, tow_type, tow_capacity, has_delivery
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          RETURNING id, type
          `,
          [
            b.type, b.name, b.description, b.rating, b.reviews, b.distance,
            b.zone, b.address, b.phone, b.whatsapp || null, b.schedule,
            b.services, b.open, b.nit || null, b.specialties || null,
            b.bay_capacity || null, b.tow_type || null, b.tow_capacity || null,
            b.has_delivery || false
          ]
        );

        // Si es taller, insertar paquetes de mantenimiento diferenciados por tamaño de auto
        if (inserted.rows[0].type === "workshop") {
          const businessId = inserted.rows[0].id;
          const packages = [
            {
              name: "Mantenimiento Preventivo Básico",
              category: "Preventivo",
              description: "Revisión integral de 25 puntos clave, cambio de aceite de motor y filtro, inspección de frenos y niveles.",
              includes: [
                "Cambio de aceite de motor multigrado",
                "Filtro de aceite nuevo",
                "Revisión y limpieza de frenos delanteros y traseros",
                "Comprobación de niveles (frenos, refrigerante, dirección)",
                "Inspección de luces, batería y presión de neumáticos",
                "Informe técnico de estado general"
              ],
              price_small: 180.00,
              price_medium: 240.00,
              price_large: 320.00,
              duration_estimate: "1.5 a 2 horas",
              is_popular: true
            },
            {
              name: "Afinación Mayor y Aceite Sintético",
              category: "Afinación",
              description: "Mantenimiento profundo para optimizar el rendimiento, consumo de combustible y emisiones en la altura de La Paz.",
              includes: [
                "Cambio de aceite 100% sintético de alta calidad",
                "Filtro de aceite y filtro de aire nuevos",
                "Limpieza y calibración de cuerpo de aceleración",
                "Limpieza de inyectores por ultrasonido / aditivo pro",
                "Inspección o reemplazo de bujías",
                "Escaneo computarizado OBD-II y reseteo de servicio"
              ],
              price_small: 350.00,
              price_medium: 460.00,
              price_large: 620.00,
              duration_estimate: "3 a 4 horas",
              is_popular: true
            },
            {
              name: "Servicio Integral de Frenos y Seguridad",
              category: "Frenos",
              description: "Mantenimiento completo del sistema de frenado para máxima seguridad en las pendientes pronunciadas de La Paz.",
              includes: [
                "Cambio de pastillas de freno delanteras (calidad premium)",
                "Rectificación de discos de freno (ambos lados)",
                "Purga y reemplazo de líquido de frenos DOT4",
                "Regulación de freno de mano / tambores traseros",
                "Prueba dinámica de frenado en rampa"
              ],
              price_small: 220.00,
              price_medium: 310.00,
              price_large: 420.00,
              duration_estimate: "2.5 horas",
              is_popular: false
            },
            {
              name: "Diagnóstico Computarizado & Escáner Completo",
              category: "Diagnóstico",
              description: "Lectura profunda de parámetros en tiempo real de motor, transmisión, ABS, Airbag y mapeo de sensores.",
              includes: [
                "Escaneo electrónico multimarca",
                "Lectura y borrado de códigos de falla (DTC)",
                "Prueba de sensores de oxígeno y flujo de aire (MAF/MAP)",
                "Test de carga de alternador y vida útil de batería",
                "Reporte digital entregado por WhatsApp/Email"
              ],
              price_small: 120.00,
              price_medium: 120.00,
              price_large: 150.00,
              duration_estimate: "45 minutos",
              is_popular: false
            }
          ];

          for (const pkg of packages) {
            await pool.query(
              `
              INSERT INTO service_packages (
                business_id, name, category, description, includes,
                price_small, price_medium, price_large, duration_estimate, is_popular
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
              `,
              [
                businessId, pkg.name, pkg.category, pkg.description, pkg.includes,
                pkg.price_small, pkg.price_medium, pkg.price_large, pkg.duration_estimate, pkg.is_popular
              ]
            );
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Base de datos Neon configurada y poblada exitosamente con datos reales de La Paz y paquetes de taller.",
    });
  } catch (error) {
    console.error("Error configurando la base de datos:", error);

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo configurar la base de datos",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}