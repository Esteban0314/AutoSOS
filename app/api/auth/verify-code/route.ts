import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { userId, code } = body;

    if (!userId || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario y código son obligatorios",
        },
        { status: 400 }
      );
    }

    // Buscar el código más reciente del usuario
    const result = await pool.query(
      `
      SELECT id, user_id, code_hash, expires_at, attempts, used
      FROM verification_codes
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No existe un código de verificación",
        },
        { status: 404 }
      );
    }

    const verification = result.rows[0];

    // Comprobar si ya fue utilizado
    if (verification.used) {
      return NextResponse.json(
        {
          success: false,
          message: "Este código ya fue utilizado",
        },
        { status: 400 }
      );
    }

    // Comprobar expiración
    if (new Date() > new Date(verification.expires_at)) {
      return NextResponse.json(
        {
          success: false,
          message: "El código ha expirado",
        },
        { status: 400 }
      );
    }

    // Limitar intentos
    if (verification.attempts >= 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Demasiados intentos. Solicita un nuevo código",
        },
        { status: 429 }
      );
    }

    // Comprobar código
    const codeCorrect = await bcrypt.compare(
      code.toString(),
      verification.code_hash
    );

    // Si es incorrecto, aumentar intentos
    if (!codeCorrect) {
      await pool.query(
        `
        UPDATE verification_codes
        SET attempts = attempts + 1
        WHERE id = $1
        `,
        [verification.id]
      );

      return NextResponse.json(
        {
          success: false,
          message: "Código incorrecto",
        },
        { status: 401 }
      );
    }

    // Marcar código como utilizado
    await pool.query(
      `
      UPDATE verification_codes
      SET used = TRUE
      WHERE id = $1
      `,
      [verification.id]
    );

    // Obtener información del usuario
    const userResult = await pool.query(
      `
      SELECT id, name, email, phone, role
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

   // Generar token aleatorio para la sesión
    const sessionToken = crypto.randomBytes(32).toString("hex");

    // Crear hash del token
    const tokenHash = await bcrypt.hash(sessionToken, 12);

    // La sesión durará 7 días
    const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    // Guardar sesión en PostgreSQL
    await pool.query(
    `
    INSERT INTO sessions (user_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    `,
    [user.id, tokenHash, expiresAt]
    );

    // Crear respuesta
    const response = NextResponse.json({
    success: true,
    message: "Verificación exitosa",
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    },
    });

    // Guardar token en cookie segura
    response.cookies.set("autosos_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error verificando código:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}