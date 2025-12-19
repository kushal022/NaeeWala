import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Address, Bank, Barber, BarberShop, Otp, Session, User } from "../../models/index.js";
import { resSend } from "../../utils/helper/resHelper.js";
import { generateUniqueUsername } from "../../utils/helper/usernameHelper.js";
import knex from "../../db/knex.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/helper/jwtHelper.js";

// import User from "@/models/User.js";
// import OTP from "@/models/OTP.js";
// import Address from "@/models/Address.js";
// import Barber from "@/models/Barber.js";
// import BarberShop from "@/models/BarberShop.js";
// import Bank from "@/models/Bank.js";
// import Session from "@/models/Session.js";

// import { resSend } from "@/utils/helper/resHelper.js";
// import { generateUniqueUsername } from "@/utils/helper/usernameHelper.js";
// import {
//   generateAccessToken,
//   generateRefreshToken
// } from "@/utils/helper/jwtHelper.js";
// import { setCookie } from "@/utils/helper/cookieHelper.js";

const access_token_cookie_exp =Number( process.env.ACCESS_TOKEN_COOKIE_EXP || 15 * 60 * 1000); //900000 : 15MIN
const refresh_token_cookie_exp =Number( process.env.REFRESH_TOKEN_COOKIE_EXP || 7 * 24 * 60 * 60 * 1000); //86400000*7=604800000 7DAYS
const session_exp_at =Number( process.env.SESSION_EXP_AT || 7 * 24 * 60 * 60 * 1000); //86400000*7=604800000 7DAYS


export async function barberRegisterCtrl(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      otp,
      address,
      shop,
      bank
    } = req.body;

    /* ---------------------------
       VERIFY OTP (hashed)
    ---------------------------- */
    // const hashedOtp = crypto
    //   .createHash("sha256")
    //   .update(String(otp))
    //   .digest("hex");

    // const otpRecord = await OTP.query()
    //   .where("to", email)
    //   .where("code", hashedOtp)
    //   .where("used", false)
    //   .where("expires_at", ">", new Date())
    //   .orderBy("created_at", "desc")
    //   .first();

    // if (!otpRecord) {
    //   return resSend(
    //     res,
    //     { success: false, error: "Invalid or expired OTP" },
    //     400
    //   );
    // }

    /* ---------------------------
     CHECK USER EXISTS
    ---------------------------- */
    const exists = await User.query()
      .where("email", email)
      .orWhere("phone", phone)
      .first();

    if (exists) {
      return resSend(res, 409,{ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const fullName = `${firstName} ${lastName}`;
    const username = await generateUniqueUsername(fullName, email);

    /* ---------------------------
     ATOMIC CREATION
    ---------------------------- */
    let newUser, barber;

    await knex.transaction(async (trx) => {
      // mark OTP used
    //   await Otp.query(trx)
    //     .findById(otpRecord.id)
    //     .patch({ used: true });

    //   // cleanup other OTPs
    //   await OTP.query(trx)
    //     .where("to", email)
    //     .delete();

      // create user
      newUser = await User.query(trx).insert({
        firstName: firstName,
        lastName: lastName,
        username,
        email,
        phone,
        password: hashedPassword,
        role: "barber",
        isEmailVerified: true,
        isPhoneVerified: true,
      });

      // address
      let newAddress;
      if (address) {
        newAddress = await Address.query(trx).insert({
          street: address.street,
          landmark: address.landmark,
          city: address.city,
          state: address.state,
          country: address.country ?? "India",
          pincode: address.pincode,
          lat: address.lat,
          lng: address.lng,
        });
      }

      // barber profile
      barber = await Barber.query(trx).insert({
        userId: newUser.id,
        status: "pending",
        addressId: newAddress?.id
      });

      // shop (optional)
      if (shop) {
        await BarberShop.query(trx).insert({
          barberId: barber.id,
          shopName: shop.shopName,
          description: shop.description,
          shopType: shop.shopType,
        });
      }

      // bank (optional)
      if (bank) {
        await Bank.query(trx).insert({
          barberId: barber.id,
          accountHolderName: bank.accountHolderName,
          accountNumber: bank.accountNumber,
          ifsc: bank.ifsc,
          bankName: bank.bankName,
          UpiId: bank.upiId,
          gstNumber: bank.gstNumber,
          aadhaarNumber: bank.aadhaarNumber,
          panNumber: bank.panNumber,
        });
      }
    });

    /* ---------------------------
       TOKENS
    ---------------------------- */
    const accessToken = generateAccessToken({
      id: newUser.id,
      role: "barber",
      username,
    });

    const refreshToken = generateRefreshToken({ id: newUser.id });
     const userAgent = req.headers["user-agent"] ?? undefined;
    const ip = req.ip ?? undefined;
    const expiresAt = (new Date(Date.now() +  session_exp_at));
    // console.log("expiresAt:", expiresAt.toISOString())


    /* ---------------------------
        SAVE SESSION
    ---------------------------- */
    await Session.query().insert({
      userId: newUser.id,
      refreshToken: refreshToken,
      userAgent,
      ip,
      expiresAt: (expiresAt).toISOString()
    });

        // RESPONSE
    const response = resSend(
      res, 201,
      {
        success: true,
        message: "Barber registered successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          role: "barber",
        },
      });

    // setCookie(response, {
    //   name: "access_token",
    //   value: accessToken,
    //   maxAgeSec: Number(process.env.ACCESS_TOKEN_EXPIRES_IN ?? 900),
    // });

    // setCookie(response, {
    //   name: "refresh_token",
    //   value: refreshToken,
    //   maxAgeSec: Number(process.env.REFRESH_TOKEN_EXPIRES_IN ?? 7 * 24 * 3600),
    // });

    console.log(`✅ Barber registered: ${newUser.email}`);
    return response;

  } catch (err) {
    console.error("❌ BARBER REGISTER ERROR:", err);
    return resSend(
      res,500,
      { success: false, message: "Server error" },
    );
  }
}
