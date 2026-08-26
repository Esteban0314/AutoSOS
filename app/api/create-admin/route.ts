import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function GET() {
  try {
    const name = "Administrador";
    const email = "admin@autosos.com";
    const password = "Admin123!";
    const role = "ADMIN";

    // Verificar si el administrador ya existe
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: "El administrador ya existe",
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear administrador
    const result = await pool.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role
      `,
      [name, email, hashedPassword, role]
    );

    return NextResponse.json({
      success: true,
      message: "Administrador creado correctamente",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error creando administrador:", error);

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo crear el administrador",
      },
      { status: 500 }
    );
  }
}