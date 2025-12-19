import BaseModel from "./BaseModel.js";

export default class Appointment extends BaseModel {
  static tableName = "appointments";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["customerId", "barberId", "startAt"],

      properties: {
        id: { type: "integer" },
        customerId: { type: "integer" },
        barberId: { type: "integer" },
        serviceId: { type: ["integer", "null"] },
        startAt: { type: "string" },
        endAt: { type: ["string", "null"] },
        status: { type: "string" },
        paymentAmount: { type: ["number", "null"] },
        paymentMethod: { type: ["string", "null"] },
        paid: { type: "boolean" },
        createdAt: { type: "string" }
      }
    };
  }
}
