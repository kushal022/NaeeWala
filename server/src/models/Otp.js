import BaseModel from "./BaseModel.js";

export default class Otp extends BaseModel {
  static tableName = "otps";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["to", "code"],

      properties: {
        id: { type: "integer" },
        to: { type: "string" },
        via: { type: "string" }, // EMAIL||SMS
        code: { type: "string" },
        expiresAt: { type: "string" },
        used: { type: "boolean" },
        attempts: {type: "integer"},
        createdAt: { type: "string" }
      }
    };
  }
}
