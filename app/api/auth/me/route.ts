import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Obtener el token desde la cookie
    const sessionToken = request.cookies.get(
      "autosos_session"
    )?.value;

    // Si no existe cookie, no hay sesión
    if (!sessionToken) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "No hay una sesión activa",
        },
        { status: 401 }
      );
    }

    // Buscar sesiones que todavía no hayan expirado
    const sessionsResult = await pool.query(`
      SELECT
        sessions.id AS session_id,
        sessions.user_id,
        sessions.token_hash,
        sessions.expires_at,
        users.name,
        users.email,
        users.phone,
        users.role
      FROM sessions
      INNER JOIN users
        ON users.id = sessions.user_id
      WHERE sessions.expires_at > CURRENT_TIMESTAMP
      ORDER BY sessions.created_at DESC
    `);

    let authenticatedUser = null;

    // Comparar el token de la cookie con los hashes
    for (const session of sessionsResult.rows) {
      const tokenCorrect = await bcrypt.compare(
        sessionToken,
        session.token_hash
      );

      if (tokenCorrect) {
        authenticatedUser = {
          id: session.user_id,
          name: session.name,
          email: session.email,
          phone: session.phone,
          role: session.role,
        };

        break;
      }
    }

    // Si no encontramos una sesión válida
    if (!authenticatedUser) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "Sesión inválida o expirada",
        },
        { status: 401 }
      );
    }

    // Usuario autenticado
    return NextResponse.json({
      authenticated: true,
      user: authenticatedUser,
    });
  } catch (error) {
    console.error("Error obteniendo la sesión:", error);

    return NextResponse.json(
      {
        authenticated: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}