require("dotenv").config();

const bcrypt = require("bcrypt");
const { Client } = require("pg");

async function crearAdmin() {
  const nombre = "Julieta";
  const email = "luzjulietat@gmail.com";
  const contraseña = "031404";
  const telefono = "62470920";

  const passwordHash = await bcrypt.hash(contraseña, 10);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const resultado = await client.query(
      `INSERT INTO users
        (name, email, password_hash, phone, role, created_at, updated_at)
       VALUES
        ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, name, email, role`,
      [
        nombre,
        email,
        passwordHash,
        telefono,
        "ADMIN",
      ]
    );

    console.log("Usuario administrador creado:");
    console.log(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear el usuario:", error);
  } finally {
    await client.end();
  }
}

crearAdmin();