import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("autosos_session")?.value;

    if (sessionToken) {
      // Opcionalmente invalidar la sesión en la base de datos
      const sessionsResult = await pool.query(`
        SELECT id, token_hash
        FROM sessions
        WHERE expires_at > CURRENT_TIMESTAMP
      `);

      for (const session of sessionsResult.rows) {
        const match = await bcrypt.compare(sessionToken, session.token_hash);
        if (match) {
          await pool.query("DELETE FROM sessions WHERE id = $1", [session.id]);
          break;
        }
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });

    // Eliminar la cookie de sesión inmediatamente
    response.cookies.set("autosos_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);

    // Incluso si falla la BD, nos aseguramos de borrar la cookie en el cliente
    const response = NextResponse.json({
      success: true,
      message: "Sesión cerrada",
    });

    response.cookies.set("autosos_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      maxAge: 0,
      path: "/",
    });

    return response;
  }
}
