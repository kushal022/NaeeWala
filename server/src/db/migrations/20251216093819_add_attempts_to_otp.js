/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export function up(knex) {
  return knex.schema.alterTable("otps", table => {
    table
      .integer("attempts")
      .notNullable()
      .defaultTo(0)
      .after("used"); 
  });
}


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable("otps", table => {
    table.dropColumn("attempts");
  });
}
