import BaseModel from "./BaseModel.js";

export default class Subscription extends BaseModel {
  static tableName = "subscription";

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        pricePerMonth: { type: "number" },
        features: { type: ["array", "null"], items: { type: "string" } },
        createdAt: { type: "string" }
      }
    };
  }
}
