import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    await requireAdmin();

    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at
      FROM users
      ORDER BY id DESC
    `);

    return NextResponse.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);

    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          {
            success: false,
            message: "No estás autenticado",
          },
          { status: 401 }
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            message: "No tienes permisos de administrador",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error obteniendo usuarios",
      },
      { status: 500 }
    );
  }
}

// POST - Crear usuario
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    const {
      name,
      email,
      password,
      phone,
      role,
    } = body;

    // Validaciones básicas
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nombre, email, contraseña y rol son obligatorios",
        },
        { status: 400 }
      );
    }

    // Comprobar si el email ya existe
    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "El correo ya está registrado",
        },
        { status: 409 }
      );
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Crear usuario
    const result = await pool.query(
      `
      INSERT INTO users
        (name, email, password_hash, phone, role)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        email,
        phone,
        role,
        created_at
      `,
      [
        name,
        email,
        passwordHash,
        phone || null,
        role,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Usuario creado correctamente",
        user: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando usuario:", error);

    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          {
            success: false,
            message: "No estás autenticado",
          },
          { status: 401 }
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            message: "No tienes permisos de administrador",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error creando usuario",
      },
      { status: 500 }
    );
  }
}