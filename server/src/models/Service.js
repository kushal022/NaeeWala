import BaseModel from "./BaseModel.js";

export default class Service extends BaseModel {
  static tableName = "services";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["barberId", "title", "price"],
      properties: {
        id: { type: "integer" },
        barberId: { type: "integer" },
        title: { type: "string" },
        price: { type: "number" },
        durationMinutes: { type: "integer" },
        description: { type: ["string", "null"] },
        createdAt: { type: "string" }
      }
    };
  }
}
