import BaseModel from "./BaseModel.js";

export default class BarberDocument extends BaseModel {
  static tableName = "barberdocument";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["barberId", "type", "url"],

      properties: {
        id: { type: "integer" },
        barberId: { type: "integer" },
        type: { type: "string" },
        url: { type: "string" },
        name: { type: ["string", "null"] },
        uploadedAt: { type: "string" }
      }
    };
  }
}
