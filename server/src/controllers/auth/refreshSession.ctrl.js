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

//  ^ REFRESH TOKEN // update session time when use
export const refresh = async (req, res) => {
    try {
        const incomingRefresh = req.cookies.refresh_token;
        if (!incomingRefresh) {
            return resSend(res, 401, { success: false, message: "No refresh token" })
        };

        // verify token signature
        let payload;
        try {
            payload = verifyRefreshToken(incomingRefresh);
        } catch (e) {
            // invalid token - clear cookies
            clearCookie(res, "access_token")
            clearCookie(res, "refresh_token")
            return resSend(res, 401, { success: false, message: "Invalid refresh token" });
        }
        // check session in db
        const session = await Session.query()
            .where({ refreshToken: incomingRefresh })
            .andWhere("expiresAt", ">", new Date()) // review this when use
            .first();

        if (!session) {
            clearCookie(res, "access_token")
            clearCookie(res, "refresh_token")
            return resSend(res, 401, { success: false, message: "Refresh token not found or expired" });
        }

        const newRefresh = generateRefreshToken({ id: session.userId })
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
        return resSend(res, 200, { success: true, ok: true, message: "Refresh token rotate success" });
    } catch (err) {
        console.error("❌ REFRESH ERROR:", err);
        return resSend(res, 500, { success: false, message: "Server error" });
    }
};
