import BaseModel from "./BaseModel.js";

export default class Bank extends BaseModel {
  static tableName = "banks";

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        barberId: { type: "integer" },
        accountHolderName: { type: ["string", "null"] },
        accountNumber: { type: ["string", "null"] },
        ifsc: { type: ["string", "null"] },
        bankName: { type: ["string", "null"] },
        upiId: { type: ["string", "null"] },
        gstNumber: { type: ["string", "null"] },
        aadhaarNumber: { type: ["string", "null"] },
        panNumber: { type: ["string", "null"] },
        createdAt: { type: "string" }
      }
    };
  }
}
