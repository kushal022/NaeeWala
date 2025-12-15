import knex from "./knex.js";

async function reset() {
  await knex.raw("DROP TABLE IF EXISTS knex_migrations");
  await knex.raw("DROP TABLE IF EXISTS knex_migrations_lock");
  console.log("✅ Knex migration tables removed");
  process.exit(0);
}

reset();
