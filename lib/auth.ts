import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();

    const sessionToken = cookieStore.get(
      "autosos_session"
    )?.value;

    if (!sessionToken) {
      return null;
    }

    // Buscar sesiones que todavía estén activas
    const result = await pool.query(`
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

    // Comprobar el token contra los hashes
    for (const session of result.rows) {
      const tokenCorrect = await bcrypt.compare(
        sessionToken,
        session.token_hash
      );

      if (tokenCorrect) {
        return {
          id: session.user_id,
          name: session.name,
          email: session.email,
          phone: session.phone,
          role: session.role,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error obteniendo usuario actual:", error);
    return null;
  }
}


// Usuario autenticado
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}


// Solo administradores
export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return user;
}