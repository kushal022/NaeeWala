import BaseModel from "./BaseModel.js";

export default class Otp extends BaseModel {
  static tableName = "otp";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["to", "code"],

      properties: {
        id: { type: "integer" },
        to: { type: "string" },
        via: { type: "string" },
        code: { type: "string" },
        expiresAt: { type: "string" },
        used: { type: "boolean" },
        createdAt: { type: "string" }
      }
    };
  }
}
