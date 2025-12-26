import bcrypt from "bcryptjs";
import { User, Session, Otp } from "../../models/index.js";
import { generateUniqueUsername } from "../../utils/helper/usernameHelper.js";
import { registerSchema } from "../../validators/customer/auth.validator.js";
import { success } from "zod";
import { resSend } from "../../utils/helper/resHelper.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/helper/jwtHelper.js";
import { clearCookie, setCookie } from "../../utils/helper/cookieHelper.js";

const access_token_cookie_exp = Number(process.env.ACCESS_TOKEN_COOKIE_EXP || 15 * 60 * 1000); //900000 : 15MIN
const refresh_token_cookie_exp = Number(process.env.REFRESH_TOKEN_COOKIE_EXP || 7 * 24 * 60 * 60 * 1000); //86400000*7=604800000 7DAYS
const session_exp_at = Number(process.env.SESSION_EXP_AT || 7 * 24 * 60 * 60 * 1000); //86400000*7=604800000 7DAYS

//  * REGISTER 
export const registerCustomerCtrl = async (req, res) => {
  try {
    const { role = "customer" } = req.body;
    // Validate input
    const { success, data, error } = registerSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.flatten(),
      });
    }

    const { firstName, lastName, email, phone, password } = data;
    const fullName = `${firstName} ${lastName}`;

    // Generate username
    const username = await generateUniqueUsername(fullName, email);

    // Check existing user
    const existing = await User.query()
      .where("email", email)
      .orWhere("phone", phone)
      .first();

    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email or Phone already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.query().insert({
      firstName,
      lastName,
      email,
      phone,
      username,
      password: hashedPassword,
      role: role ? role : "customer",
    });

    // barber profile
    if (role === "barber") {
      barber = await Barber.query().insert({
        userId: user.id,
        status: "pending",
      });
    }

    console.log(`✅ ${role ? role : "Customer"} registration success for ${user.email} `);

    return res.status(201).json({
      success: true,
      message: "New user registered successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

