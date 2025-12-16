import crypto from "crypto";
import { resSend } from "../../utils/helper/resHelper.js";
import knex from "../../db/knex.js";
import { Otp, User } from "../../models/index.js";
import { sendEmail } from "../../utils/helper/sendEmailHelper.js";
import { otpText } from "../../utils/emailText/emailText.js";

const OTP_EXPIRY_MINUTE = process.env.OTP_EXPIRY_MINUTE || 5;
const OTP_RATE_LIMIT_MINUTE = process.env.OTP_RATE_LIMIT_MINUTE || 1; // 1 OTP per minute per user
const MAX_OTP_ATTEMPTS = process.env.MAX_OTP_ATTEMPTS || 5;


export async function sendOtpCtrl(req, res) {
  try {
    const { to, via = "email" } = req.body;

    if (!to) {
      return resSend(res, 400, { success: false, message: "Missing target" });
    }

    const channel = via === "sms" ? "SMS" : "EMAIL";

    // RATE LIMIT (anti-spam)
    const recentOtp = await Otp.query()
      .where("to", to)
      .where("createdAt", ">", new Date(Date.now() - OTP_RATE_LIMIT_MINUTE * 60 * 1000))
      .first();

    if (recentOtp) {
      return resSend(res, 429, { success: false, message: "Please wait before requesting another OTP" });
    }

    // Generate OTP
    const plainCode = crypto.randomInt(100000, 999999).toString();
    const hashedCode = crypto
      .createHash("sha256")
      .update(plainCode)
      .digest("hex");

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTE * 60 * 1000);

    // Atomic: remove old OTPs & insert new one
    await knex.transaction(async (trx) => {
      await Otp.query(trx)
        .where("to", to)
        .delete();

      await Otp.query(trx).insert({
        to,
        via: channel,
        code: hashedCode,
        expiresAt: toString(expiresAt),
      });
    });

    // Send OTP
    if (channel === "EMAIL") {
      const mailData = otpText(plainCode);
      await sendEmail(to, mailData.subject, mailData.text);
    }
    // else { Twilio SMS here }

    console.log(`✔️ OTP ${plainCode} sent via ${channel} to ${to}`);
    return resSend(res, 200, { success: true, ok: true, message: `OTP sent to ${to}` });
  } catch (err) {
    console.error("❌ SEND OTP ERROR:", err);
    return resSend(res, { success: false, message: "Failed to send OTP" }, 500);
  }
}



export async function verifyOtpCtrl(req, res) {
  try {
    const { to, code } = req.body;

    console.log(to, code)

    if (!to || !code) {
      return resSend(res, 400, { success: false, error: "Missing fields" });
    }

    // Hash incoming OTP
    const hashedCode = crypto
      .createHash("sha256")
      .update(String(code))
      .digest("hex");

    // Find latest valid OTP
    const otp = await Otp.query()
      .where("to", to)
      .where("used", false)
      // .where("expiresAt", ">", new Date())
      .orderBy("createdAt", "desc")
      .first();
    // no otp found
      if (!otp) {
        return resSend(res, 400, { success: false, message: "Invalid or expired OTP" });
    }

    // Check expire
    if (Number(otp.expiresAt) > new Date()) {
      return resSend(res, 400,{ success: false, message: "Invalid or expired OTP!" });
    }
    // Check attempt limit
    if (otp.attempts >= MAX_OTP_ATTEMPTS) {
      return resSend(res, 403,{ success: false, message: "OTP locked. Please resend." });
    }
    // Validate OTP code
    if (otp.code !== hashedCode) {
      await Otp.query()
        .findById(otp.id)
        .patch({ attempts: otp.attempts + 1 });

      return resSend(res,400, { success: false, message: "Invalid OTP" });
    }

    // ATOMIC SECTION (mark OTP used + user logic)
    let user;

    await knex.transaction(async (trx) => {
      // mark OTP as used
      await Otp.query(trx)
        .findById(otp.id)
        .patch({ used: true });

      // cleanup all OTPs for this target
      await Otp.query(trx)
        .where("to", to)
        .delete();

      // find or create user
    //   user =
    //     (await User.query(trx).findOne({ email: to })) ||
    //     (await User.query(trx).findOne({ phone: to }));

    //   if (!user) {
    //     user = await User.query(trx).insert({
    //       email: to.includes("@") ? to : null,
    //       phone: to.includes("@") ? null : to,
    //       role: "customer",
    //     });
    //   }
    });

    // Generate tokens
    // const accessToken = generateAccessToken({
    //   id: user.id,
    //   role: user.role,
    // });

    // const refreshToken = generateRefreshToken({
    //   id: user.id,
    // });

    console.log(`✔️ OTP verified & user ${to} authenticated. `);

    return resSend(
      res, 200, 
      {
        success: true,
        ok: true,
        message: "OTP verified successfully",
        // data: {
        //   user: {
        //     id: user.id,
        //     email: user.email,
        //     phone: user.phone,
        //     role: user.role,
        //   },
        //   accessToken,
        //   refreshToken,
        // },
      },
    );
  } catch (err) {
    console.error("❌ OTP VERIFY ERROR:", err);
    return resSend(res, 500, { success: false, message: "Server error" });
  }
}

