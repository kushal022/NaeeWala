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

        // Session:
        const refreshToken = generateRefreshToken({ id: user.id, username: user.username });
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
        if (!session) {
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
        console.log(`✅ User (${user.role}) login success for ${user.email} `);
        console.log("userAgent: ", userAgent)
        console.log("ip:- ", ip)

        return resSend(res, 200, {
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                // role: user.role,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.fullName,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("❌ LOGIN ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
