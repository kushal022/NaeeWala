import { z } from "zod";

/* -----------------------------
  Reusable primitives
------------------------------ */
const phone = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Invalid phone number");

const strongPassword = z
  .string()
  .min(6, "Password must be at least 8 characters")
// .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
// .regex(/[a-z]/, "Password must contain at least one lowercase letter")
// .regex(/[0-9]/, "Password must contain at least one number");

const latLng = z.number().min(-180).max(180);


// Auth:
export const registerSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  // fullName: z.string().min(1).optional(), // optional if you send fullName
  email: z.string().email(),
  phone: phone,
  password: strongPassword,
});

/* -----------------------------
  Address schema
------------------------------ */
const addressSchema = z.object({
  street: z.string().min(1),
  landmark: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().default("India").optional(),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  lat: latLng,
  lng: latLng,
});

/* -----------------------------
  Shop schema (optional)
------------------------------ */
const shopSchema = z.object({
  shopName: z.string().min(3),
  description: z.string().max(500).optional(),
  shopType: z.enum(["salon", "barber", "unisex"]),
});

import { z } from "zod";

export const deleteShopSchema = z.object({
  params: z.object({
    shopId: z.coerce.number().int().positive(),
  }),
});


// src/validators/barberShop.validator.js
import { z } from "zod";

export const createShopSchema = z.object({
  shopName: z.string().min(3),
  description: z.string().optional(),
  licenseNo: z.string().optional(),
  shopType: z.string().optional(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  addressId: z.number().optional()
});


/* -----------------------------
  Bank schema (optional)
------------------------------ */
const bankSchema = z.object({
  accountHolderName: z.string().min(3),
  accountNumber: z.string().min(6).max(18),
  ifsc: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  bankName: z.string().min(3),

  upiId: z
    .string()
    .regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID")
    .optional(),

  gstNumber: z
    .string()
    .regex(
      /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/,
      "Invalid GST number"
    )
    .optional(),

  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, "Invalid Aadhaar number")
    .optional(),

  panNumber: z
    .string()
    .regex(/^[A-Z]{5}\d{4}[A-Z]{1}$/, "Invalid PAN number")
    .optional(),
});

/* -----------------------------
  Main registration schema
------------------------------ */
export const barberRegisterSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),

  email: z.string().email(),
  phone: phone,

  password: strongPassword,
  otp: z.string().length(6).optional(), // optional since you’re not validating it here

  address: addressSchema.optional(),
  shop: shopSchema.optional(),
  bank: bankSchema.optional(),
});


let location_obj_nominatim = [
  {
    "place_id": 226223110,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 359770137,
    "lat": "28.6142483",
    "lon": "77.2018009",
    "class": "historic",
    "type": "monument",
    "place_rank": 30,
    "importance": 0.250991283779456,
    "addresstype": "historic",
    "name": "Jaipur Column",
    "display_name": "Jaipur Column, Kartavya Path, Central Secretariat, Chanakya Puri Tehsil, New Delhi, Delhi, 110004, India",
    "boundingbox": [
      "28.6142136",
      "28.6142830",
      "77.2017651",
      "77.2018368"
    ]
  }
]

let googleRes = {
  "results": [
    {
      "address_components": [
        {
          "long_name": "Alwar",
          "short_name": "Alwar",
          "types": [
            "locality",
            "political"
          ]
        },
        {
          "long_name": "Alwar",
          "short_name": "Alwar",
          "types": [
            "administrative_area_level_3",
            "political"
          ]
        },
        {
          "long_name": "Jaipur Division",
          "short_name": "Jaipur Division",
          "types": [
            "administrative_area_level_2",
            "political"
          ]
        },
        {
          "long_name": "Rajasthan",
          "short_name": "RJ",
          "types": [
            "administrative_area_level_1",
            "political"
          ]
        },
        {
          "long_name": "India",
          "short_name": "IN",
          "types": [
            "country",
            "political"
          ]
        }
      ],
      "formatted_address": "Alwar, Rajasthan, India",
      "geometry": {
        "bounds": {
          "northeast": {
            "lat": 27.6197409,
            "lng": 76.7151261
          },
          "southwest": {
            "lat": 27.4895426,
            "lng": 76.5776254
          }
        },
        "location": {
          "lat": 27.5529907,
          "lng": 76.6345735
        },
        "location_type": "APPROXIMATE",
        "viewport": {
          "northeast": {
            "lat": 27.6197409,
            "lng": 76.7151261
          },
          "southwest": {
            "lat": 27.4895426,
            "lng": 76.5776254
          }
        }
      },
      "place_id": "ChIJ813mp4-ZcjkR8ibknqO7zjg",
      "types": [
        "locality",
        "political"
      ]
    }
  ],
  "status": "OK"
}


