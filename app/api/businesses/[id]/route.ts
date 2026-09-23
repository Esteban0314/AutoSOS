import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { businesses as fallbackBusinesses, defaultPackages, ServicePackage } from "@/data/businesses";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Buscar negocio en Neon DB
    const bizResult = await pool.query(
      `
      SELECT 
        id, type, name, description, rating, reviews, distance,
        location, zone, address, phone, whatsapp, schedule,
        services, open, nit, specialties, bay_capacity,
        tow_type, tow_capacity, has_delivery, created_at
      FROM businesses
      WHERE id = $1
      `,
      [isNaN(Number(id)) ? 1 : Number(id)]
    );

    let business = bizResult.rows[0];

    // Fallback a mock data si no existe en BD
    if (!business) {
      business = fallbackBusinesses.find((b) => b.id === id) || fallbackBusinesses[0];
    }

    // Buscar paquetes si es taller
    let packages: ServicePackage[] = [];
    if (business.type === "workshop") {
      const pkgResult = await pool.query(
        `
        SELECT 
          id, name, category, description, includes,
          price_small, price_medium, price_large,
          duration_estimate, is_popular
        FROM service_packages
        WHERE business_id = $1
        ORDER BY id ASC
        `,
        [business.id]
      );

      if (pkgResult.rows.length > 0) {
        packages = pkgResult.rows.map((p) => ({
          id: p.id.toString(),
          name: p.name,
          category: p.category,
          description: p.description,
          includes: p.includes,
          priceSmall: Number(p.price_small),
          priceMedium: Number(p.price_medium),
          priceLarge: Number(p.price_large),
          durationEstimate: p.duration_estimate,
          isPopular: p.is_popular,
        }));
      } else {
        packages = defaultPackages;
      }
    }

    return NextResponse.json({
      success: true,
      business: {
        ...business,
        id: business.id.toString(),
        packages,
      },
    });
  } catch (error) {
    console.error("Error obteniendo detalle de negocio:", error);
    const { id } = await params;
    const fallback = fallbackBusinesses.find((b) => b.id === id) || fallbackBusinesses[0];
    return NextResponse.json({
      success: true,
      business: {
        ...fallback,
        packages: defaultPackages,
      },
    });
  }
}
