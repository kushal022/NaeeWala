import BaseModel from "./BaseModel.js";

export default class User extends BaseModel {
  static tableName = "users";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "username", "password"],

      properties: {
        id: { type: "integer" },
        firstName: { type: ["string", "null"] },
        lastName: { type: ["string", "null"] },
        email: { type: "string" },
        username: { type: "string" },
        phone: { type: ["string", "null"] },
        password: { type: "string" },
        role: { type: "string" },
        avatar: { type: ["string", "null"] },
        wallet: { type: "number" },
        isEmailVerified: { type: "boolean" },
        isPhoneVerified: { type: "boolean" },
        addressId: { type: ["integer", "null"] },
        createdAt: { type: "string" }
      }
    };
  }

  static get relationMappings() {
    const Address = import ("./Address.js").default;
    const Barber = import ("./Barber.js").default;
    const Session = import ("./Session.js").default;

    return {
      address: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Address,
        join: {
          from: "user.addressId",
          to: "address.id"
        }
      },
      barber: {
        relation: BaseModel.HasOneRelation,
        modelClass: Barber,
        join: {
          from: "user.id",
          to: "barber.userId"
        }
      },
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: Session,
        join: {
          from: "user.id",
          to: "session.userId"
        }
      }
    };
  }
}
