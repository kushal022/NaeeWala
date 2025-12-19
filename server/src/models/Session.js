import BaseModel from "./BaseModel.js";

export default class Session extends BaseModel {
  static tableName = "sessions";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId", "refreshToken"],

      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        refreshToken: { type: "string" },
        userAgent: { type: ["string", "null"] },
        ip: { type: ["string", "null"] },
        expiresAt: { type: "string",format:"date-time" },
        createdAt: { type: "string" }
      }
    };
  }
}
