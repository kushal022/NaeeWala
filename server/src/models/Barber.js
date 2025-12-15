import BaseModel from "./BaseModel.js";

export default class Barber extends BaseModel {
  static tableName = "barber";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId"],

      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        addressId: { type: ["integer", "null"] },
        status: { type: "string" },
        subscriptionId: { type: ["integer", "null"] },
        rating: { type: "number" },
        ratingCount: { type: "integer" },
        createdAt: { type: "string" }
      }
    };
  }

  static get relationMappings() {
    const User = require("./User.js").default;
    const BarberShop = require("./BarberShop.js").default;
    const Bank = require("./Bank.js").default;

    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "barber.userId",
          to: "user.id"
        }
      },
      shop: {
        relation: BaseModel.HasOneRelation,
        modelClass: BarberShop,
        join: {
          from: "barber.id",
          to: "barbershop.barberId"
        }
      },
      bankDetail: {
        relation: BaseModel.HasOneRelation,
        modelClass: Bank,
        join: {
          from: "barber.id",
          to: "bank.barberId"
        }
      }
    };
  }
}
