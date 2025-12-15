/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {

  // ================= USERS =================
  await knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("firstName");
    table.string("lastName");
    table.string("email").notNullable().unique();
    table.string("username").notNullable().unique();
    table.string("phone").unique();
    table.string("password").notNullable();
    table.enum("role", ["customer", "barber", "admin", "superAdmin"])
      .defaultTo("customer");
    table.string("avatar");
    table.float("wallet").defaultTo(0);
    table.boolean("isEmailVerified").defaultTo(false);
    table.boolean("isPhoneVerified").defaultTo(false);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });

  // ================= ADDRESSES =================
  await knex.schema.createTable("addresses", table => {
    table.increments("id").primary();
    table.string("street").notNullable();
    table.string("landmark");
    table.string("city").notNullable();
    table.string("state").notNullable();
    table.string("country").defaultTo("India");
    table.string("pincode").notNullable();
    table.float("lat");
    table.float("lng");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });

  // ================= BARBERS =================
  await knex.schema.createTable("barbers", table => {
    table.increments("id").primary();
    table.integer("userId").unsigned().notNullable().unique()
      .references("id").inTable("users").onDelete("CASCADE");
    table.integer("addressId").unsigned().unique()
      .references("id").inTable("addresses");
    table.enum("status", ["pending", "approved", "rejected"])
      .defaultTo("pending");
    table.float("rating").defaultTo(0);
    table.integer("ratingCount").defaultTo(0);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });

  // ================= BARBER SHOPS =================
  await knex.schema.createTable("barber_shops", table => {
    table.increments("id").primary();
    table.integer("barberId").unsigned().notNullable().unique()
      .references("id").inTable("barbers").onDelete("CASCADE");
    table.integer("addressId").unsigned().unique()
      .references("id").inTable("addresses");
    table.string("shopName").notNullable();
    table.text("description");
    table.string("licenseNo");
    table.string("shopType");
    table.string("openingTime");
    table.string("closingTime");
    table.json("photos");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });

  // ================= BANK =================
  await knex.schema.createTable("banks", table => {
    table.increments("id").primary();
    table.integer("barberId").unsigned().notNullable().unique()
      .references("id").inTable("barbers").onDelete("CASCADE");
    table.string("accountHolderName");
    table.string("accountNumber");
    table.string("ifsc");
    table.string("bankName");
    table.string("upiId");
    table.string("gstNumber").unique();
    table.string("aadhaarNumber").unique();
    table.string("panNumber").unique();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });

  // ================= BARBER DOCUMENTS =================
  await knex.schema.createTable("barber_documents", table => {
    table.increments("id").primary();
    table.integer("barberId").unsigned().notNullable()
      .references("id").inTable("barbers").onDelete("CASCADE");
    table.enum("type", [
      "AADHAAR",
      "PANCARD",
      "GST_CERT",
      "SHOP_PHOTO",
      "BANK_PROOF",
      "OTHER"
    ]).notNullable();
    table.string("url").notNullable();
    table.string("name");
    table.timestamp("uploadedAt").defaultTo(knex.fn.now());
  });

  // ================= SERVICES =================
  await knex.schema.createTable("services", table => {
    table.increments("id").primary();
    table.integer("barberId").unsigned().notNullable()
      .references("id").inTable("barbers").onDelete("CASCADE");
    table.string("title").notNullable();
    table.float("price").notNullable();
    table.integer("durationMinutes").notNullable();
    table.text("description");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });

  // ================= APPOINTMENTS =================
  await knex.schema.createTable("appointments", table => {
    table.increments("id").primary();
    table.integer("customerId").unsigned().notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.integer("barberId").unsigned().notNullable()
      .references("id").inTable("barbers").onDelete("CASCADE");
    table.integer("serviceId").unsigned()
      .references("id").inTable("services");
    table.dateTime("startAt").notNullable();
    table.dateTime("endAt");
    table.enum("status", [
      "pending",
      "accepted",
      "rejected",
      "completed",
      "cancelled"
    ]).defaultTo("pending");
    table.float("paymentAmount");
    table.string("paymentMethod");
    table.boolean("paid").defaultTo(false);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });

  // ================= REVIEWS =================
  await knex.schema.createTable("reviews", table => {
    table.increments("id").primary();
    table.integer("barberId").unsigned().notNullable()
      .references("id").inTable("barbers").onDelete("CASCADE");
    table.integer("customerId").unsigned().notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.integer("rating").notNullable();
    table.text("comment");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });

  // ================= SUBSCRIPTIONS =================
  await knex.schema.createTable("subscriptions", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.float("pricePerMonth").notNullable();
    table.json("features");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });

  // ================= OTP =================
  await knex.schema.createTable("otps", table => {
    table.increments("id").primary();
    table.string("to").notNullable();
    table.enum("via", ["EMAIL", "SMS"]).notNullable();
    table.string("code").notNullable();
    table.dateTime("expiresAt").notNullable();
    table.boolean("used").defaultTo(false);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });

  // ================= SESSIONS =================
  await knex.schema.createTable("sessions", table => {
    table.increments("id").primary();
    table.integer("userId").unsigned().notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.string("refreshToken").notNullable().unique();
    table.string("userAgent");
    table.string("ip");
    table.dateTime("expiresAt").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function down(knex) {
  await knex.schema
    .dropTableIfExists("sessions")
    .dropTableIfExists("otps")
    .dropTableIfExists("subscriptions")
    .dropTableIfExists("reviews")
    .dropTableIfExists("appointments")
    .dropTableIfExists("services")
    .dropTableIfExists("barber_documents")
    .dropTableIfExists("banks")
    .dropTableIfExists("barber_shops")
    .dropTableIfExists("barbers")
    .dropTableIfExists("addresses")
    .dropTableIfExists("users");
}



