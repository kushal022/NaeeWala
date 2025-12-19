import BaseModel from "./BaseModel.js";

export default class Subscription extends BaseModel {
  static tableName = "subscriptions";

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        barberId: { type: ["integer", "null"] },
        name: { type: "string" },
        pricePerMonth: { type: "number" },
        features: { type: ["object", "array", "null"] },
        createdAt: { type: "string" }
      }
    };
  }
}
