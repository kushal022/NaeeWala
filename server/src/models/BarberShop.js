import BaseModel from "./BaseModel.js";

export default class BarberShop extends BaseModel {
  static tableName = "barbershop";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["barberId", "shopName"],

      properties: {
        id: { type: "integer" },
        barberId: { type: "integer" },
        addressId: { type: ["integer", "null"] },
        shopName: { type: "string" },
        description: { type: ["string", "null"] },
        licenseNo: { type: ["string", "null"] },
        shopType: { type: ["string", "null"] },
        openingTime: { type: ["string", "null"] },
        closingTime: { type: ["string", "null"] },
        photos: { type: ["array", "null"], items: { type: "string" } },
        createdAt: { type: "string" }
      }
    };
  }
}
