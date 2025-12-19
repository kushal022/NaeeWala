/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  await knex.schema.alterTable("sessions", table => {
    table.dateTime("expiresAt").notNullable().alter();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function down(knex) {
  await knex.schema.alterTable("sessions", table => {
    table.string("expiresAt").notNullable().alter();
  });
}



