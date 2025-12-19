import BaseModel from "./BaseModel.js";
// import User from "./User.js";
// import BarberShop from "./BarberShop.js";
// import Bank from "./Bank.js";
// import Subscription from "./Subscription.js";

export default class Barber extends BaseModel {
  static tableName = "barbers";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId"],
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        addressId: { type: ["integer", "null"] },
        status: { type: "string" },
        rating: { type: "number" },
        ratingCount: { type: "integer" },
        createdAt: { type: "string" }
      }
    };
  }

  static get relationMappings() {
     const User = import("./User.js").default;
    const BarberShop = import("./BarberShop.js").default;
    const Bank = import("./Bank.js").default;
    const Subscription = import("./Subscription.js").default;
    return {user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "barbers.userId",
        to: "users.id"
      }
    },
    shop: {
      relation: BaseModel.HasOneRelation,
      modelClass: BarberShop,
      join: {
        from: "barbers.id",
        to: "barberShops.barberId"
      }
    },
    bankDetail: {
      relation: BaseModel.HasOneRelation,
      modelClass: Bank,
      join: {
        from: "barbers.id",
        to: "banks.barberId"
      }
    },
    subscriptions: {
      relation: BaseModel.HasManyRelation,
      modelClass: Subscription,
      join: {
        from: "barbers.id",
        to: "subscriptions.barberId"
      }
    }}
  };
}



// import BaseModel from "./BaseModel.js";

// export default class Barber extends BaseModel {
//   static tableName = "barbers";

//   static get jsonSchema() {
//     return {
//       type: "object",
//       required: ["userId"],

//       properties: {
//         id: { type: "integer" },
//         userId: { type: "integer" },
//         addressId: { type: ["integer", "null"] },
//         status: { type: "string" },
//         subscriptionId: { type: ["integer", "null"] },
//         rating: { type: "number" },
//         ratingCount: { type: "integer" },
//         createdAt: { type: "string" }
//       }
//     };
//   }

//   static get relationMappings() {
//     const User = import("./User.js").default;
//     const BarberShop = import("./BarberShop.js").default;
//     const Bank = import("./Bank.js").default;

//     return {
//       user: {
//         relation: BaseModel.BelongsToOneRelation,
//         modelClass: User,
//         join: {
//           from: "barber.userId",
//           to: "user.id"
//         }
//       },
//       shop: {
//         relation: BaseModel.HasOneRelation,
//         modelClass: BarberShop,
//         join: {
//           from: "barbers.id",
//           to: "barber_shops.barberId"
//         }
//       },
//       bankDetail: {
//         relation: BaseModel.HasOneRelation,
//         modelClass: Bank,
//         join: {
//           from: "barbers.id",
//           to: "banks.barberId"
//         }
//       },
//       subscription: {
//     relation: BaseModel.HasManyRelation,
//     modelClass: Subscription,
//     join: {
//       from: "barbers.id",
//       to: "subscriptions.barberId"
//     }
//   }
//     };
//   }
// }
