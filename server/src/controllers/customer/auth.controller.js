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

// import {
//   signAccessToken,
//   signRefreshToken,
//   verifyRefreshToken,
// } from "../utils/jwt.js";
// import { setAuthCookies, clearAuthCookies } from "../utils/cookies.js";

const access_token_cookie_exp =Number( process.env.ACCESS_TOKEN_COOKIE_EXP || 15 * 60 * 1000); //900000 : 15MIN
const refresh_token_cookie_exp =Number( process.env.REFRESH_TOKEN_COOKIE_EXP || 7 * 24 * 60 * 60 * 1000); //86400000*7=604800000 7DAYS
const session_exp_at =Number( process.env.SESSION_EXP_AT || 7 * 24 * 60 * 60 * 1000); //86400000*7=604800000 7DAYS

//  * CUSTOMER REGISTER (OTP verified assumed)
export const registerCustomerCtrl = async (req, res) => {
  try {
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

    // Generate username
    const username = await generateUniqueUsername(fullName, email);

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

    console.log(`✅ Customer registration success for ${user.email} `);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
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

//  * LOGIN
export const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return resSend(res, 400, {
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.query().findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create tokens
    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Save refresh token in DB (rotation-friendly)
    const expiresAt = new Date(Date.now() + session_exp_at);
    // console.log(expiresAt)

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
      expiresAt: (expiresAt).toISOString(),
    });
    if (!session){
      resSend(res, 400, { success: false, error: "Session is not created!" });
    }
    setCookie(res, {
      name: "access_token",
      value: accessToken,
      maxAgeSec: access_token_cookie_exp,
    });
    setCookie(res, {
      name: "refresh_token",
      value: refreshToken,
      maxAgeSec: refresh_token_cookie_exp,
    });
    console.log(`✅ User login success for ${user.email} `);
    console.log("userAgent: ", userAgent)
    console.log("ip:- ", ip)

    return resSend(res, 200, {
      success: true,
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
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  ^ REFRESH TOKEN // update session time when use
export const refresh = async (req, res) => {
  try {
    const incomingRefresh = req.cookies.refresh_token;
    if (!incomingRefresh) {
      return resSend(res, 401, {success:false, message: "No refresh token"} )
    };

    // verify token signature
    let payload;
    try {
      payload =  verifyRefreshToken(incomingRefresh);
    } catch (e) {
      // invalid token - clear cookies
      clearCookie(res, "access_token")
      clearCookie(res, "refresh_token")
      return resSend(res, 401, {success:false, message: "Invalid refresh token" });
    }
    // check session in db
    const session = await Session.query()
      .where({ refreshToken: incomingRefresh })
      .andWhere("expiresAt", ">", new Date()) // review this when use
      .first();

    if (!session) {
      clearCookie(res, "access_token")
      clearCookie(res, "refresh_token")
      return resSend(res, 401, {success:false, message: "Refresh token not found or expired" });
    }

    const newRefresh = generateRefreshToken({id: session.userId})
    const expiresAt = new Date(Date.now() + session_exp_at);

    const userAgent = req.headers["user-agent"] ?? undefined;
    const ip = req.ip ?? undefined;

    // delete old session and create new one (atomic)
    await knex.transaction(async (trx) => {
      await Session.query(trx)
        .deleteById(session.id);

      await Session.query(trx).insert({
        userId: session.user_id,
        refreshToken: newRefresh,
        userAgent: userAgent ?? null,
        ip,
        expiresAt: expiresAt.toISOString(),
      });
    });

    const user = await User.query().findById(payload.id);
    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    });

    setCookie(res, {
      name: "access_token",
      value: accessToken,
      maxAgeSec: access_token_cookie_exp,
    });
    setCookie(res, {
      name: "refresh_token",
      value: newRefresh,
      maxAgeSec: refresh_token_cookie_exp,
    });
    return resSend(res, 200, {success:true, ok: true, message:"Refresh token rotate success"});
  } catch (err) {
    console.error("❌ REFRESH ERROR:", err);
    return resSend(res, 500, {success:false, message: "Server error" } );
  }
};

//  * LOGOUT
export const logoutCtrl = async (req, res) => {
  try {
    const incomingRefresh = req.cookies.refresh_token;
    // console.log('incomingRefresh: ', incomingRefresh)
    if(!incomingRefresh){
      return resSend(res, 400, {success:false, message: "You are not loggedIn"})
    }
    if (incomingRefresh) {
      await Session.query().delete().where({ refreshToken: incomingRefresh });
    }
    const decoded = verifyRefreshToken(incomingRefresh);

    clearCookie(res, "access_token");
    clearCookie(res, "refresh_token");
    console.log(`✅ User logout success! Id: ${decoded.id}`);
    return resSend(res, 200, {
      success: true,
      ok: true,
      message: "Logout success!",
    });
  } catch (err) {
    console.error("❌LOGOUT ERROR:", err);
    return resSend(res, 500, { success: false, message: "Server error" });
  }
};
