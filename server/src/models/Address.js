import BaseModel from "./BaseModel.js";

export default class Address extends BaseModel {
  static tableName = "addresses";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["street", "city", "state", "pincode"],

      properties: {
        id: { type: "integer" },
        street: { type: "string" },
        landmark: { type: ["string", "null"] },
        city: { type: "string" },
        state: { type: "string" },
        country: { type: "string" },
        pincode: { type: "string" },
        lat: { type: "number" },
        lng: { type: "number" },
        createdAt: { type: "string" }
      }
    };
  }
}
