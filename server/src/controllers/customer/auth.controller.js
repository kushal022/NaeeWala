import bcrypt from "bcryptjs";
import { User, Session, Otp } from "../../models/index.js";
import { generateUniqueUsername } from "../../utils/helper/usernameHelper.js";
import { registerSchema } from "../../validators/customer/auth.validator.js";
import { success } from "zod";
import { resSend } from "../../utils/helper/resHelper.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/helper/jwtHelper.js";
import { setCookie } from "../../utils/helper/cookieHelper.js";

// import {
//   signAccessToken,
//   signRefreshToken,
//   verifyRefreshToken,
// } from "../utils/jwt.js";
// import { setAuthCookies, clearAuthCookies } from "../utils/cookies.js";

const access_token_cookie_exp = Number( 15*60* 1000)
const refresh_token_cookie_exp = Number( 7*24*60*60* 1000)

//  * CUSTOMER REGISTER (OTP verified assumed)
export const registerCustomerCtrl = async (req, res) => {
  try {
    // Validate input
    const {success, data, error } = registerSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.flatten(),
      });
    }

    const { firstName, lastName, email, phone, password } = data;
    const fullName = `${firstName} ${lastName}`
    // Check existing user
    const existing = await User.query()
  .where("email", email)
  .orWhere("phone", phone)
  .first();

    if (existing) {
      return res.status(409).json({success:false, message: "Email or Phone already registered" });
    }

    // Generate username
    const username = await generateUniqueUsername(fullName,email);

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.query().insert({
      firstName,
      lastName,
      email,
      phone,
      username,
      password: hashedPassword,
      role: "customer",
    });

    console.log(`✅ Customer registration success for ${user.email} `)

    return res.status(201).json({
      success:true,
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({success:false, message: "Internal server error" });
  }
};


//  * LOGIN
export const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;
     if (!email || !password) {
      return resSend(res, 400, {success:false, message: "Email and password required" });
    }

    const user = await User.query().findOne({ email });
    if (!user) {
      return res.status(401).json({success:false, message: "Invalid credentials" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({success:false, message: "Invalid credentials" });
    }

    // Create tokens
    const accessToken = generateAccessToken({ id: user.id, role: user.role, username: user.username, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Save refresh token in DB (rotation-friendly)
    const expiresIn = Number(process.env.REFRESH_TOKEN_EXPIRES_IN ?? 60 * 60 * 24 * 7);
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

     // Track userAgent / ip
    // const userAgent = req.headers.get("user-agent") ?? undefined;
    // const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? undefined;
    const userAgent = req.headers["user-agent"] ?? undefined;
    const ip = req.ip ?? undefined;

    const session = await Session.query().insert({
      userId: user.id,
      refreshToken,
      userAgent: userAgent,
      ip: ip,
      expiresAt:toString(expiresAt),
    });
    if (!session) resSend(res, 400, {success: false, error: "Session is not created!"})
    setCookie(res,{name:"access_token", value: accessToken, maxAgeSec: access_token_cookie_exp});
    setCookie(res,{name:"refresh_token", value: refreshToken, maxAgeSec: refresh_token_cookie_exp});
    console.log(`✅ User login success for ${user.email} `)

    return resSend(res, 200, {
      success:true,
      message: "Login successful",
      user: {
        id: user.id,
        // role: user.role,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({success:false, message: "Server error" });
  }
};

// /**
//  * REFRESH TOKEN
//  */
// export const refresh = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.sendStatus(401);

//     const payload = verifyRefreshToken(token);

//     const session = await Session.query()
//       .where({ refreshToken: token })
//       .andWhere("expiresAt", ">", new Date())
//       .first();

//     if (!session) return res.sendStatus(403);

//     const user = await User.query().findById(payload.userId);

//     const newAccessToken = signAccessToken(user);
//     setAuthCookies(res, newAccessToken, token);

//     res.json({ message: "Token refreshed" });
//   } catch (err) {
//     res.sendStatus(403);
//   }
// };

// /**
//  * LOGOUT
//  */
// export const logout = async (req, res) => {
//   const token = req.cookies.refreshToken;

//   if (token) {
//     await Session.query().delete().where({ refreshToken: token });
//   }

//   clearAuthCookies(res);
//   res.json({ message: "Logged out" });
// };