let snd = {
  "results":
    [
      {
        "address_components":
          [
            {
              "long_name": "38, Jagsheelachal",
              "short_name": "38, Jagsheelachal",
              "types":
                [
                  "subpremise"
                ]
            },
            {
              "long_name": "Plot no E",
              "short_name": "Plot no E",
              "types":
                [
                  "premise"
                ]
            },
            {
              "long_name": "Jawahar Circle",
              "short_name": "Jawahar Circle",
              "types":
                [
                  "route"
                ]
            },
            {
              "long_name": "Gokul Vatika",
              "short_name": "Gokul Vatika",
              "types":
                [
                  "neighborhood",
                  "political"
                ]
            },
            {
              "long_name": "Chandrakala Colony",
              "short_name": "Chandrakala Colony",
              "types":
                [
                  "political",
                  "sublocality",
                  "sublocality_level_2"
                ]
            },
            {
              "long_name": "Durgapura",
              "short_name": "Durgapura",
              "types":
                [
                  "political",
                  "sublocality",
                  "sublocality_level_1"
                ]
            },
            {
              "long_name": "Jaipur",
              "short_name": "Jaipur",
              "types":
                [
                  "locality",
                  "political"
                ]
            },
            {
              "long_name": "Jaipur",
              "short_name": "Jaipur",
              "types":
                [
                  "administrative_area_level_3",
                  "political"
                ]
            },
            {
              "long_name": "Jaipur Division",
              "short_name": "Jaipur Division",
              "types":
                [
                  "administrative_area_level_2",
                  "political"
                ]
            },
            {
              "long_name": "Rajasthan",
              "short_name": "RJ",
              "types":
                [
                  "administrative_area_level_1",
                  "political"
                ]
            },
            {
              "long_name": "India",
              "short_name": "IN",
              "types":
                [
                  "country",
                  "political"
                ]
            },
            {
              "long_name": "302018",
              "short_name": "302018",
              "types":
                [
                  "postal_code"
                ]
            }
          ],
        "formatted_address": "38, Jagsheelachal, Plot no E, Jawahar Circle, Gokul Vatika, Chandrakala Colony, Durgapura, Jaipur, Rajasthan 302018, India",
        "geometry":
        {
          "location":
          {
            "lat": 26.842431,
            "lng": 75.79791949999999
          },
          "location_type": "ROOFTOP",
          "viewport":
          {
            "northeast":
            {
              "lat": 26.8437822802915,
              "lng": 75.79926073029152
            },
            "southwest":
            {
              "lat": 26.8410843197085,
              "lng": 75.7965627697085
            }
          }
        },
        "navigation_points":
          [
            {
              "location":
              {
                "latitude": 26.8424236,
                "longitude": 75.79794530000001
              }
            }
          ],
        "partial_match": true,
        "place_id": "ChIJR9ktPkO1bTkRgyxzYDYMy-Y",
        "plus_code":
        {
          "compound_code": "RQRX+X5 Jaipur, Rajasthan, India",
          "global_code": "7JRQRQRX+X5"
        },
        "types":
          [
            "establishment",
            "lodging",
            "point_of_interest"
          ]
      }
    ],
  "status": "OK"
}
