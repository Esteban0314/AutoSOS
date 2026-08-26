import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// PUT - Editar usuario
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de usuario inválido",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      email,
      password,
      phone,
      role,
    } = body;

    // Comprobar que el usuario existe
    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (existingUser.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }

    // Validaciones
    if (!name || !email || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Nombre, email y rol son obligatorios",
        },
        { status: 400 }
      );
    }

    // Comprobar que el email no pertenezca a OTRO usuario
    const emailExists = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      AND id <> $2
      `,
      [email, userId]
    );

    if (emailExists.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "El correo ya pertenece a otro usuario",
        },
        { status: 409 }
      );
    }

    let result;

    // Si enviamos contraseña, también actualizamos password_hash
    if (password) {
      const passwordHash = await bcrypt.hash(password, 12);

      result = await pool.query(
        `
        UPDATE users
        SET
          name = $1,
          email = $2,
          password_hash = $3,
          phone = $4,
          role = $5
        WHERE id = $6
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
          userId,
        ]
      );
    } else {
      // Si no enviamos contraseña,
      // conservamos la contraseña actual
      result = await pool.query(
        `
        UPDATE users
        SET
          name = $1,
          email = $2,
          phone = $3,
          role = $4
        WHERE id = $5
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
          phone || null,
          role,
          userId,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Usuario actualizado correctamente",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error actualizando usuario:", error);

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
        message: "Error actualizando usuario",
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();

    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de usuario inválido",
        },
        { status: 400 }
      );
    }

    // Evitar que el administrador se elimine a sí mismo
    if (admin.id === userId) {
      return NextResponse.json(
        {
          success: false,
          message: "No puedes eliminar tu propia cuenta de administrador",
        },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING
        id,
        name,
        email,
        role
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado correctamente",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error eliminando usuario:", error);

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
        message: "Error eliminando usuario",
      },
      { status: 500 }
    );
  }
}