import { Session } from "../../models/index.js";
import { resSend } from "../../utils/helper/resHelper.js";
import {
    verifyRefreshToken,
} from "../../utils/helper/jwtHelper.js";
import { clearCookie } from "../../utils/helper/cookieHelper.js";

//  * LOGOUT
export const logoutCtrl = async (req, res) => {
    try {
        const incomingRefresh = req.cookies.refresh_token;
        // console.log('incomingRefresh: ', incomingRefresh)
        if (!incomingRefresh) {
            return resSend(res, 400, { success: false, message: "You are not loggedIn" })
        }
        if (incomingRefresh) {
            await Session.query().delete().where({ refreshToken: incomingRefresh });
        }
        const decoded = verifyRefreshToken(incomingRefresh);

        clearCookie(res, "access_token");
        clearCookie(res, "refresh_token");
        console.log(`✅ User logout success! Id: ${decoded.username}`);
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
