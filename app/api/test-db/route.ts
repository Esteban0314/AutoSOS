import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW()");

    return NextResponse.json({
      success: true,
      message: "Conexión con PostgreSQL exitosa",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Error de conexión:", error);

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo conectar con PostgreSQL",
      },
      { status: 500 }
    );
  }
}