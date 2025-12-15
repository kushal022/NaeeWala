import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export async function createDatabaseIfNotExists() {
  try {
    const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
  );

  console.log(`✅ Database '${process.env.DB_NAME}' is ready!`);
  await connection.end();
  } catch (error) {
     console.error("❌ DB creation failed:", error.message);
    process.exit(1);
  }
}

createDatabaseIfNotExists();
