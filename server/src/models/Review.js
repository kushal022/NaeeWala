import BaseModel from "./BaseModel.js";

export default class Review extends BaseModel {
  static tableName = "reviews";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["rating"],
      properties: {
        id: { type: "integer" },
        barberId: { type: "integer" },
        customerId: { type: "integer" },
        rating: { type: "integer" },
        comment: { type: ["string", "null"] },
        createdAt: { type: "string" }
      }
    };
  }
}
