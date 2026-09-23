import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { businesses as fallbackBusinesses } from "@/data/businesses";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    let query = `
      SELECT 
        id, type, name, description, rating, reviews, distance,
        location, zone, address, phone, whatsapp, schedule,
        services, open, nit, specialties, bay_capacity,
        tow_type, tow_capacity, has_delivery, created_at
      FROM businesses
      WHERE 1=1
    `;
    const params: (string | boolean)[] = [];

    if (type && type !== "all") {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      query += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(zone) LIKE $${params.length})`;
    }

    query += ` ORDER BY id ASC`;

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      businesses: result.rows.length > 0 ? result.rows : fallbackBusinesses,
    });
  } catch (error) {
    console.error("Error obteniendo negocios de la BD:", error);
    return NextResponse.json({
      success: true,
      businesses: fallbackBusinesses,
    });
  }
}
